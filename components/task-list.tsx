"use client"

import { toggleTaskComplete, deleteTask } from "@/app/tasks-actions"
import { useState } from "react"

type Task = {
  id: string
  title: string
  description: string | null
  completed: boolean
  priority: string
  dueDate: Date | null
  completedAt: Date | null
  createdAt: Date
}

export default function TaskList({ tasks }: { tasks: Task[] }) {
  const [optimisticTasks, setOptimisticTasks] = useState(tasks)

  async function handleToggle(taskId: string) {
    setOptimisticTasks(prev =>
      prev.map(t => t.id === taskId ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date() : null } : t)
    )
    await toggleTaskComplete(taskId)
  }

  async function handleDelete(taskId: string) {
    if (!confirm("Tem certeza que deseja deletar esta tarefa?")) return
    
    setOptimisticTasks(prev => prev.filter(t => t.id !== taskId))
    await deleteTask(taskId)
  }

  if (optimisticTasks.length === 0) {
    return (
      <div className="bg-white dark:bg-card rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 p-16 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-xl font-black text-foreground mb-2 tracking-tight">
          Nenhuma tarefa por aqui
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
          Sua lista está vazia. Que tal criar sua primeira tarefa e começar a produzir?
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {optimisticTasks.map((task, index) => (
        <div
          key={task.id}
          style={{ animationDelay: `${index * 50}ms` }}
          className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-[24px] p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 hover:bg-white/15"
        >
          <div className="flex items-center gap-4">
            {/* Custom Checkbox */}
            <button
              onClick={() => handleToggle(task.id)}
              className="flex-shrink-0"
            >
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                task.completed 
                  ? "bg-emerald-400 border-emerald-400" 
                  : "border-white/40 hover:border-white"
              }`}>
                {task.completed && (
                  <svg className="w-3.5 h-3.5 text-white animate-in zoom-in-50 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-bold leading-tight transition-all duration-300 ${
                task.completed 
                  ? "text-white/50 line-through" 
                  : "text-white"
              }`}>
                {task.title}
              </h3>
              
              <div className="flex items-center gap-2 mt-1">
                {task.completed ? (
                  <span className="text-[11px] text-white/40 font-medium tracking-tight">
                    Concluído às {task.completedAt ? new Date(task.completedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : ""}
                  </span>
                ) : (
                  <span className="text-[11px] text-indigo-100/60 font-medium tracking-tight">
                    {task.dueDate 
                      ? `Prazo: ${new Date(task.dueDate).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}h`
                      : "Sem prazo definido"
                    }
                  </span>
                )}
              </div>
            </div>

            {/* Priority Badge */}
            <div className="flex items-center gap-3">
              {task.completed ? (
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-400/20 px-3 py-1 rounded-full border border-emerald-400/30 uppercase tracking-tighter">
                  Feito
                </span>
              ) : (
                <>
                  {task.priority === "urgent" && (
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30 uppercase tracking-tighter">
                      Urgente
                    </span>
                  )}
                  {task.priority === "normal" && (
                    <span className="text-[10px] font-bold text-indigo-200 bg-white/10 px-3 py-1 rounded-full border border-white/10 uppercase tracking-tighter">
                      Normal
                    </span>
                  )}
                  {task.priority === "low" && (
                    <span className="text-[10px] font-bold text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/5 uppercase tracking-tighter">
                      Baixa
                    </span>
                  )}
                </>
              )}

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(task.id)}
                className="flex-shrink-0 p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                title="Deletar tarefa"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      ))}
    </div>
  )
}
