'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Direct property assignment bypasses CSS scroll-behavior: smooth,
    // giving an instant reset on every route change including back/forward.
    // Both properties are set to cover standard browsers (documentElement)
    // and iOS Safari, which sometimes tracks scroll on body instead.
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname])

  return null
}
