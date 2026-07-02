'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-glass border-b border-glass' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between md:grid md:grid-cols-3">
          {/* Logo — left */}
          <Link
            href="/"
            className="font-display font-semibold text-lg md:text-xl tracking-tight text-text-primary"
          >
            AD<span className="text-gradient-warm">.</span>
          </Link>

          {/* Desktop nav — truly centered */}
          <nav className="hidden md:flex items-center justify-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide transition-colors duration-200 ${
                  pathname === link.href
                    ? 'text-accent-orange'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side — button (desktop) or hamburger (mobile) */}
          <div className="flex items-center justify-end">
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2 text-sm font-medium border border-glass rounded-full text-text-primary hover:border-accent-orange/40 hover:text-accent-orange transition-all duration-300"
            >
              Book a Call
            </Link>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span
                className={`block h-px w-6 bg-text-primary transition-all duration-300 ${
                  menuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`block h-px w-6 bg-text-primary transition-all duration-300 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-px w-6 bg-text-primary transition-all duration-300 ${
                  menuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-lg md:hidden flex flex-col justify-center px-8"
          >
            <nav className="flex flex-col gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    className={`font-display text-4xl font-medium tracking-tight ${
                      pathname === link.href
                        ? 'text-accent-orange'
                        : 'text-text-primary'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
