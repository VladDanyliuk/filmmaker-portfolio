import type { Metadata } from 'next'
import Image from 'next/image'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { pageBySlugQuery, projectsWithCategorySettingsQuery } from '@/sanity/lib/queries'
import type { CategorySettings, Page, Project } from '@/lib/types'
import { GalleryGrid } from '@/components/ui/GalleryGrid'
import { CTASection } from '@/components/sections/CTASection'
import { RevealOnScroll } from '@/components/motion/RevealOnScroll'
import { TextBlock } from '@/components/ui/TextBlock'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch<Page>(pageBySlugQuery, { slug: 'services' }).catch(() => null)
  return {
    title: page?.seoTitle || 'Services',
    description: page?.seoDescription || 'A curated selection of cinematic films, commercials, and documentaries.',
  }
}

function hotspotPosition(img?: { hotspot?: { x: number; y: number } }) {
  return img?.hotspot
    ? `${Math.round(img.hotspot.x * 100)}% ${Math.round(img.hotspot.y * 100)}%`
    : 'center'
}

export default async function ServicesPage() {
  const [page, { projects, categorySettings }] = await Promise.all([
    client.fetch<Page>(pageBySlugQuery, { slug: 'services' }).catch(() => null),
    client
      .fetch<{ projects: Project[]; categorySettings: CategorySettings | null }>(
        projectsWithCategorySettingsQuery
      )
      .catch(() => ({ projects: [] as Project[], categorySettings: null })),
  ])

  const heroSrc = page?.heroImage
    ? urlFor(page.heroImage).width(1920).fit('crop').url()
    : null
  const portraitSrc = page?.portraitImage
    ? urlFor(page.portraitImage).width(900).height(1200).fit('crop').url()
    : null

  return (
    <>
      {/* ── Header / Hero ──────────────────────────────────────────────────── */}
      {heroSrc ? (
        <section className="relative h-[60vh] min-h-[440px] flex items-center justify-center overflow-hidden">
          <Image
            src={heroSrc}
            alt={page?.title || 'Services'}
            fill
            priority
            className="object-cover"
            style={{ objectPosition: hotspotPosition(page?.heroImage) }}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-bg" />
          <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
            <RevealOnScroll duration={0.8}>
              <p className="text-xs uppercase tracking-[0.3em] text-accent-orange mb-4 md:mb-5">
                Portfolio
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.15} duration={0.8}>
              <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.05]">
                {page?.title || 'Services'}
              </h1>
            </RevealOnScroll>
            {page?.subtitle && (
              <RevealOnScroll delay={0.3} duration={0.8}>
                <p className="mt-4 md:mt-6 text-text-secondary text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                  {page.subtitle}
                </p>
              </RevealOnScroll>
            )}
          </div>
        </section>
      ) : (
        <section className="pt-28 sm:pt-32 md:pt-40 pb-10 md:pb-16">
          <div className="container mx-auto px-6 md:px-10">
            <div className="max-w-3xl mx-auto text-center">
              <RevealOnScroll>
                <p className="text-xs uppercase tracking-[0.3em] text-accent-orange mb-4 md:mb-5">
                  Portfolio
                </p>
              </RevealOnScroll>
              <RevealOnScroll delay={0.1}>
                <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.05]">
                  {page?.title || 'Services'}
                </h1>
              </RevealOnScroll>
              {page?.subtitle && (
                <RevealOnScroll delay={0.2}>
                  <p className="mt-4 md:mt-6 text-text-secondary text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                    {page.subtitle}
                  </p>
                </RevealOnScroll>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Intro: portrait + content blocks ───────────────────────────────── */}
      {(portraitSrc || page?.content?.length) && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6 md:px-10 max-w-6xl">
            {portraitSrc && page?.content?.length ? (
              <div className="grid md:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center">
                <RevealOnScroll direction="left">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
                    <Image
                      src={portraitSrc}
                      alt={page?.title ? `${page.title} portrait` : 'Portrait'}
                      fill
                      className="object-cover"
                      style={{ objectPosition: hotspotPosition(page?.portraitImage) }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </RevealOnScroll>
                <RevealOnScroll direction="right">
                  <div className="border-l-2 border-accent-orange pl-6 md:pl-8">
                    <TextBlock content={page.content} />
                  </div>
                </RevealOnScroll>
              </div>
            ) : portraitSrc ? (
              <RevealOnScroll>
                <div className="relative aspect-[16/9] max-w-4xl mx-auto overflow-hidden rounded-sm">
                  <Image
                    src={portraitSrc}
                    alt={page?.title ? `${page.title} portrait` : 'Portrait'}
                    fill
                    className="object-cover"
                    style={{ objectPosition: hotspotPosition(page?.portraitImage) }}
                    sizes="(max-width: 896px) 100vw, 896px"
                  />
                </div>
              </RevealOnScroll>
            ) : (
              <RevealOnScroll>
                <div className="max-w-2xl mx-auto">
                  <TextBlock content={page!.content} />
                </div>
              </RevealOnScroll>
            )}
          </div>
        </section>
      )}

      {/* ── Gallery ────────────────────────────────────────────────────────── */}
      <section className="pb-20 md:pb-32">
        <div className="container mx-auto px-6 md:px-10">
          {projects?.length > 0 ? (
            <GalleryGrid projects={projects} showFilters categorySettings={categorySettings} />
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
