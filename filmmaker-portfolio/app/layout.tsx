import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { client } from '@/sanity/lib/client'
import { siteSettingsQuery } from '@/sanity/lib/queries'
import type { SiteSettings } from '@/lib/types'

export async function generateMetadata(): Promise<Metadata> {
  const settings: SiteSettings | null = await client.fetch(siteSettingsQuery).catch(() => null)
  return {
    title: {
      default: 'Videographer Portfolio',
      template: '%s | Videographer Portfolio',
    },
    description: settings?.siteDescription || 'London-based videographer & cinematographer',
    openGraph: {
      type: 'website',
      locale: 'en_GB',
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-bg text-text-primary font-body antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
