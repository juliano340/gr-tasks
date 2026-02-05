"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { clearDeletedCookie } from "@/app/settings-actions"

export default function AccountDeletedModal({ forceVisible }: { forceVisible?: boolean }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const deleted = forceVisible || searchParams.get("account-deleted") === "true"
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (deleted) {
      setVisible(true)
    }
  }, [deleted])

  const handleClose = async () => {
    setVisible(false)
    await clearDeletedCookie()
    router.replace("/")
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative z-10 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-black/10 max-w-sm w-full overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-400" />
        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5.5 h-5.5 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
                Conta excluída
              </h3>
              <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                Sua conta foi removida com sucesso.
              </p>
            </div>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 mb-6">
            <p className="text-sm font-semibold text-indigo-700">
              Esperamos ver você novamente em breve.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-full py-2.5 px-4 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  )
}
