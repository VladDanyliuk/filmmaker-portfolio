import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { pageBySlugQuery, allServicesQuery } from '@/sanity/lib/queries'
import type { Page, Service } from '@/lib/types'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { CTASection } from '@/components/sections/CTASection'
import { RevealOnScroll } from '@/components/motion/RevealOnScroll'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Services',
  description: 'Cinematic filmmaking services in London and beyond.',
}

export default async function ServicesPage() {
  const [page, services] = await Promise.all([
    client.fetch<Page>(pageBySlugQuery, { slug: 'services' }).catch(() => null),
    client.fetch<Service[]>(allServicesQuery).catch(() => [] as Service[]),
  ])

  return (
    <>
      {/* Page Header */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 border-b border-glass">
        <div className="container mx-auto px-6 md:px-10">
          <RevealOnScroll>
            <p className="text-xs uppercase tracking-widest text-accent-orange mb-4">
              What I Do
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight max-w-3xl">
              {page?.title || 'Services'}
            </h1>
          </RevealOnScroll>
          {page?.subtitle && (
            <RevealOnScroll delay={0.2}>
              <p className="mt-6 text-text-secondary text-base md:text-lg max-w-2xl leading-relaxed">
                {page.subtitle}
              </p>
            </RevealOnScroll>
          )}
        </div>
      </section>

      {/* Services grid */}
      <section className="section-padding">
        <div className="container mx-auto px-6 md:px-10">
          {services?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {services.map((service, i) => (
                <ServiceCard key={service._id} service={service} index={i} />
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-center py-16">
              Services coming soon.
            </p>
          )}
        </div>
      </section>

      <CTASection
        headline="Ready to Start?"
        subtext="Tell me about your project and let's create something extraordinary."
        primaryLabel="Book a Call"
        primaryHref="/contact"
        secondaryLabel="View Work"
        secondaryHref="/work"
      />
    </>
  )
}
