

import { auth } from "@/auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import AdBanner from "@/components/ad-banner"

export default async function Home() {
  const session = await auth()

  if (session) {
    redirect("/dashboard/tasks")
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ─── NAV ─── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Task<span className="text-indigo-600">Master</span>
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold rounded-lg shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200"
            >
              Começar Grátis
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-24 pb-28 relative">

        {/* Blobs decorativos de fundo */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[140px] opacity-50 -z-0 -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-100 rounded-full blur-[120px] opacity-40 -z-0 translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-20 lg:gap-16">

          {/* ── Lado Esquerdo: Texto ── */}
          <div className="flex-1 max-w-[520px] lg:max-w-none text-center lg:text-left">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
              </span>
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Novo: Suporte ao Stripe!
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-5">
              Domine seu tempo,
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                foco absoluto.
              </span>
            </h1>

            {/* Descrição */}
            <p className="text-base lg:text-lg text-gray-500 leading-relaxed max-w-[440px] mx-auto lg:mx-0 mb-8">
              Organize suas tarefas diárias com simplicidade e clareza.
              Passe menos tempo planejando e mais tempo realizando.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gray-900 text-white text-sm font-bold rounded-xl shadow-lg shadow-black/10 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
              >
                Criar conta gratuita
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="/dashboard/upgrade"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-gray-800 text-sm font-bold rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200"
              >
                Conhecer o Premium
                <span className="text-base">💎</span>
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 mt-8 justify-center lg:justify-start">
              <div className="flex -space-x-2.5">
                <div className="w-9 h-9 rounded-full border-2 border-[#f7f8fa] bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-sm" />
                <div className="w-9 h-9 rounded-full border-2 border-[#f7f8fa] bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm" />
                <div className="w-9 h-9 rounded-full border-2 border-[#f7f8fa] bg-gradient-to-br from-emerald-400 to-teal-500 shadow-sm" />
                <div className="w-9 h-9 rounded-full border-2 border-[#f7f8fa] bg-gradient-to-br from-pink-400 to-rose-500 shadow-sm" />
              </div>
              <p className="text-sm text-gray-500">
                <span className="font-bold text-gray-800">+1.200</span> usuários produtivos
              </p>
            </div>
          </div>

          {/* ── Lado Direito: Mockup ── */}
          <div className="flex-1 flex justify-center items-center">
            <div className="relative w-full max-w-[480px]">

              {/* Sombra/glow atrás do card */}
              <div className="absolute inset-4 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl blur-2xl opacity-30 -z-0" />

              {/* Card principal */}
              <div className="relative z-10 bg-gradient-to-br from-indigo-600 via-indigo-550 to-violet-600 rounded-3xl shadow-2xl shadow-indigo-200 p-7">

                {/* Header do mockup */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-white font-bold text-base">Meus Tasks</p>
                    <p className="text-indigo-200 text-xs font-medium mt-0.5">Segunda, 02 Fev</p>
                  </div>
                  <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/15 rounded-full h-1.5 mb-5">
                  <div className="bg-gradient-to-r from-emerald-400 to-teal-400 h-1.5 rounded-full" style={{ width: "33%" }} />
                </div>

                {/* Tasks */}
                <div className="flex flex-col gap-3">

                  {/* Task 1 – completed */}
                  <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-3.5 flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md bg-emerald-400 border-0 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/55 text-sm font-semibold line-through">Revisar proposta do cliente</p>
                      <p className="text-indigo-200/60 text-xs mt-0.5">Concluído às 09:30</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-300 bg-emerald-400/20 px-2.5 py-0.5 rounded-full">Feito</span>
                  </div>

                  {/* Task 2 – pending */}
                  <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-3.5 flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md border-2 border-white/40 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold">Preparar apresentação trimestral</p>
                      <p className="text-indigo-200/60 text-xs mt-0.5">Prazo: 14:00h</p>
                    </div>
                    <span className="text-xs font-bold text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full">Urgente</span>
                  </div>

                  {/* Task 3 – pending */}
                  <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-3.5 flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md border-2 border-white/40 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold">Responder emails pendentes</p>
                      <p className="text-indigo-200/60 text-xs mt-0.5">Sem prazo definido</p>
                    </div>
                    <span className="text-xs font-bold text-indigo-200 bg-white/10 px-2.5 py-0.5 rounded-full">Normal</span>
                  </div>

                  {/* + Nova Tarefa */}
                  <div className="mt-1 border-2 border-dashed border-white/25 rounded-2xl p-3.5 flex items-center justify-center gap-2 hover:border-white/40 transition-colors cursor-pointer">
                    <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-white/50 text-sm font-bold">Nova Tarefa</span>
                  </div>
                </div>
              </div>

              {/* Floating badges decorativos */}
              <div className="absolute -top-3 -right-4 bg-white rounded-xl shadow-lg shadow-black/8 px-3.5 py-2 flex items-center gap-2 z-20">
                <span className="text-lg">🔥</span>
                <div>
                  <p className="text-xs font-bold text-gray-800">Streak</p>
                  <p className="text-xs text-gray-500">7 dias</p>
                </div>
              </div>
              <div className="absolute -bottom-3 -left-4 bg-white rounded-xl shadow-lg shadow-black/8 px-3.5 py-2 flex items-center gap-2 z-20">
                <span className="text-lg">⚡</span>
                <div>
                  <p className="text-xs font-bold text-gray-800">Produtividade</p>
                  <p className="text-xs text-emerald-500 font-semibold">+34% esta semana</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bloco de anúncio central pós-hero */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <AdBanner dataAdSlot="XXXXXXXXXX" />
      </div>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <AdBanner dataAdSlot="YYYYYYYYYY" />
          <div className="text-center mt-8">
            <p className="text-sm text-gray-400">
              © 2026 Taskmaster App. Desenvolvido para máxima performance.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}