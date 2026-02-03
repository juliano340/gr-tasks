"use client"

import { createTask } from "@/app/tasks-actions"
import { useState } from "react"

export default function CreateTaskButton({ disabled }: { disabled: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    const result = await createTask(formData)
    
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setIsOpen(false)
      setLoading(false)
      setTimeout(() => {
        window.location.reload()
      }, 100)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className="group relative w-full py-4 px-6 bg-indigo-600 dark:bg-indigo-500 text-white font-black rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 shadow-lg shadow-indigo-100 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <svg className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
        </svg>
        <span>{disabled ? "Limite atingido" : "Criar Nova Tarefa"}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-card rounded-3xl shadow-2xl shadow-black/10 dark:shadow-none border border-gray-100 dark:border-gray-800 max-w-md w-full p-8 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                 <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-md border border-indigo-100 dark:border-indigo-800 mb-2">
                   <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest text-center">Formulário</span>
                </div>
                <h2 className="text-3xl font-black text-foreground tracking-tight">Nova Tarefa</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-foreground transition-colors"
                disabled={loading}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-red-800 dark:text-red-400 text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <form action={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-widest text-[10px]">
                  Título da Tarefa
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  autoFocus
                  disabled={loading}
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder:text-gray-400"
                  placeholder="Ex: Finalizar relatório mensal"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-widest text-[10px]">
                  Prioridade
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "urgent", label: "Urgente", color: "text-amber-600 bg-amber-50 border-amber-200" },
                    { id: "normal", label: "Normal", color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
                    { id: "low", label: "Baixa", color: "text-gray-600 bg-gray-50 border-gray-200" }
                  ].map((p) => (
                    <label key={p.id} className="relative cursor-pointer group">
                      <input 
                        type="radio" 
                        name="priority" 
                        value={p.id} 
                        defaultChecked={p.id === "normal"} 
                        className="peer sr-only" 
                      />
                      <div className={`py-3 px-2 text-center rounded-xl border-2 transition-all font-bold text-xs ${p.color} peer-checked:ring-2 peer-checked:ring-indigo-500 peer-checked:scale-105 active:scale-95 hover:brightness-95`}>
                        {p.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-widest text-[10px]">
                  Prazo de Entrega (opcional)
                </label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="datetime-local"
                  disabled={loading}
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-widest text-[10px]">
                  Descrição detalhada (opcional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  disabled={loading}
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder:text-gray-400 resize-none"
                  placeholder="Quais são os detalhes importantes?"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                  className="flex-1 py-4 px-6 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-black rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 px-6 bg-indigo-600 dark:bg-indigo-500 text-white font-black rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    "Criar Agora"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

