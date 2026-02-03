"use client"

import { useEffect } from "react"

interface AdBannerProps {
  dataAdSlot: string
  dataAdFormat?: string
  fullWidthResponsive?: boolean
}

export default function AdBanner({ 
  dataAdSlot, 
  dataAdFormat = "auto", 
  fullWidthResponsive = true 
}: AdBannerProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error("AdSense error:", err)
    }
  }, [])

  return (
    <div className="w-full flex justify-center my-8 overflow-hidden rounded-2xl bg-gray-50/50 border border-gray-100 min-h-[100px] relative">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-8578901708699710" // Placeholder - Usuário deve trocar
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
      {/* Label para debugging visual durante desenvolvimento */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Publicidade</span>
      </div>
    </div>
  )
}
