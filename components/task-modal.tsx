import { createTask, updateTask } from "@/app/tasks-actions"
import { useState } from "react"

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  task?: {
    id: string
    title: string
    description: string | null
    priority: string
    dueDate: Date | null
    completed: boolean
  } | null
}

const PRIORITIES = [
  {
    id: "urgent",
    label: "Urgente",
    icon: "🔥",
    text: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    checked: "ring-amber-400",
  },
  {
    id: "normal",
    label: "Normal",
    icon: "📌",
    text: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    checked: "ring-indigo-400",
  },
  {
    id: "low",
    label: "Baixa",
    icon: "🍃",
    text: "text-gray-500",
    bg: "bg-gray-50",
    border: "border-gray-200",
    checked: "ring-gray-400",
  },
]

export default function TaskModal({ isOpen, onClose, onSuccess, task }: TaskModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const result = task 
      ? await updateTask(formData) 
      : await createTask(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setLoading(false)
      onSuccess()
      onClose()
    }
  }

  if (!isOpen) return null

  // Format date for datetime-local input
  const formattedDate = task?.dueDate 
    ? new Date(task.dueDate).toISOString().slice(0, 16) 
    : ""

  return (
    /* ── Overlay ── */
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* ── Card do modal ── */}
      <div className="relative z-10 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-black/10 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Faixa gradiente topo — marca visual da app */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600" />

        <div className="p-7">

          {/* ── Header ── */}
          <div className="flex items-start justify-between mb-6">
            <div>
              {/* Badge "Novo Item" — mesmo padrão das outras telas */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 mb-2.5">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                  {task ? "Editar Tarefa" : "Nova Tarefa"}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {task ? "Editar detalhes" : "Criar tarefa"}
              </h2>
            </div>

            {/* Fechar */}
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 disabled:opacity-40"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── Erro ── */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
              <svg className="w-4.5 h-4.5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          )}

          {/* ── Formulário ── */}
          <form action={handleSubmit} className="flex flex-col gap-5">
            {/* ID da tarefa (se for edição) */}
            {task && <input type="hidden" name="id" value={task.id} />}
            {task && <input type="hidden" name="completed" value={String(task.completed)} />}

            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Título da tarefa
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                autoFocus={!task}
                defaultValue={task?.title}
                disabled={loading}
                placeholder="Ex: Finalizar relatório mensal"
                className="w-full px-4 py-3 bg-[#f7f8fa] border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 disabled:opacity-50"
              />
            </div>

            {/* Prioridade */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Prioridade
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {PRIORITIES.map((p) => (
                  <label key={p.id} className="relative cursor-pointer group">
                    <input
                      type="radio"
                      name="priority"
                      value={p.id}
                      defaultChecked={task ? task.priority === p.id : p.id === "normal"}
                      className="peer sr-only"
                    />
                    <div
                      className={`
                        relative flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border-2
                        transition-all duration-200 text-center
                        ${p.bg} ${p.border} ${p.text}
                        peer-checked:border-indigo-400 peer-checked:ring-4 peer-checked:ring-indigo-100
                        peer-checked:shadow-sm
                        hover:scale-[1.03] active:scale-95
                      `}
                    >
                      <span className="text-base">{p.icon}</span>
                      <span className="text-xs font-bold">{p.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Prazo */}
            <div>
              <label htmlFor="dueDate" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Prazo de entrega
                <span className="normal-case tracking-normal font-medium text-gray-300 ml-1.5">(opcional)</span>
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="datetime-local"
                defaultValue={formattedDate}
                disabled={loading}
                className="w-full px-4 py-3 bg-[#f7f8fa] border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 disabled:opacity-50"
              />
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="description" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Descrição
                <span className="normal-case tracking-normal font-medium text-gray-300 ml-1.5">(opcional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={task?.description || ""}
                disabled={loading}
                placeholder="Quais são os detalhes importantes?"
                className="w-full px-4 py-3 bg-[#f7f8fa] border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 disabled:opacity-50 resize-none"
              />
            </div>

            {/* ── Ações ── */}
            <div className="flex gap-3 pt-2">
              {/* Cancelar */}
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-3 px-5 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
              >
                Cancelar
              </button>

              {/* Criar / Salvar */}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {task ? "Salvando…" : "Criando…"}
                  </>
                ) : (
                  <>
                    {task ? "Salvar Alterações" : "Criar Tarefa"}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={task ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
