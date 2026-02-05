import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { createPortalSession } from "@/app/stripe-actions"
import Link from "next/link"
import { PersonalDataForm, PasswordForm, DeleteAccountForm } from "@/components/settings-forms"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true }
  })

  if (!user) redirect("/")

  const isPremium = user.subscription?.plan === "premium"

  return (
    <div className="min-h-screen bg-[#f7f8fa]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ─── NAV ─── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Task<span className="text-indigo-600">Master</span>
            </span>
          </Link>

          {/* Voltar para tasks */}
          <Link
            href="/dashboard/tasks"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </Link>
        </div>
      </nav>

      {/* ─── CORPO ─── */}
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-md flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Configurações</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Minha Conta</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie seu perfil, segurança e assinatura.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ── Sidebar de navegação ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/4 p-4 sticky top-24">
              <nav className="flex flex-col gap-1">
                <a
                  href="#assinatura"
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Faturamento
                </a>
                <a
                  href="#perfil"
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Perfil
                </a>
                <a
                  href="#seguranca"
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Segurança
                </a>
                <a
                  href="#deletar"
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Excluir Conta
                </a>
              </nav>
            </div>
          </div>

          {/* ── Conteúdo principal ── */}
          <div className="lg:col-span-3 flex flex-col gap-6">

            {/* ── Assinatura ── */}
            <section id="assinatura" className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/4 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-base font-extrabold text-gray-900 tracking-tight">Assinatura e Faturamento</h2>
                <p className="text-sm text-gray-500 mt-0.5">Gerencie sua assinatura através do Stripe.</p>
              </div>
              <div className="p-6">
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border-2 ${
                  isPremium
                    ? "bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-200"
                    : "bg-gray-50 border-gray-200"
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isPremium
                        ? "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-200"
                        : "bg-gray-200"
                    }`}>
                      <span className="text-xl">{isPremium ? "💎" : "🚀"}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Plano Atual</p>
                      <p className={`text-xl font-extrabold tracking-tight capitalize ${
                        isPremium ? "text-indigo-600" : "text-gray-700"
                      }`}>
                        {user.subscription?.plan || "Free"}
                      </p>
                    </div>
                  </div>
                  <form action={async () => { "use server"; await createPortalSession() }}>
                    <button className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200">
                      Gerenciar no Stripe
                    </button>
                  </form>
                </div>
                <p className="text-sm text-gray-500 mt-4 leading-relaxed">
                  Cancele, altere o método de pagamento ou baixe faturas diretamente através do portal do Stripe.
                </p>
              </div>
            </section>

            {/* ── Dados Pessoais ── */}
            <section id="perfil" className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/4 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-base font-extrabold text-gray-900 tracking-tight">Dados Pessoais</h2>
                <p className="text-sm text-gray-500 mt-0.5">Atualize seu nome e email.</p>
              </div>
              <div className="p-6">
                <PersonalDataForm initialName={user.name || ""} initialEmail={user.email || ""} />
              </div>
            </section>

            {/* ── Segurança ── */}
            <section id="seguranca" className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/4 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-base font-extrabold text-gray-900 tracking-tight">Alterar Senha</h2>
                <p className="text-sm text-gray-500 mt-0.5">Mantenha sua conta segura.</p>
              </div>
              <div className="p-6">
                <PasswordForm />
              </div>
            </section>

            {/* ── Danger Zone ── */}
            <section id="deletar" className="bg-red-50 rounded-2xl border-2 border-red-200 shadow-sm shadow-red-100/50 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5.5 h-5.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-base font-extrabold text-red-900 tracking-tight">Excluir Conta</h2>
                    <p className="text-sm text-red-700 mt-1 leading-relaxed">
                      Esta ação é <span className="font-bold">irreversível</span>. Todos os seus dados, tarefas e assinatura ativa no Stripe serão removidos permanentemente.
                    </p>
                    <div className="mt-5">
                      <DeleteAccountForm />
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}