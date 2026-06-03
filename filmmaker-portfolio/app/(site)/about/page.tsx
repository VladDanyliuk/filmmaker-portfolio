import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { pageBySlugQuery } from '@/sanity/lib/queries'
import type { Page } from '@/lib/types'
import { TextBlock } from '@/components/ui/TextBlock'
import { CTASection } from '@/components/sections/CTASection'
import { RevealOnScroll } from '@/components/motion/RevealOnScroll'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch<Page>(pageBySlugQuery, { slug: 'about' }).catch(() => null)
  return {
    title: page?.seoTitle || 'About',
    description: page?.seoDescription || '',
  }
}

export default async function AboutPage() {
  const page = await client.fetch<Page>(pageBySlugQuery, { slug: 'about' }).catch(() => null)

  return (
    <>
      {/* Page Header */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 border-b border-glass">
        <div className="container mx-auto px-6 md:px-10">
          <RevealOnScroll>
            <p className="text-xs uppercase tracking-widest text-accent-orange mb-4">
              About
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight max-w-3xl">
              {page?.title || 'The Filmmaker'}
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

      {/* Content */}
      <section className="section-padding">
        <div className="container mx-auto px-6 md:px-10 max-w-3xl">
          <RevealOnScroll>
            <TextBlock content={page?.content ?? []} />
          </RevealOnScroll>
        </div>
      </section>

      <CTASection
        headline="Let's Work Together"
        subtext="Open for projects in London and beyond."
        primaryLabel="Get in Touch"
        primaryHref="/contact"
        secondaryLabel="Service"
        secondaryHref="/work"
      />
    </>
  )
}
