"use client";

import { toggleTaskComplete, deleteTask } from "@/app/tasks-actions";
import { useState } from "react";
import TaskModal from "./task-modal";

type Task = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: string;
  dueDate: Date | null;
  completedAt: Date | null;
  createdAt: Date;
};

export default function TaskList({
  tasks,
  plan,
}: {
  tasks: Task[];
  plan: string;
}) {
  const [optimisticTasks, setOptimisticTasks] = useState(tasks);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const isPremium = plan === "premium";

  async function handleToggle(taskId: string) {
    setOptimisticTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date() : null,
            }
          : t,
      ),
    );
    await toggleTaskComplete(taskId);
  }

  async function confirmDelete() {
    if (!taskToDelete) return;
    setOptimisticTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
    setTaskToDelete(null);
    await deleteTask(taskToDelete.id);
  }

  // ── Estado vazio ──
  if (optimisticTasks.length === 0) {
    return (
      <div className="py-14 px-6 text-center">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-8 h-8 text-white/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-white font-bold text-base mb-1.5">
          Nenhuma tarefa ainda
        </h3>
        <p className="text-white/45 text-sm max-w-[260px] mx-auto leading-relaxed">
          Sua lista está vazia. Crie sua primeira tarefa e comece a produzir!
        </p>
      </div>
    );
  }

  // ── Lista ──
  return (
    <>
      <div className="grid gap-3">
        {optimisticTasks.map((task, index) => (
          <div
            key={task.id}
            style={{ animationDelay: `${index * 50}ms` }}
            className="group bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 transition-all duration-300 hover:bg-white/18"
          >
            <div className="flex items-center gap-3.5">
              {/* Checkbox */}
              <button
                onClick={() => handleToggle(task.id)}
                className="flex-shrink-0"
              >
                <div
                  className={`w-5.5 h-5.5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
                    task.completed
                      ? "bg-emerald-400 border-emerald-400"
                      : "border-white/40 hover:border-white"
                  }`}
                >
                  {task.completed && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </button>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-sm font-semibold leading-tight transition-all duration-300 ${
                    task.completed ? "text-white/50 line-through" : "text-white"
                  }`}
                >
                  {task.title}
                </h3>
                <p className="text-[11px] text-indigo-200/55 font-medium mt-0.5">
                  {task.completed
                    ? `Concluído às ${task.completedAt ? new Date(task.completedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : ""}`
                    : task.dueDate
                      ? `Prazo: ${new Date(task.dueDate).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}h`
                      : "Sem prazo definido"}
                </p>
              </div>

              {/* Badge + Ações */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Badge de status/prioridade */}
                {!task.completed && (
                  <>
                    {task.priority === "urgent" ? (
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full">
                        Urgente
                      </span>
                    ) : task.priority === "normal" ? (
                      <span className="text-[10px] font-bold text-indigo-200 bg-white/10 px-2 py-0.5 rounded-full">
                        Normal
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                        Baixa
                      </span>
                    )}
                  </>
                )}
                {task.completed && (
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-400/20 px-2 py-0.5 rounded-full">
                    Feito
                  </span>
                )}

                <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                  {/* Botão editar (Apenas Premium) */}
                  {isPremium && (
                    <button
                      onClick={() => setTaskToEdit(task)}
                      className="p-1.5 text-white/30 hover:text-indigo-300 hover:bg-indigo-300/10 rounded-lg transition-all"
                      title="Editar tarefa"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Botão deletar */}
                  <button
                    onClick={() => setTaskToDelete(task)}
                    className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    title="Deletar tarefa"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Modal de confirmação de exclusão ── */}
      {taskToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setTaskToDelete(null)}
          />
          <div className="relative z-10 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-black/10 max-w-sm w-full overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-red-400 via-red-500 to-red-400" />
            <div className="p-6">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5.5 h-5.5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
                    Deletar tarefa?
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                    Essa ação não pode ser desfeita.
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    taskToDelete.priority === "urgent"
                      ? "bg-amber-400"
                      : taskToDelete.priority === "normal"
                        ? "bg-indigo-500"
                        : "bg-gray-400"
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {taskToDelete.title}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setTaskToDelete(null)}
                  className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 px-4 bg-red-500 text-white text-sm font-bold rounded-xl shadow-md shadow-red-200 hover:bg-red-600 hover:shadow-lg hover:shadow-red-200 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal de Edição (Apenas Premium) ── */}
      {isPremium && (
        <TaskModal
          isOpen={!!taskToEdit}
          onClose={() => setTaskToEdit(null)}
          onSuccess={() => window.location.reload()}
          task={taskToEdit}
        />
      )}
    </>
  );
}
