"use client"

import { forgotPassword } from "@/app/actions"
import Link from "next/link"
import { useState } from "react"

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage(null)
    
    const result = await forgotPassword(formData)
    
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else if (result.success) {
      setMessage({ type: 'success', text: result.success })
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-background p-6">
      <div className="max-w-md w-full bg-white dark:bg-card p-8 rounded-2xl shadow-xl shadow-gray-200 dark:shadow-none border border-gray-100 dark:border-gray-800 space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">
            Esqueceu a senha?
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Não se preocupe! Digite seu email e enviaremos um link para você redefinir sua senha com segurança.
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl border animate-in slide-in-from-top-2 duration-300 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' 
              : 'bg-red-50 text-red-800 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
          }`}>
            <p className="text-sm font-bold text-center">{message.text}</p>
          </div>
        )}

        <form className="space-y-6" action={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Endereço de Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none disabled:opacity-50"
              placeholder="seu@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando link...' : 'Enviar Link de Recuperação'}
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

