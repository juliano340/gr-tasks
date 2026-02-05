"use server"

import { auth } from "@/auth"
import { stripe } from "@/lib/stripe"
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"

const prisma = new PrismaClient()

export async function createCheckoutSession() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  // Busca ou cria subscription record
  let subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  })

  if (!subscription) {
    subscription = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        plan: "free",
      },
    })
  }

  // Se já é premium, redireciona para portal
  if (subscription.plan === "premium") {
    redirect("/dashboard/settings")
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

  // Cria ou usa Stripe Customer
  let customerId = subscription.stripeCustomerId

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email!,
      metadata: {
        userId: session.user.id,
      },
    })
    customerId = customer.id

    await prisma.subscription.update({
      where: { userId: session.user.id },
      data: { stripeCustomerId: customerId },
    })
  }

  // Cria Checkout Session
  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PREMIUM_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/dashboard/tasks?success=true`,
    cancel_url: `${baseUrl}/dashboard/upgrade?canceled=true`,
    metadata: {
      userId: session.user.id,
    },
  })

  redirect(checkoutSession.url!)
}

export async function createPortalSession() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  })

  if (!subscription?.stripeCustomerId) {
    redirect("/dashboard/upgrade")
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${baseUrl}/dashboard/settings`,
  })

  redirect(portalSession.url)
}
