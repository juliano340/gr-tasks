"use client"

import { resetPassword } from "@/app/actions"
import Link from "next/link"
import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-background p-6">
        <div className="max-w-md w-full bg-white dark:bg-card p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-foreground mb-4 tracking-tight">Token Inválido</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">O link de recuperação é inválido ou expirou. Por favor, solicite um novo link.</p>
          <Link href="/forgot-password" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none">
            Solicitar novo link
          </Link>
        </div>
      </div>
    )
  }

  async function handleSubmit(formData: FormData) {
    if (!token) return
    
    setLoading(true)
    setMessage(null)
    
    formData.append("token", token)
    const result = await resetPassword(formData)
    
    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-background p-6">
      <div className="max-w-md w-full bg-white dark:bg-card p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center">
           <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">
            Nova Senha
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Escolha uma senha forte e segura para proteger sua conta.
          </p>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-red-50 text-red-800 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 animate-in slide-in-from-top-2">
            <p className="text-sm font-bold text-center">{message.text}</p>
          </div>
        )}

        <form className="space-y-6" action={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Nova Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none disabled:opacity-50"
              placeholder="Mínimo de 6 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Redefinindo...' : 'Redefinir Senha'}
          </button>

          <div className="text-center">
            <Link href="/login" className="text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
              Voltar ao login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-surface dark:bg-background text-gray-500 font-bold">Carregando sistema...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}

