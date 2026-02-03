"use client"

import { useEffect, useState } from "react"

type LoginErrorBannerProps = {
  error?: string
}

export default function LoginErrorBanner({ error }: LoginErrorBannerProps) {
  const [visible, setVisible] = useState(false)
  const [fadingOut, setFadingOut] = useState(false)

  useEffect(() => {
    if (!error) {
      setVisible(false)
      setFadingOut(false)
      return
    }

    setVisible(true)
    setFadingOut(false)

    const fadeTimer = setTimeout(() => setFadingOut(true), 2500)
    const hideTimer = setTimeout(() => setVisible(false), 3000)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [error])

  if (!error || !visible) return null

  const message =
    error === "CredentialsSignin"
      ? "Email ou senha incorretos."
      : "Ocorreu um erro ao entrar."

  return (
    <div
      className={`rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm animate-in fade-in slide-in-from-top-1 duration-300 transition-opacity ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600">
          !
        </span>
        <span className="font-semibold">{message}</span>
      </div>
    </div>
  )
}
