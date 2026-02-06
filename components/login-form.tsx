"use client"

import { useState } from "react"

type LoginFormProps = {
  action: (formData: FormData) => Promise<{ error?: string } | void>
}

export default function LoginForm({ action }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  return (
    <form
      action={async (formData) => {
        setError(null)
        const result = await action(formData)
        if (result?.error) {
          setError(result.error)
        }
      }}
      className="space-y-4"
    >
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide ml-1">E-mail</label>
        <input
          name="email"
          type="email"
          required
          maxLength={255}
          value={email}
          onChange={(e) => {
            const newValue = e.target.value.slice(0, 255)
            setEmail(newValue)
          }}
          placeholder="seu@email.com"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide ml-1">Senha</label>
        <input
          name="password"
          type="password"
          required
          maxLength={100}
          value={password}
          onChange={(e) => {
            const newValue = e.target.value.slice(0, 100)
            setPassword(newValue)
          }}
          placeholder="********"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium"
        />
      </div>

      <button
        type="submit"
        className="w-full py-4 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold shadow-lg transition-all hover:-translate-y-0.5 active:scale-[0.98] mt-2"
      >
        Entrar no TaskMaster
      </button>
    </form>
  )
}
