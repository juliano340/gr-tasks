"use client"

import { forgotPassword } from "@/app/actions"
import Link from "next/link"
import { useState } from "react"

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage(null)

    const result = await forgotPassword(formData)

    if (result.error) {
      setMessage({ type: "error", text: result.error })
    } else if (result.success) {
      setMessage({ type: "success", text: result.success })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Task<span className="text-indigo-600">Master</span>
            </span>
          </Link>
          <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
            Voltar ao login
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[140px] opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-100 rounded-full blur-[120px] opacity-40 pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-white rounded-3xl shadow-xl shadow-indigo-200/50 border border-gray-100 p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-gray-100 shadow-inner">
                <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Recuperar acesso</h2>
              <p className="text-gray-500 mt-2 font-medium text-sm">Enviaremos um link para redefinir a senha do app.</p>
            </div>

            {message && (
              <div
                className={`mb-6 p-4 rounded-xl border-2 animate-in slide-in-from-top-2 duration-300 text-sm font-bold text-center ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : "bg-red-50 text-red-700 border-red-100"
                }`}
              >
                {message.text}
              </div>
            )}

            <form action={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">E-mail de Cadastro</label>
                <input
                  name="email"
                  type="email"
                  required
                  disabled={loading}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium placeholder:text-gray-400 disabled:opacity-50"
                />
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">
                Se sua conta foi criada com Google, este processo cria ou altera apenas a senha do TaskMaster.
                Sua senha do Google nao e alterada.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold shadow-lg transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processando...
                  </span>
                ) : (
                  "Enviar Instrucoes"
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors uppercase tracking-widest underline decoration-1 underline-offset-4"
                >
                  Cancelar e voltar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="py-8 bg-white/50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">TaskMaster - Protecao de Dados</div>
      </footer>
    </div>
  )
}
