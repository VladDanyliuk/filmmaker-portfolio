import { client } from '@/sanity/lib/client'
import { siteSettingsQuery } from '@/sanity/lib/queries'
import type { SiteSettings } from '@/lib/types'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CookieBanner } from '@/components/ui/CookieBanner'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings: SiteSettings | null = await client.fetch(siteSettingsQuery).catch(() => null)

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer settings={settings!} />
      <CookieBanner />
    </>
  )
}
