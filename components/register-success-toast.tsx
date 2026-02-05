"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function RegisterSuccessToast() {
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered") === "true"
  const [visible, setVisible] = useState(false)
  const [fadingOut, setFadingOut] = useState(false)

  useEffect(() => {
    if (!registered) {
      setVisible(false)
      setFadingOut(false)
      return
    }

    setVisible(true)
    setFadingOut(false)

    const fadeTimer = setTimeout(() => setFadingOut(true), 4500)
    const hideTimer = setTimeout(() => setVisible(false), 5200)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [registered])

  if (!registered || !visible) return null

  return (
    <div
      className={`fixed right-6 top-6 z-[999] w-[92%] max-w-sm rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow-lg shadow-emerald-200/40 animate-in fade-in slide-in-from-top-2 duration-300 transition-opacity ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="font-semibold">Conta criada com sucesso!</p>
          <p className="text-emerald-700">
            Agora você pode fazer login
          </p>
        </div>
        </div>
    </div>
  )
}
