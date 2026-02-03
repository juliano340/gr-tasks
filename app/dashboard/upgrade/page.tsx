import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { createCheckoutSession, createPortalSession } from "@/app/stripe-actions"

export default async function UpgradePage() {
  const session = await auth()

  if (!session) {
    redirect("/")
  }

  const subscription = await (prisma as any).subscription.findUnique({
    where: { userId: session.user!.id! },
  })

  const isPremium = subscription?.plan === "premium"

  return (
    <div className="min-h-screen bg-surface-dim dark:bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full border border-indigo-100 dark:border-indigo-800">
             <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Planos e Preços</span>
          </div>
          <h1 className="text-5xl font-black text-foreground tracking-tight">
            {isPremium ? "Assinatura Ativa 💎" : "Liberte sua produtividade"}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto leading-relaxed font-medium">
            {isPremium 
              ? "Você já faz parte da elite da produtividade. Gerencie seu plano abaixo." 
              : "Escolha o plano ideal para o seu momento e comece a realizar mais agora mesmo."}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <div className="bg-white dark:bg-card rounded-3xl p-10 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-black text-foreground mb-2">Plano Grátis</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-foreground tracking-tight">R$ 0</span>
                <span className="text-gray-600 font-black">/mês</span>
              </div>

              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 font-medium">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Até <strong className="text-foreground font-black">5 tarefas</strong> simultâneas
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 font-medium">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Sincronização básica
                </li>
              </ul>
            </div>

            <div className="w-full py-4 bg-gray-50 dark:bg-gray-800 text-center rounded-2xl font-black text-xs text-gray-400 uppercase tracking-widest">
              Plano Atual
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-foreground dark:bg-white rounded-3xl p-10 shadow-2xl shadow-indigo-200 dark:shadow-none relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 right-0 p-4">
              <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-tighter">Mais Vendido</span>
            </div>

            <div className="relative z-10">
              <h3 className="text-xl font-black text-background dark:text-black mb-2">Premium 💎</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-background dark:text-black tracking-tight">R$ 9,90</span>
                <span className="text-indigo-200 dark:text-gray-500 font-black">/mês</span>
              </div>

              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-sm text-background dark:text-black opacity-90">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Até <strong className="font-black">50 tarefas</strong> ilimitadas
                </li>
                <li className="flex items-center gap-3 text-sm text-background dark:text-black opacity-90">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Suporte Prioritário
                </li>
                <li className="flex items-center gap-3 text-sm text-background dark:text-black opacity-90">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Novas ferramentas primeiro
                </li>
              </ul>
            </div>

            <div className="relative z-10">
              {isPremium ? (
                <form action={async () => { "use server"; await createPortalSession() }}>
                  <button
                    type="submit"
                    className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                  >
                    Gerenciar Plano
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </form>
              ) : (
                <form action={async () => { "use server"; await createCheckoutSession() }}>
                  <button
                    type="submit"
                    className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                  >
                    Começar Agora
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </form>
              )}
            </div>
            
            {/* Background decorativo abstract no card */}
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link 
            href="/dashboard/tasks" 
            className="text-sm font-black text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para minhas tarefas
          </Link>
        </div>
      </div>
    </div>
  )
}
