'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

function resetScroll() {
  // Inline style overrides the Tailwind scroll-smooth class (scroll-behavior: smooth)
  // on <html> so that all resets below are guaranteed instant on iOS Safari.
  document.documentElement.style.scrollBehavior = 'auto'

  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0  // iOS Safari sometimes tracks scroll on <body>
  window.scrollTo(0, 0)

  // <main> can become the scroll container on iOS when body has overflow set
  const main = document.querySelector('main')
  if (main) main.scrollTop = 0

  // Restore CSS-defined scroll-behavior after the frame so in-page anchor
  // links remain smooth.
  requestAnimationFrame(() => {
    document.documentElement.style.scrollBehavior = ''
  })
}

export function ScrollToTop() {
  const pathname = usePathname()

  // Fires on every client-side route change (push, replace, and popstate
  // that Next.js handles via the router).
  useEffect(() => {
    resetScroll()
    // Deferred retry: iOS Safari needs a frame after the route transition
    // before the scroll position can actually be changed.
    const id = setTimeout(resetScroll, 60)
    return () => clearTimeout(id)
  }, [pathname])

  // Belt-and-suspenders for browser back/forward on mobile browsers that
  // may fire popstate before usePathname updates.
  useEffect(() => {
    const onPopState = () => {
      resetScroll()
      setTimeout(resetScroll, 60)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // iOS Safari Back-Forward Cache: when a cached page is restored, the React
  // tree is NOT re-executed and usePathname does NOT re-fire. Only the
  // pageshow event (with persisted=true) reliably fires after BFCache
  // restoration — and crucially, AFTER the browser restores the old scroll
  // position, so this must run last.
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        resetScroll()
        setTimeout(resetScroll, 60)
      }
    }
    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [])

  return null
}
