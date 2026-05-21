import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CookieBanner } from '@/components/ui/CookieBanner'
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings: SiteSettings | null = await client.fetch(siteSettingsQuery).catch(() => null)

  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-bg text-text-primary font-body antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer settings={settings!} />
        <CookieBanner />
      </body>
    </html>
  )
}
