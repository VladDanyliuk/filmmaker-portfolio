import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { pageBySlugQuery, allProjectsQuery } from '@/sanity/lib/queries'
import type { Page, Project } from '@/lib/types'
import { GalleryGrid } from '@/components/ui/GalleryGrid'
import { CTASection } from '@/components/sections/CTASection'
import { RevealOnScroll } from '@/components/motion/RevealOnScroll'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch<Page>(pageBySlugQuery, { slug: 'services' }).catch(() => null)
  return {
    title: page?.seoTitle || 'Services',
    description: page?.seoDescription || 'A curated selection of cinematic films, commercials, and documentaries.',
  }
}

export default async function WorkPage() {
  const [page, projects] = await Promise.all([
    client.fetch<Page>(pageBySlugQuery, { slug: 'services' }).catch(() => null),
    client.fetch<Project[]>(allProjectsQuery).catch(() => [] as Project[]),
  ])

  return (
    <>
      {/* Page Header */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 border-b border-glass">
        <div className="container mx-auto px-6 md:px-10">
          <RevealOnScroll>
            <p className="text-xs uppercase tracking-widest text-accent-orange mb-4">
              Portfolio
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

      {/* Gallery */}
      <section className="section-padding">
        <div className="container mx-auto px-6 md:px-10">
          {projects?.length > 0 ? (
            <GalleryGrid projects={projects} showFilters />
          ) : (
            <p className="text-text-secondary text-center py-16">
              Projects coming soon.
            </p>
          )}
        </div>
      </section>

      <CTASection
        headline="Seen Enough?"
        subtext="Let's collaborate on your next project."
        primaryLabel="Get in Touch"
        primaryHref="/contact"
      />
    </>
  )
}
