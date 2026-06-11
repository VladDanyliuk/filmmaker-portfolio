'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

function resetScroll() {
  // Direct assignment bypasses CSS scroll-behavior: smooth — always instant.
  // documentElement covers standard browsers; body covers iOS Safari, which
  // tracks the viewport scroll on <body> rather than <html>.
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
  // window.scrollTo as an additional reset. 'instant' prevents any
  // animated scroll that scroll-behavior: smooth would otherwise trigger.
  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  } catch {
    window.scrollTo(0, 0)
  }
}

export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Immediate attempt — catches most desktop navigations.
    resetScroll()
    // Deferred attempt — iOS Safari needs a frame after the route transition
    // before the scroll position can actually be changed.
    const id = setTimeout(resetScroll, 50)
    return () => clearTimeout(id)
  }, [pathname])

  useEffect(() => {
    // Belt-and-suspenders for browser back/forward on mobile.
    // usePathname already re-fires on popstate, but this ensures the
    // deferred reset also runs for history navigations.
    const onPopState = () => {
      resetScroll()
      setTimeout(resetScroll, 50)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  return null
}
