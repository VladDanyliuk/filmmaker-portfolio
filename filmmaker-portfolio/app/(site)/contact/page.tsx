import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { pageBySlugQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import type { Page, SiteSettings } from '@/lib/types'
import { RevealOnScroll } from '@/components/motion/RevealOnScroll'
import { ContactForm } from '@/components/ui/ContactForm'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch<Page>(pageBySlugQuery, { slug: 'contact' }).catch(() => null)
  return {
    title: page?.seoTitle || 'Contact',
    description: page?.seoDescription || 'Book a call or get in touch for your next project.',
  }
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([
    client.fetch<Page>(pageBySlugQuery, { slug: 'contact' }).catch(() => null),
    client.fetch<SiteSettings>(siteSettingsQuery).catch(() => null),
  ])

  return (
    <>
      {/* Page Header */}
      <section className="pt-32 md:pt-40 pb-20 md:pb-28 border-b border-glass">
        <div className="container mx-auto px-6 md:px-10">
          <RevealOnScroll>
            <p className="text-xs uppercase tracking-widest text-accent-orange mb-4">
              Get In Touch
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight max-w-3xl">
              {page?.title || "Let's Create\nSomething"}
            </h1>
          </RevealOnScroll>
          {page?.subtitle && (
            <RevealOnScroll delay={0.2}>
              <p className="mt-6 text-text-secondary text-base md:text-lg max-w-xl leading-relaxed">
                {page.subtitle}
              </p>
            </RevealOnScroll>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20">
            {/* Left: info */}
            <RevealOnScroll direction="left">
              <div>
                <div className="w-8 h-px bg-accent-orange mb-6" />
                <h2 className="font-display text-2xl font-medium tracking-tight mb-7 md:mb-12">
                  Available for projects worldwide.
                </h2>

                <div className="space-y-6 md:space-y-8">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-text-secondary mb-1">Location</p>
                    <p className="text-text-primary">London, UK</p>
                  </div>

                  {settings?.contactEmail && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-text-secondary mb-1">Email</p>
                      <a
                        href={`mailto:${settings.contactEmail}`}
                        className="text-text-primary hover:text-accent-orange transition-colors duration-200"
                      >
                        {settings.contactEmail}
                      </a>
                    </div>
                  )}

                  {(settings?.instagramUrl || settings?.vimeoUrl) && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-text-secondary mb-2">Social</p>
                      <div className="flex gap-4">
                        {settings.instagramUrl && (
                          <a
                            href={settings.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
                          >
                            Instagram
                          </a>
                        )}
                        {settings.vimeoUrl && (
                          <a
                            href={settings.vimeoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
                          >
                            Vimeo
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </RevealOnScroll>

            {/* Right: form */}
            <RevealOnScroll direction="right" delay={0.1}>
              <ContactForm />
            </RevealOnScroll>
          </div>
        </div>
      </section>
    </>
  )
}
