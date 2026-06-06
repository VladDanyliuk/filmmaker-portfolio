import Link from 'next/link'
import { RevealOnScroll } from '@/components/motion/RevealOnScroll'

interface CTASectionProps {
  headline?: string
  subtext?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}

export function CTASection({
  headline = 'Ready to Create Something Extraordinary?',
  subtext = "Let's collaborate on your next cinematic project.",
  primaryLabel = 'Start a Project',
  primaryHref = '/contact',
  secondaryLabel = 'Services',
  secondaryHref = '/work',
}: CTASectionProps) {
  return (
    <section className="section-padding bg-bg-secondary border-t border-glass">
      <div className="container mx-auto px-6 md:px-10 text-center max-w-3xl">
        <RevealOnScroll>
          <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight mb-6">
            {headline}
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <p className="text-text-secondary text-base md:text-lg mb-10 leading-relaxed">
            {subtext}
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-accent-orange text-bg font-medium text-sm rounded-full hover:bg-accent-gold transition-all duration-300 hover:scale-[1.02] glow-orange w-full sm:w-auto"
            >
              {primaryLabel}
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center px-8 py-3.5 border border-glass text-text-primary font-medium text-sm rounded-full hover:border-white/20 hover:bg-white/5 transition-all duration-300 hover:scale-[1.02] w-full sm:w-auto"
            >
              {secondaryLabel}
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
