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
    // Fundo seguindo o padrão da dashboard (indigo/dark)
    <div className="min-h-screen bg-indigo-600 dark:bg-background py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Elementos decorativos de fundo para combinar com a Login Page */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-400 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header - Mais impactante */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
             <span className="text-[10px] font-black text-indigo-100 uppercase tracking-[0.2em]">Upgrade Your Life</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
            {isPremium ? "Status: Elite 💎" : "Potencialize tudo."}
          </h1>
          <p className="text-lg text-indigo-100/80 max-w-xl mx-auto leading-relaxed font-medium">
            {isPremium 
              ? "Sua assinatura está ativa. Aproveite o poder total da ferramenta." 
              : "Menos limites, mais resultados. Escolha o plano que combina com sua ambição."}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Free Plan - Glassmorphism style */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 flex flex-col justify-between transition-all duration-300 hover:bg-white/15">
            <div>
              <h3 className="text-xs font-black text-indigo-200 uppercase tracking-widest mb-2">Básico</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-white tracking-tighter">Grátis</span>
              </div>

              <ul className="space-y-5 mb-10">
                <li className="flex items-center gap-3 text-sm text-indigo-50 font-medium">
                  <div className="flex-shrink-0 w-5 h-5 bg-indigo-500/30 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span>Até <strong className="text-white font-black">5 tarefas</strong> simultâneas</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-indigo-50/60 font-medium">
                  <div className="flex-shrink-0 w-5 h-5 bg-white/5 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>
                  </div>
                  Sincronização básica
                </li>
              </ul>
            </div>

            <div className="w-full py-4 bg-white/5 border border-white/10 text-center rounded-2xl font-black text-[10px] text-white/40 uppercase tracking-[0.3em]">
              Seu Plano Atual
            </div>
          </div>

          {/* Premium Plan - Solid & Elegant */}
          <div className="bg-white rounded-3xl p-10 shadow-2xl shadow-indigo-900/40 relative overflow-hidden flex flex-col justify-between group transition-all duration-500 hover:-translate-y-1">
            {/* Badge Premium */}
            <div className="absolute top-0 right-0 p-5">
              <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-tighter shadow-lg shadow-indigo-200">Popular</span>
            </div>

            <div className="relative z-10">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2 font-black">Pro Experience</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-gray-900 tracking-tighter">R$ 9,90</span>
                <span className="text-gray-400 font-bold">/mês</span>
              </div>

              <ul className="space-y-5 mb-10">
                {[
                  { text: "50 Tarefas", highlight: "Ilimitadas" },
                  { text: "Edição de tarefas", highlight: "Prioritário" },
                  { text: "Novas ferramentas primeiro", highlight: "Primeiro" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-700 font-semibold">
                    <div className="flex-shrink-0 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>
                    </div>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative z-10">
              {isPremium ? (
                <form action={async () => { "use server"; await createPortalSession() }}>
                  <button type="submit" className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl flex items-center justify-center gap-2 group">
                    Gerenciar Assinatura
                    <svg className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </button>
                </form>
              ) : (
                <form action={async () => { "use server"; await createCheckoutSession() }}>
                  <button type="submit" className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 text-lg">
                    Quero ser Premium
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </button>
                </form>
              )}
            </div>
            
            {/* Decoração interna discreta */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-2xl group-hover:bg-indigo-100 transition-colors"></div>
          </div>
        </div>

        {/* Footer Link - Estilizado como o "Voltar" da sua App */}
        <div className="text-center">
          <Link 
            href="/dashboard/tasks" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-indigo-100 hover:bg-white/10 hover:text-white transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para o Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}