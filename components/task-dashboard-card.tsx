"use client"

import { useState } from "react"
import TaskModal from "./task-modal"
import TaskList from "./task-list"

interface TaskDashboardCardProps {
  tasks: any[]
  progressPercent: number
  isAtLimit: boolean
  plan: string
}

export default function TaskDashboardCard({ tasks, progressPercent, isAtLimit, plan }: TaskDashboardCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[32px] shadow-2xl shadow-indigo-200 overflow-hidden p-8">
      
      {/* Header Mockup */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-2xl font-black">Meus Tasks</h2>
          <p className="text-indigo-200 text-sm font-medium mt-1 uppercase tracking-tight">
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "short" })}
          </p>
        </div>
        <button 
          onClick={() => !isAtLimit && setIsModalOpen(true)}
          disabled={isAtLimit}
          className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
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
        <TaskList tasks={tasks} plan={plan} />
      </div>
      
      {/* + Nova Tarefa Placeholder (Visual) */}
      <button 
        disabled={isAtLimit}
        onClick={() => !isAtLimit && setIsModalOpen(true)}
        className="w-full mt-6 py-4 border-2 border-dashed border-white/25 rounded-3xl flex items-center justify-center gap-2 hover:border-white/40 hover:bg-white/5 transition-all text-white/50 font-bold disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Nova Tarefa
      </button>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => window.location.reload()} 
      />
    </div>
  )
}
