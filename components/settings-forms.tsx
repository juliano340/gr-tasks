"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { updatePersonalData, updatePassword, deleteAccount } from "@/app/settings-actions"

export function PersonalDataForm({ initialName, initialEmail }: { initialName: string, initialEmail: string }) {
  const [state, formAction, isPending] = useActionState(updatePersonalData, null)

  useEffect(() => {
    if (state?.success) alert(state.success)
    if (state?.error) alert(state.error)
  }, [state])

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Nome
          </label>
          <input
            id="name"
            type="text"
            name="name"
            defaultValue={initialName}
            disabled={isPending}
            className="w-full px-4 py-3 bg-[#f7f8fa] border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            name="email"
            defaultValue={initialEmail}
            disabled={isPending}
            className="w-full px-4 py-3 bg-[#f7f8fa] border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 disabled:opacity-50"
          />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl shadow-lg shadow-black/10 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {isPending ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </form>
  )
}

export function PasswordForm() {
  const [state, formAction, isPending] = useActionState(updatePassword, null)

  useEffect(() => {
    if (state?.success) {
      alert(state.success)
    }
    if (state?.error) alert(state.error)
  }, [state])

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="currentPassword" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
          Senha Atual
        </label>
        <input
          id="currentPassword"
          type="password"
          name="currentPassword"
          disabled={isPending}
          className="w-full px-4 py-3 bg-[#f7f8fa] border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 disabled:opacity-50"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="newPassword" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Nova Senha
          </label>
          <input
            id="newPassword"
            type="password"
            name="newPassword"
            disabled={isPending}
            className="w-full px-4 py-3 bg-[#f7f8fa] border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Confirmar Nova Senha
          </label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            disabled={isPending}
            className="w-full px-4 py-3 bg-[#f7f8fa] border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 disabled:opacity-50"
          />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl shadow-lg shadow-black/10 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {isPending ? "Atualizando..." : "Atualizar Senha"}
        </button>
      </div>
    </form>
  )
}

export function DeleteAccountForm() {
  const [state, formAction, isPending] = useActionState(deleteAccount, null)
  const [showConfirm, setShowConfirm] = useState(false)
  const formRef = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    if (state?.error) alert(state.error)
  }, [state])

  return (
    <>
      <form ref={formRef} action={formAction}>
        <button
          type="button"
          disabled={isPending}
          onClick={() => setShowConfirm(true)}
          className="px-6 py-2.5 bg-red-500 text-white text-sm font-bold rounded-xl shadow-md shadow-red-200 hover:bg-red-600 hover:shadow-lg hover:shadow-red-200 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {isPending ? "Deletando..." : "Deletar Minha Conta"}
        </button>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
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
                    Excluir conta?
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                    Essa ação é permanente e não pode ser desfeita.
                  </p>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
                <p className="text-sm font-semibold text-red-700">
                  Todos os seus dados e tarefas serão removidos.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    setShowConfirm(false)
                    formRef.current?.requestSubmit()
                  }}
                  className="flex-1 py-2.5 px-4 bg-red-500 text-white text-sm font-bold rounded-xl shadow-md shadow-red-200 hover:bg-red-600 hover:shadow-lg hover:shadow-red-200 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {isPending ? "Deletando..." : "Excluir conta"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
