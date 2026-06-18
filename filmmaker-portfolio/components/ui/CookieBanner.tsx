'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

const CONSENT_KEY = 'cookie-consent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      setVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem(CONSENT_KEY, 'dismissed')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-3xl mx-auto bg-bg-secondary border border-glass rounded-sm px-5 py-4 md:px-6 md:py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xl">
            <p className="text-sm text-text-secondary leading-relaxed flex-1">
              This site uses no tracking or analytics cookies — only a small note in your browser so
              this message stays dismissed.{' '}
              <Link
                href="/privacy-policy"
                className="text-text-primary underline underline-offset-2 hover:text-accent-orange transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-xs uppercase tracking-widest bg-accent-orange text-bg font-medium rounded-full hover:bg-accent-gold transition-all duration-200"
              >
                Got it
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
