import { client } from '@/sanity/lib/client'
import { siteSettingsQuery, featuredProjectsQuery, allServicesQuery } from '@/sanity/lib/queries'
import type { SiteSettings, Service, Project } from '@/lib/types'
import { HeroSection } from '@/components/sections/HeroSection'
import { CTASection } from '@/components/sections/CTASection'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { GalleryGrid } from '@/components/ui/GalleryGrid'
import { RevealOnScroll } from '@/components/motion/RevealOnScroll'

export const revalidate = 60

export default async function HomePage() {
  const [settings, services, featuredProjects] = await Promise.all([
    client.fetch<SiteSettings>(siteSettingsQuery).catch(() => null),
    client.fetch<Service[]>(allServicesQuery).catch(() => [] as Service[]),
    client.fetch<Project[]>(featuredProjectsQuery).catch(() => [] as Project[]),
  ])

  return (
    <>
      <HeroSection settings={settings!} />

      {/* Featured Work */}
      {featuredProjects?.length > 0 && (
        <section className="section-padding container mx-auto px-6 md:px-10">
          <RevealOnScroll>
            <div className="flex items-end justify-between mb-10 md:mb-14">
              <div>
                <p className="text-xs uppercase tracking-widest text-accent-orange mb-3">
                  Selected Work
                </p>
                <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight">
                  Featured Projects
                </h2>
              </div>
              <a
                href="/work"
                className="hidden md:inline-flex text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 border-b border-glass pb-0.5"
              >
                View All
              </a>
            </div>
          </RevealOnScroll>
          <GalleryGrid projects={featuredProjects} showFilters={false} />
        </section>
      )}

      {/* Services */}
      {services?.length > 0 && (
        <section className="section-padding bg-bg-secondary border-t border-glass">
          <div className="container mx-auto px-6 md:px-10">
            <RevealOnScroll>
              <div className="mb-10 md:mb-14">
                <p className="text-xs uppercase tracking-widest text-accent-orange mb-3">
                  What I Do
                </p>
                <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight max-w-md">
                  Services
                </h2>
              </div>
            </RevealOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {services.map((service, i) => (
                <ServiceCard key={service._id} service={service} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection
        headline="Ready to Tell Your Story?"
        subtext="Based in London, available worldwide. Let's create something that moves people."
        primaryLabel="Start a Project"
        primaryHref="/contact"
        secondaryLabel="See the Work"
        secondaryHref="/work"
      />
    </>
  )
}
