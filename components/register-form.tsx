"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import Link from "next/link"
import { checkUserEmail } from "@/app/actions"

type RegisterFormProps = {
  action: (formData: FormData) => unknown | Promise<unknown>
}

const STEPS = [
  {
    title: "Seu nome",
    subtitle: "Como devemos te chamar?",
  },
  {
    title: "Seu e-mail",
    subtitle: "Vamos usar para acessar sua conta.",
  },
  {
    title: "Crie sua senha",
    subtitle: "Minimo de 6 caracteres.",
  },
  {
    title: "Confirme a senha",
    subtitle: "Repita para evitar erros.",
  },
]

export default function RegisterForm({ action }: RegisterFormProps) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showMismatch, setShowMismatch] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [emailExists, setEmailExists] = useState(false)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)

  const stepChecks = useMemo(
    () => [
      name.trim().length >= 2,
      email.includes("@") && !emailExists && !isCheckingEmail,
      password.length >= 6,
      confirmPassword.length >= 6 && password === confirmPassword,
    ],
    [name, email, emailExists, isCheckingEmail, password, confirmPassword]
  )

  const totalSteps = STEPS.length
  const canContinue = stepChecks[step]
  const canSubmit = stepChecks.every(Boolean) && !isCheckingEmail

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
    if (step !== totalSteps - 1) {
      setShowMismatch(false)
    }
  }, [step, totalSteps])

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

  const handleNext = useCallback(() => {
    if (!canContinue) {
      if (step === totalSteps - 1 && password !== confirmPassword) {
        setShowMismatch(true)
      }
      return
    }
    setError(null)
    setStep((current) => Math.min(current + 1, totalSteps - 1))
  }, [canContinue, step, totalSteps, password, confirmPassword])

  const handleBack = useCallback(() => {
    setError(null)
    setStep((current) => Math.max(current - 1, 0))
  }, [])

  const activeStep = STEPS[step] ?? STEPS[0]
  const progress = Math.round(((step + 1) / totalSteps) * 100)
  const showGenericError = error && error !== "Email already in use"

  return (
    <form
      className="space-y-6"
      action={async (formData) => {
        setError(null)
        const result = await action(formData) as { error?: string }
        if (result?.error) {
          setError(result.error)
          if (result.error === "Email already in use") {
            setStep(1)
            setEmailExists(true)
          }
        }
      }}
      onSubmit={(event) => {
        if (step < totalSteps - 1) {
          event.preventDefault()
          handleNext()
          return
        }

        if (!canSubmit) {
          event.preventDefault()
          if (password !== confirmPassword) {
            setShowMismatch(true)
          }
        }
      }}
      noValidate
    >
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-indigo-500">
              Passo {step + 1} de {totalSteps}
            </p>
            <h3 className="text-xl font-extrabold text-gray-900">{activeStep.title}</h3>
            <p className="text-sm text-gray-500">{activeStep.subtitle}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black">
            {step + 1}
          </div>
        </div>

        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {showGenericError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className={step === 0 ? "space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200" : "hidden"} aria-hidden={step !== 0}>
            <label htmlFor="name" className="block text-sm font-bold text-gray-800 dark:text-gray-800 mb-1 leading-tight">Nome Completo</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError(null)
              }}
              className={`w-full px-4 py-3 rounded-xl border bg-transparent text-black dark:text-black placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none ${
                name.trim().length > 0 && name.trim().length < 2 ? "border-red-400" : "border-gray-300 dark:border-gray-700"
              }`}
              placeholder="Seu nome completo"
              aria-invalid={name.trim().length > 0 && name.trim().length < 2 ? "true" : "false"}
            />
            <p className="text-xs text-gray-500">Minimo de 2 caracteres.</p>
          </div>

          <div className={step === 1 ? "space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200" : "hidden"} aria-hidden={step !== 1}>
            <label htmlFor="email-address" className="block text-sm font-bold text-gray-800 dark:text-gray-800 mb-1 leading-tight">Endereco de Email</label>
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
            {email.length > 0 && !email.includes("@") && (
              <p className="text-xs font-semibold text-red-600">
                Informe um email valido.
              </p>
            )}
            {emailExists && (
              <p className="text-sm text-red-600 font-semibold">
                Este e-mail ja esta em uso.
              </p>
            )}
            {error === "Email already in use" && !emailExists && (
              <p className="text-sm text-red-600 font-semibold">
                Este e-mail ja esta em uso.
              </p>
            )}
          </div>

          <div className={step === 2 ? "space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200" : "hidden"} aria-hidden={step !== 2}>
            <label htmlFor="password" className="block text-sm font-bold text-gray-800 dark:text-gray-800 mb-1 leading-tight">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(null)
              }}
              className={`w-full px-4 py-3 rounded-xl border bg-transparent text-black dark:text-black placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none ${
                password.length > 0 && password.length < 6 ? "border-red-400" : "border-gray-300 dark:border-gray-700"
              }`}
              placeholder="Minimo de 6 caracteres"
            />
            <p className="text-xs text-gray-500">Use pelo menos 6 caracteres.</p>
          </div>

          <div className={step === 3 ? "space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200" : "hidden"} aria-hidden={step !== 3}>
            <label htmlFor="confirm-password" className="block text-sm font-bold text-gray-800 dark:text-gray-800 mb-1 leading-tight">Confirmar Senha</label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setError(null)
              }}
              className={`w-full px-4 py-3 rounded-xl border bg-transparent text-black dark:text-black placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none ${
                showMismatch ? "border-red-400" : "border-gray-300 dark:border-gray-700"
              }`}
              placeholder="Repita a senha"
              aria-invalid={showMismatch ? "true" : "false"}
              aria-describedby={showMismatch ? "confirm-password-error" : undefined}
            />
            {showMismatch && (
              <p id="confirm-password-error" className="text-sm text-red-600 font-semibold">
                As senhas precisam ser iguais.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3.5 px-4 rounded-xl font-bold border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all"
            >
              Voltar
            </button>
          )}
          <button
            type={step === totalSteps - 1 ? "submit" : "button"}
            onClick={step === totalSteps - 1 ? undefined : handleNext}
            disabled={step === totalSteps - 1 ? !canSubmit : !canContinue}
            className={`py-3.5 px-4 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] ${
              step > 0 ? "flex-1" : "w-full"
            } ${
              (step === totalSteps - 1 ? canSubmit : canContinue)
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-indigo-300 text-white cursor-not-allowed"
            }`}
          >
            {step === totalSteps - 1
              ? (isCheckingEmail ? "Verificando..." : "Criar Minha Conta")
              : (step === 1 && isCheckingEmail ? "Verificando..." : "Continuar")}
          </button>
        </div>
      </div>
      
      <div className="text-center mt-6">
        <p className="text-sm text-gray-800 dark:text-gray-800 font-medium leading-relaxed">
          Ja tem uma conta?{" "}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-black">
            Faca login aqui
          </Link>
        </p>
      </div>
    </form>
  )
}
