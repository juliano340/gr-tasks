import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { logToFile } from "@/lib/logger"
import Stripe from "stripe"

export async function POST(req: Request) {
  logToFile("🔔 [Stripe Webhook] Recebido!")
  
  const body = await req.text()
  const sig = (await headers()).get("stripe-signature")

  if (!sig) {
    logToFile("❌ [Stripe Webhook] Assinatura ausente")
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    logToFile(`❌ [Stripe Webhook] Erro na assinatura: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  logToFile(`✅ [Stripe Webhook] Evento verificado: ${event.type}`)

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (!userId) {
          logToFile("❌ [Stripe Webhook] userId não encontrado nos metadados")
          return NextResponse.json({ error: "No userId in metadata" }, { status: 400 })
        }

        const subscriptionId = session.subscription as string
        if (!subscriptionId) {
          logToFile("❌ [Stripe Webhook] subscriptionId ausente no checkout.session.completed")
          return NextResponse.json({ error: "No subscriptionId" }, { status: 400 })
        }

        logToFile(`⏳ [Stripe Webhook] Processando checkout.session.completed para user ${userId}, sub ${subscriptionId}`)
        
        try {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          logToFile(`📦 [Stripe Webhook] Full Subscription Object: ${JSON.stringify(subscription)}`)
          
          const currentPeriodEnd = (subscription as any).current_period_end
          logToFile(`📅 [Stripe Webhook] Raw current_period_end: ${currentPeriodEnd}`)

          // Se por algum motivo o Stripe não mandar a data, vamos usar "agora + 30 dias" como fallback
          const finalDate = currentPeriodEnd 
            ? new Date(currentPeriodEnd * 1000) 
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

          await (prisma as any).subscription.update({
            where: { userId },
            data: {
              stripeSubscriptionId: subscriptionId,
              stripePriceId: (subscription as any).items.data[0].price.id,
              stripeCurrentPeriodEnd: finalDate,
              plan: "premium",
            },
          })

          logToFile(`🚀 [Stripe Webhook] Usuário ${userId} agora é Premium!`)
        } catch (error: any) {
          logToFile(`❌ [Stripe Webhook] Erro ao buscar sub ou atualizar banco: ${error.message}`)
          throw error // Relança para o catch de fora
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        logToFile(`⏳ [Stripe Webhook] Processando customer.subscription.updated para ${subscription.id}`)
        
        const sub = await (prisma as any).subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        })

        if (sub) {
          const currentPeriodEnd = (subscription as any).current_period_end
          logToFile(`📅 [Stripe Webhook] Updated sub. Raw current_period_end: ${currentPeriodEnd}`)

          await (prisma as any).subscription.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              stripePriceId: subscription.items.data[0].price.id,
              stripeCurrentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : undefined,
              plan: subscription.status === "active" ? "premium" : "free",
            },
          })
          logToFile(`🔄 [Stripe Webhook] Assinatura ${subscription.id} atualizada`)
        } else {
          logToFile(`⚠️ [Stripe Webhook] Assinatura ${subscription.id} não encontrada no banco`)
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        logToFile(`⏳ [Stripe Webhook] Processando customer.subscription.deleted para ${subscription.id}`)
        
        const sub = await (prisma as any).subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        })

        if (sub) {
          await (prisma as any).subscription.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              plan: "free",
              stripeSubscriptionId: null,
              stripePriceId: null,
              stripeCurrentPeriodEnd: null,
            },
          })
          logToFile(`❌ [Stripe Webhook] Assinatura ${subscription.id} removida do banco`)
        }
        break
      }

      default:
        logToFile(`ℹ️ [Stripe Webhook] Evento não tratado: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    logToFile(`❌ [Stripe Webhook] Erro ao processar evento: ${error.message}`)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}
