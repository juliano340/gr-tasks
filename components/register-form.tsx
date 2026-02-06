"use client"

import { useEffect, useMemo, useState, useCallback, useRef } from "react"
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
  {
    title: "Termos de Uso",
    subtitle: "Quase pronto! Leia e aceite os termos.",
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
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showValidationBadges, setShowValidationBadges] = useState(false)
  const [nameTouched, setNameTouched] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [emailValidationReady, setEmailValidationReady] = useState(false)
  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const emailInputRef = useRef<HTMLInputElement | null>(null)
  const passwordInputRef = useRef<HTMLInputElement | null>(null)
  const confirmPasswordInputRef = useRef<HTMLInputElement | null>(null)
  const termsCheckboxRef = useRef<HTMLInputElement | null>(null)

  const isEmailValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }, [email])

  const passwordRequirements = useMemo(() => ({
    length: password.length >= 6,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /[0-9]/.test(password)
  }), [password])

  const stepChecks = useMemo(
    () => [
      name.trim().length >= 2 && name.length <= 100,
      isEmailValid && !emailExists && !isCheckingEmail && email.length <= 255,
      passwordRequirements.length && passwordRequirements.hasLetter && passwordRequirements.hasNumber && password.length <= 100,
      password === confirmPassword && confirmPassword.length >= 6 && confirmPassword.length <= 100,
      acceptedTerms,
    ],
    [name, isEmailValid, emailExists, isCheckingEmail, passwordRequirements, password, confirmPassword, acceptedTerms, email.length]
  )

  const totalSteps = STEPS.length
  const canContinue = stepChecks.slice(0, step + 1).every(Boolean)
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
    if (step === 0) {
      nameInputRef.current?.focus()
      return
    }
    if (step === 1) {
      emailInputRef.current?.focus()
      return
    }
    if (step === 2) {
      passwordInputRef.current?.focus()
      return
    }
    if (step === 3) {
      confirmPasswordInputRef.current?.focus()
      return
    }
    if (step === 4) {
      termsCheckboxRef.current?.focus()
    }
  }, [step])

  useEffect(() => {
    const checkEmail = async () => {
      if (!email || !email.includes("@")) {
        setEmailExists(false)
        setIsCheckingEmail(false)
        setEmailValidationReady(true)
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
        setEmailValidationReady(true)
      }
    }

    setEmailValidationReady(false)
    const handle = setTimeout(checkEmail, 800)
    return () => clearTimeout(handle)
  }, [email])

  const handleNext = useCallback(() => {
    if (!canContinue) {
      setShowValidationBadges(true)
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
    if (step === 1 && (!email || email.trim().length === 0)) {
      setEmailTouched(false)
      setShowValidationBadges(false)
    }
    setStep((current) => Math.max(current - 1, 0))
  }, [step, email])

  const activeStep = STEPS[step] ?? STEPS[0]

  const validationBadges = useMemo(() => {
    const badges: { step: number; label: string }[] = []

    if (nameTouched && name.trim().length === 0) {
      badges.push({ step: 0, label: "Nome obrigatorio" })
    } else if (name.length > 100) {
      badges.push({ step: 0, label: "Nome muito longo" })
    }

    if (emailValidationReady) {
      if (emailTouched && email.trim().length === 0) {
        badges.push({ step: 1, label: "Email obrigatorio" })
      } else if (email.length > 0 && !isEmailValid) {
        badges.push({ step: 1, label: "Email invalido" })
      } else if (email.length > 255) {
        badges.push({ step: 1, label: "Email muito longo" })
      } else if (email.length > 0 && emailExists) {
        badges.push({ step: 1, label: "Email em uso" })
      } else if (email.length > 0 && isCheckingEmail) {
        badges.push({ step: 1, label: "Verificando email" })
      }
    }

    if (password.length > 0 && (!passwordRequirements.length || !passwordRequirements.hasLetter || !passwordRequirements.hasNumber)) {
      badges.push({ step: 2, label: "Senha nao atende requisitos" })
    } else if (password.length > 100) {
      badges.push({ step: 2, label: "Senha muito longa" })
    }

    if (step === 3 && confirmPassword.length > 0) {
      if (showMismatch) {
        badges.push({ step: 3, label: "Senhas diferentes" })
      } else if (confirmPassword.length > 100) {
        badges.push({ step: 3, label: "Confirmacao muito longa" })
      }
    }

    return badges
  }, [name, email, emailExists, isCheckingEmail, password, confirmPassword, passwordRequirements, nameTouched, emailTouched, emailValidationReady, isEmailValid, showMismatch, step])
  const showGenericError = error && error !== "Email already in use"
  const shouldShowValidationBadges = showValidationBadges || (step < 3 && !canContinue) || (step === 3 && showMismatch && confirmPassword.length > 0)
  const visibleValidationBadges = useMemo(() => {
    return validationBadges.filter((badge) => 
      badge.step < step || (badge.step === step && shouldShowValidationBadges)
    )
  }, [step, validationBadges, shouldShowValidationBadges])

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
            setShowValidationBadges(true)
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
          setShowValidationBadges(true)
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

        {/* Barra de progresso segmentada */}
        <div className="flex gap-2 h-1.5 w-full">
          {STEPS.map((_, index) => {
            const hasError = validationBadges.some((b) => b.step === index) && (index < step || (index === step && shouldShowValidationBadges))
            
            let segmentColor = "bg-gray-100 dark:bg-gray-100"
            if (hasError) {
              segmentColor = "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
            } else if (index <= step) {
              segmentColor = "bg-gradient-to-r from-indigo-600 to-violet-500 shadow-[0_0_10px_rgba(79,70,229,0.2)]"
            }

            return (
              <div
                key={index}
                className={`h-full flex-1 rounded-full transition-all duration-500 ${segmentColor}`}
              />
            )
          })}
        </div>

        {showGenericError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {shouldShowValidationBadges && visibleValidationBadges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {visibleValidationBadges.map((badge, index) => (
              <button
                key={`${badge.step}-${badge.label}-${index}`}
                type="button"
                onClick={() => {
                  setStep(badge.step)
                }}
                className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800 hover:bg-amber-100 cursor-pointer"
                aria-label={`Ir para ${badge.label}`}
              >
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-200 text-[10px] font-black text-amber-900 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.55)] transition-transform scale-105">
                  !
                </span>
                Erro: {badge.label}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <div className={step === 0 ? "space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200" : "hidden"} aria-hidden={step !== 0}>
            <label htmlFor="name" className="block text-sm font-bold text-gray-800 dark:text-gray-800 mb-1 leading-tight">Nome Completo</label>
            <input
              id="name"
              name="name"
              type="text"
              ref={nameInputRef}
              autoComplete="name"
              required
              maxLength={100}
              value={name}
              onChange={(e) => {
                const newValue = e.target.value.slice(0, 100)
                setName(newValue)
                setError(null)
                if (!nameTouched) {
                  setNameTouched(true)
                }
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
                ref={emailInputRef}
                autoComplete="email"
                required
                maxLength={255}
                value={email}
                onChange={(e) => {
                  const newValue = e.target.value.slice(0, 255)
                  setEmail(newValue)
                  setError(null)
                  if (!emailTouched) {
                    setEmailTouched(true)
                  }
                  setEmailValidationReady(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Tab" && isCheckingEmail) {
                    e.preventDefault()
                  }
                }}
                onBlur={() => {
                  if (isCheckingEmail) {
                    emailInputRef.current?.focus()
                  }
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
            {error === "Email already in use" && !emailExists && (
              <p className="sr-only">Email em uso.</p>
            )}
          </div>

          <div className={step === 2 ? "space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200" : "hidden"} aria-hidden={step !== 2}>
            <label htmlFor="password" className="block text-sm font-bold text-gray-800 dark:text-gray-800 mb-1 leading-tight">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              ref={passwordInputRef}
              autoComplete="new-password"
              required
              maxLength={100}
              disabled={!stepChecks.slice(0, 2).every(Boolean)}
              value={password}
              onChange={(e) => {
                const newValue = e.target.value.slice(0, 100)
                setPassword(newValue)
                setError(null)
              }}
              className={`w-full px-4 py-3 rounded-xl border bg-transparent text-black dark:text-black placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none ${
                password.length > 0 && (!passwordRequirements.length || !passwordRequirements.hasLetter || !passwordRequirements.hasNumber) ? "border-red-400" : "border-gray-300 dark:border-gray-700"
              } ${!stepChecks.slice(0, 2).every(Boolean) ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
              placeholder={!stepChecks.slice(0, 2).every(Boolean) ? "Corrija os erros anteriores primeiro" : "Minimo de 6 caracteres (letras e numeros)"}
            />
            <div className="space-y-1.5 pt-1">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Requisitos da senha:</p>
              <div className="grid grid-cols-2 gap-2">
                <div className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${passwordRequirements.length ? "text-green-600" : "text-gray-400"}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${passwordRequirements.length ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-gray-300"}`} />
                  Pelo menos 6 caracteres
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${passwordRequirements.hasLetter ? "text-green-600" : "text-gray-400"}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${passwordRequirements.hasLetter ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-gray-300"}`} />
                  Pelo menos uma letra
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${passwordRequirements.hasNumber ? "text-green-600" : "text-gray-400"}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${passwordRequirements.hasNumber ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-gray-300"}`} />
                  Pelo menos um numero
                </div>
              </div>
            </div>
          </div>

          <div className={step === 3 ? "space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200" : "hidden"} aria-hidden={step !== 3}>
            <label htmlFor="confirm-password" className="block text-sm font-bold text-gray-800 dark:text-gray-800 mb-1 leading-tight">Confirmar Senha</label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              ref={confirmPasswordInputRef}
              autoComplete="new-password"
              required
              maxLength={100}
              disabled={!stepChecks.slice(0, 3).every(Boolean)}
              value={confirmPassword}
              onChange={(e) => {
                const newValue = e.target.value.slice(0, 100)
                setConfirmPassword(newValue)
                setError(null)
              }}
              className={`w-full px-4 py-3 rounded-xl border bg-transparent text-black dark:text-black placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none ${
                showMismatch ? "border-red-400" : "border-gray-300 dark:border-gray-700"
              } ${!stepChecks.slice(0, 3).every(Boolean) ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
              placeholder={!stepChecks.slice(0, 3).every(Boolean) ? "Corrija os erros anteriores primeiro" : "Repita sua senha"}
              aria-invalid={showMismatch ? "true" : "false"}
              aria-describedby={showMismatch ? "confirm-password-error" : undefined}
            />
            {showMismatch && (
              <p id="confirm-password-error" className="text-sm text-red-600 font-semibold animate-in fade-in duration-300">
                As senhas precisam ser iguais.
              </p>
            )}
          </div>

          <div className={step === 4 ? "space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200" : "hidden"} aria-hidden={step !== 4}>
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 space-y-4">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative flex items-center mt-1">
                    <input
                        type="checkbox"
                        ref={termsCheckboxRef}
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-indigo-200 transition-all checked:bg-indigo-600 checked:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    />
                    <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700 font-semibold leading-relaxed group-hover:text-gray-900 transition-colors">
                    Li e concordo com os <Link href="/termos" target="_blank" className="text-indigo-600 font-black hover:underline decoration-2">Termos de Uso</Link> e estou ciente do caráter experimental do sistema.
                  </span>
                </label>
            </div>
            
            <p className="text-xs text-center text-gray-500 font-medium px-4">
              Ao clicar em "Criar Minha Conta", você confirma que leu e aceita nossos termos.
            </p>
          </div>
        </div>

        <div className="flex flex-row-reverse items-center gap-3">
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
          
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3.5 px-4 rounded-xl font-bold border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all"
            >
              Voltar
            </button>
          )}
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
