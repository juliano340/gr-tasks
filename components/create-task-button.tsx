"use client"

import { useState } from "react"
import TaskModal from "./task-modal"

export default function CreateTaskButton({ disabled }: { disabled: boolean }) {
  const [isOpen, setIsOpen] = useState(false)

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

      <TaskModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        onSuccess={() => window.location.reload()} 
      />
    </>
  )
}
