'use client'

import { useEffect } from 'react'
import Image from 'next/image'

export function RedirectLoading({ destinationUrl }: { destinationUrl: string }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = destinationUrl
    }, 1500)
    return () => clearTimeout(timer)
  }, [destinationUrl])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <Image
        src="/logo-gestaup.jpeg"
        alt="GestaUp"
        width={450}
        height={120}
        className="mb-8 h-30 w-auto"
        priority
      />
      <p className="mb-8 text-lg font-medium text-gray-700">
        Seu documento ficará pronto em instantes
      </p>
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
    </div>
  )
}
