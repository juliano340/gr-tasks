"use client"

import { useState } from "react"

interface User {
  image: string | null
  name: string | null
}

interface PremiumAvatarsProps {
  users: User[]
}

export default function PremiumAvatars({ users }: PremiumAvatarsProps) {
  const fallbacks = [
    "bg-gradient-to-br from-indigo-400 to-indigo-600",
    "bg-gradient-to-br from-amber-400 to-orange-500",
    "bg-gradient-to-br from-emerald-400 to-teal-500",
    "bg-gradient-to-br from-pink-400 to-rose-500",
  ]

  // Estado para rastrear imagens que falharam
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({})

  return (
    <div className="flex -space-x-2.5">
      {[0, 1, 2, 3].map((index) => {
        const user = users[index]
        const hasFailed = failedImages[index]

        if (user?.image && !hasFailed) {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={user.image}
              alt={user.name || "Apoiador"}
              referrerPolicy="no-referrer"
              onError={() => setFailedImages((prev) => ({ ...prev, [index]: true }))}
              className="w-9 h-9 rounded-full border-2 border-[#f7f8fa] object-cover shadow-sm bg-gray-200"
            />
          )
        }

        // Mostrar fallback se não houver usuário, não houver imagem ou a imagem falhou
        return (
          <div
            key={index}
            className={`w-9 h-9 rounded-full border-2 border-[#f7f8fa] shadow-sm flex items-center justify-center text-[10px] font-bold text-white ${fallbacks[index]}`}
          >
            {!user?.image && index === 0 && user?.name ? user.name.charAt(0).toUpperCase() : ""}
          </div>
        )
      })}
    </div>
  )
}
