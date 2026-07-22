'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

const CONSENT_KEY = 'cookie-consent'
const GA_MEASUREMENT_ID = 'G-V6TVQTC4P3'

/**
 * Loads GA4 (gtag.js) only after the visitor has explicitly accepted cookies.
 * Consent is stored in localStorage under 'cookie-consent'. GA4 is loaded when
 * the value is 'accepted' — never when it's 'declined', 'dismissed', or unset.
 *
 * If the visitor changes their choice later (e.g. via the cookie banner), the
 * banner should dispatch a `cookie-consent-change` event so GA4 can load without
 * a full page reload. Cross-tab changes via the native `storage` event are also
 * respected.
 */
export function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const syncConsent = () => {
      if (localStorage.getItem(CONSENT_KEY) === 'accepted') {
        setEnabled(true)
      }
    }

    // Initial check on mount.
    syncConsent()

    // React to consent changes made in this tab (banner should dispatch this)
    // or in another tab (native storage event).
    window.addEventListener('cookie-consent-change', syncConsent)
    window.addEventListener('storage', syncConsent)

    return () => {
      window.removeEventListener('cookie-consent-change', syncConsent)
      window.removeEventListener('storage', syncConsent)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  )
}
