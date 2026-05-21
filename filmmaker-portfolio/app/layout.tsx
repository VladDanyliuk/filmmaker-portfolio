import type { Metadata } from 'next'
import './globals.css'
import { client } from '@/sanity/lib/client'
import { siteSettingsQuery } from '@/sanity/lib/queries'
import type { SiteSettings } from '@/lib/types'

export async function generateMetadata(): Promise<Metadata> {
  const settings: SiteSettings | null = await client.fetch(siteSettingsQuery).catch(() => null)
  return {
    title: {
      default: 'Filmmaker Portfolio',
      template: '%s | Filmmaker Portfolio',
    },
    description: settings?.siteDescription || 'London-based filmmaker & cinematographer',
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
      </body>
    </html>
  )
}
