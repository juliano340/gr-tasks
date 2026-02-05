"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import Link from "next/link"
import { checkUserEmail } from "@/app/actions"

type RegisterFormProps = {
  action: (formData: FormData) => unknown | Promise<unknown>
}

export default function RegisterForm({ action }: RegisterFormProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showMismatch, setShowMismatch] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [emailExists, setEmailExists] = useState(false)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)

  const canSubmit = useMemo(
    () => 
      password.length >= 6 && 
      confirmPassword.length >= 6 && 
      password === confirmPassword && 
      email.includes("@") && 
      !emailExists && 
      !isCheckingEmail,
    [password, confirmPassword, email, emailExists, isCheckingEmail]
  )

  useEffect(() => {
    if (confirmPassword.length === 0) {
      setShowMismatch(false)
      return
    }

    const handle = setTimeout(() => {
      setShowMismatch(password !== confirmPassword)
    }, 500)

    return () => clearTimeout(handle)
  }, [password, confirmPassword])

  useEffect(() => {
    const checkEmail = async () => {
      if (!email || !email.includes("@")) {
        setEmailExists(false)
        setIsCheckingEmail(false)
        return
      }

      setIsCheckingEmail(true)
      try {
        const { exists } = await checkUserEmail(email)
        setEmailExists(exists)
      } catch (err) {
        console.error("Error checking email:", err)
      } finally {
        setIsCheckingEmail(false)
      }
    }

    const handle = setTimeout(checkEmail, 800)
    return () => clearTimeout(handle)
  }, [email])

  return (
    <form
      className="space-y-5"
      action={async (formData) => {
        setError(null)
        const result = await action(formData) as { error?: string }
        if (result?.error) {
          setError(result.error)
        }
      }}
      onSubmit={(event) => {
        if (password !== confirmPassword) {
          event.preventDefault()
          setShowMismatch(true)
        }
      }}
      noValidate
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-gray-800 dark:text-gray-800 mb-1 leading-tight">Nome Completo</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-black dark:text-black placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            placeholder="Seu nome completo"
          />
        </div>
        <div>
          <label htmlFor="email-address" className="block text-sm font-bold text-gray-800 dark:text-gray-800 mb-1 leading-tight">Endereço de Email</label>
          <div className="relative">
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError(null)
              }}
              className={`w-full px-4 py-3 rounded-xl border bg-transparent text-black dark:text-black placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none ${
                emailExists ? "border-red-400" : "border-gray-300 dark:border-gray-700"
              }`}
              placeholder="seu@email.com"
            />
            {isCheckingEmail && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          {emailExists && (
            <p className="mt-2 text-sm text-red-600 font-semibold">
              Este e-mail já está em uso.
            </p>
          )}
          {error && !emailExists && (
            <p className="mt-2 text-sm text-red-600 font-semibold">
              {error === "Email already in use" ? "Este e-mail já está em uso." : error}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-bold text-gray-800 dark:text-gray-800 mb-1 leading-tight">Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-black dark:text-black placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            placeholder="Mínimo de 6 caracteres"
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-bold text-gray-800 dark:text-gray-800 mb-1 leading-tight">Confirmar Senha</label>
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border bg-transparent text-black dark:text-black placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none ${
              showMismatch ? "border-red-400" : "border-gray-300 dark:border-gray-700"
            }`}
            placeholder="Repita a senha"
            aria-invalid={showMismatch ? "true" : "false"}
            aria-describedby={showMismatch ? "confirm-password-error" : undefined}
          />
          {showMismatch && (
            <p id="confirm-password-error" className="mt-2 text-sm text-red-600 font-semibold">
              As senhas precisam ser iguais.
            </p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full py-3.5 px-4 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] ${
            canSubmit ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-indigo-300 text-white cursor-not-allowed"
          }`}
        >
          {isCheckingEmail ? "Verificando..." : "Criar Minha Conta"}
        </button>
      </div>
      
      <div className="text-center mt-6">
        <p className="text-sm text-gray-800 dark:text-gray-800 font-medium leading-relaxed">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-black">
            Faça login aqui
          </Link>
        </p>
      </div>
    </form>
  )
}
