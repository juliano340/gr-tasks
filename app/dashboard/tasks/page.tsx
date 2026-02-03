import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getUserStats } from "@/app/tasks-actions"
import TaskList from "@/components/task-list"
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
  const completedCount = tasks.filter(task => task.completed).length
  const pendingCount = taskCount - completedCount
  const today = new Date()
  const todayCount = tasks.filter(task => {
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

          {/* Nav direita: email + logout */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium hidden sm:inline">
              {session?.user?.email}
            </span>

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

        {/* ─── Header: saudação + stats ── */}
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

        {/* ─── Stats Row: 3 cards horizontais ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Card 1: Plano */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/4 p-5 flex items-center gap-4">
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
                Hoje
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-lg font-extrabold text-gray-900">{pendingCount}</p>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Pendentes</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-extrabold text-gray-900">{completedCount}</p>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Concluídas</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-extrabold text-gray-900">{todayCount}</p>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Hoje</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Lista de tarefas Estilo Mockup ── */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[32px] shadow-2xl shadow-indigo-200 overflow-hidden p-8">

          {/* Header Mockup */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white text-2xl font-black">Meus Tasks</h2>
              <p className="text-indigo-200 text-sm font-medium mt-1 uppercase tracking-tight">
                {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "short" })}
              </p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/30 transition-all cursor-pointer">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>

          {/* Progress Bar Fina (Mockup) */}
          <div className="w-full bg-white/20 h-1.5 rounded-full mb-8">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-1000 ease-out shadow-sm shadow-emerald-400/50"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Lista de Tasks em Cards Transparentes */}
          <div className="space-y-4">
            <TaskList tasks={tasks} />
          </div>

          {/* + Nova Tarefa Placeholder (Visual) */}
          <div
            className="w-full mt-6 py-4 border-2 border-dashed border-white/25 rounded-3xl flex items-center justify-center gap-2 hover:border-white/40 hover:bg-white/5 transition-all text-white/50 font-bold cursor-not-allowed opacity-60"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nova Tarefa
          </div>
        </div>
      </div>
    </div>
  )
}