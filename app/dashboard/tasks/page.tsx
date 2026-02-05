import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getUserStats } from "@/app/tasks-actions"
import TaskDashboardCard from "@/components/task-dashboard-card"
import CreateTaskButton from "@/components/create-task-button"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function TasksPage() {
  const session = await auth()

  if (!session) {
    redirect("/")
  }

  const { plan, taskCount, limit, tasks } = await getUserStats()

  const progressPercent = Math.min((taskCount / limit) * 100, 100)
  const isAtLimit = taskCount >= limit
  const completedCount = tasks.filter((task: any) => task.completed).length
  const pendingCount = taskCount - completedCount
  const today = new Date()
  const todayCount = tasks.filter((task: any) => {
    const createdAt = new Date(task.createdAt)
    return createdAt.toDateString() === today.toDateString()
  }).length

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

          {/* Nav direita: email + configs + logout */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium hidden sm:inline">
              {session?.user?.email}
            </span>

            <Link 
              href="/dashboard/settings" 
              title="Configurações"
              className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>

            <form action={async () => {
              "use server"
              const { signOut } = await import("@/auth")
              await signOut()
            }}>
              <button
                title="Sair"
                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* ─── CORPO ─── */}
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-6">

        {/* ── Header: saudação + stats ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">

          {/* Saudação */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-5 h-5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-md flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">T</span>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Espaço de Trabalho</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Minhas Tarefas</h1>
          </div>

          {/* Botão criar tarefa — alinhado à direita */}
          <div className="flex-shrink-0">
            <CreateTaskButton disabled={isAtLimit} />
          </div>
        </div>

        {/* ── Stats Row: 3 cards horizontais ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Card 1: Plano e Upgrade */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/4 p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                plan === "premium"
                  ? "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-200"
                  : "bg-gray-100"
              }`}>
                <span className="text-lg">{plan === "premium" ? "💎" : "🚀"}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Plano atual</p>
                <p className={`text-sm font-bold mt-0.5 ${plan === "premium" ? "text-indigo-600" : "text-gray-700"}`}>
                  {plan === "premium" ? "Premium" : "Free"}
                </p>
              </div>
            </div>
            
            {plan === "free" && (
              <Link 
                href="/dashboard/upgrade"
                className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-tighter"
              >
                Upgrade ⚡
              </Link>
            )}
          </div>

          {/* Card 2: Capacidade com progress */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/4 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Capacidade</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isAtLimit
                  ? "bg-red-50 text-red-600"
                  : "bg-emerald-50 text-emerald-600"
              }`}>
                {isAtLimit ? "Limite atingido" : "Disponível"}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-2.5">
              <span className="text-2xl font-extrabold text-gray-900">{taskCount}</span>
              <span className="text-sm text-gray-400 font-medium">/ {limit}</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  isAtLimit
                    ? "bg-gradient-to-r from-red-400 to-red-500"
                    : "bg-gradient-to-r from-emerald-400 to-teal-400"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Card 3: Resumo rápido */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/4 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Resumo rápido</p>
              <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                Geral
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-lg font-extrabold text-gray-900">{pendingCount}</p>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Pendente</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-extrabold text-gray-900">{completedCount}</p>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Concluído</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-extrabold text-gray-900">{todayCount}</p>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Hoje</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Banner de Limite atingido (Só para Free com limite) ── */}
        {plan === "free" && isAtLimit && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-xl">⚠️</div>
              <div>
                <h3 className="text-amber-900 font-bold text-lg leading-tight">Limite atingido!</h3>
                <p className="text-amber-700 text-sm mt-1">Você atingiu o limite de {limit} tarefas do plano gratuito.</p>
              </div>
            </div>
            <Link 
              href="/dashboard/upgrade"
              className="px-8 py-3 bg-amber-600 text-white font-black rounded-xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-200 active:scale-95"
            >
              LIBERAR ACESSO ILIMITADO 🚀
            </Link>
          </div>
        )}

        {/* ── Lista de tarefas Estilo Mockup (CLIENT COMPONENT) ── */}
        <TaskDashboardCard 
          tasks={tasks} 
          progressPercent={progressPercent} 
          isAtLimit={isAtLimit} 
          plan={plan}
        />
      </div>
    </div>
  )
}