'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Camera,
  Scissors,
  Palette,
  Heart,
  Music,
  Briefcase,
  Ticket,
  Building2,
  Mic,
} from 'lucide-react'
import { TextBlock } from '@/components/ui/TextBlock'
import { urlFor } from '@/sanity/lib/image'
import type { Page } from '@/lib/types'
import { CTASection } from '@/components/sections/CTASection'

const ease = [0.25, 0.1, 0.25, 1]

const SKILLS = [
  { label: 'Cinematography',      Icon: Camera    },
  { label: 'Video Editing',       Icon: Scissors  },
  { label: 'Color Grading',       Icon: Palette   },
  { label: 'Wedding Films',       Icon: Heart     },
  { label: 'Music Videos',        Icon: Music     },
  { label: 'Commercial Content',  Icon: Briefcase },
  { label: 'Event Coverage',      Icon: Ticket    },
  { label: 'Real Estate Video',   Icon: Building2 },
  { label: 'Podcast & Interviews',Icon: Mic       },
]

const TIMELINE = [
  {
    year: '2017',
    text: 'Started as a video editor at age 15, building a foundation in storytelling and post-production',
  },
  {
    year: '2019',
    text: 'First professional wedding and commercial projects in Ukraine',
  },
  {
    year: '2021',
    text: 'Expanded career to Italy, working on international projects',
  },
  {
    year: '2023',
    text: 'Established in London, UK — freelancing for brands, businesses and private clients',
  },
  {
    year: '2024',
    text: 'BA (Hons) in Film & TV Production, University of Greenwich',
  },
  {
    year: '2025',
    text: 'Founded AD. — full-service video production and dedicated wedding filmmaking team in London',
  },
]

function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className,
}: {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })
  const offsets = {
    up: { x: 0, y: 30 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
    none: { x: 0, y: 0 },
  }
  const { x, y } = offsets[direction]
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x, y }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SkillCard({
  label,
  Icon,
  index,
}: {
  label: string
  Icon: React.ComponentType<{ className?: string }>
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px 0px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease }}
      className="group flex flex-col items-center justify-center gap-3 px-5 py-7 md:py-8 rounded-xl border border-white/[0.08] bg-white/[0.03] cursor-default transition-all duration-300 hover:border-accent-orange/30 hover:bg-white/[0.06]"
    >
      <Icon className="w-6 h-6 md:w-7 md:h-7 text-accent-orange" />
      <span className="text-sm md:text-base text-text-secondary group-hover:text-text-primary transition-colors duration-300 text-center leading-snug">
        {label}
      </span>
    </motion.div>
  )
}

function TimelineItem({
  year,
  text,
  index,
  isMobile,
}: {
  year: string
  text: string
  index: number
  isMobile: boolean | null
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })
  const isRight = index % 2 !== 0

  return (
    <motion.div
      ref={ref}
      animate={
        inView
          ? { opacity: 1, x: 0 }
          : { opacity: 0, x: isMobile !== false ? 0 : isRight ? 30 : -30 }
      }
      transition={{ duration: 0.7, ease }}
      className="relative mb-10 md:mb-14"
    >
      {/* Dot — left-aligned on mobile, centered on desktop */}
      <div className="absolute top-1.5 left-[10px] md:left-1/2 md:-translate-x-1.5 w-3 h-3 rounded-full bg-accent-orange ring-4 ring-accent-orange/20 z-10" />

      {/* Desktop: alternating two columns */}
      <div className="hidden md:grid md:grid-cols-2">
        <div className={!isRight ? 'pr-14' : ''}>
          {!isRight && (
            <div className="text-right">
              <p className="font-display text-2xl font-medium text-accent-orange mb-2">{year}</p>
              <p className="text-text-secondary leading-relaxed">{text}</p>
            </div>
          )}
        </div>
        <div className={isRight ? 'pl-14' : ''}>
          {isRight && (
            <>
              <p className="font-display text-2xl font-medium text-accent-orange mb-2">{year}</p>
              <p className="text-text-secondary leading-relaxed">{text}</p>
            </>
          )}
        </div>
      </div>

      {/* Mobile: single column left-aligned */}
      <div className="md:hidden pl-10">
        <p className="font-display text-xl font-medium text-accent-orange mb-1">{year}</p>
        <p className="text-text-secondary text-base leading-relaxed">{text}</p>
      </div>
    </motion.div>
  )
}

export function AboutContent({ page }: { page: Page | null }) {
  const isMobile = useIsMobile()

  const heroSrc = page?.heroImage
    ? urlFor(page.heroImage).width(1920).fit('crop').url()
    : null
  const heroPosition = page?.heroImage?.hotspot
    ? `${Math.round(page.heroImage.hotspot.x * 100)}% ${Math.round(page.heroImage.hotspot.y * 100)}%`
    : 'center'

  const portraitSrc = page?.portraitImage
    ? urlFor(page.portraitImage).width(900).height(1200).fit('crop').url()
    : null
  const portraitPosition = page?.portraitImage?.hotspot
    ? `${Math.round(page.portraitImage.hotspot.x * 100)}% ${Math.round(page.portraitImage.hotspot.y * 100)}%`
    : 'center'

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
  }

  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {heroSrc ? (
          <Image
            src={heroSrc}
            alt="About hero"
            fill
            priority
            className="object-cover"
            style={{ objectPosition: heroPosition }}
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-bg-secondary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/20 via-transparent to-transparent" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        >
          <motion.p
            variants={itemVariants}
            className="text-xs uppercase tracking-[0.3em] text-accent-orange mb-5 md:mb-6"
          >
            London · About
          </motion.p>
          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.05] mb-5 md:mb-6"
          >
            The Story Behind the Lens
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-text-secondary text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          >
            London-based videographer with over seven years of experience
          </motion.p>
        </motion.div>
      </section>

      {/* ── 2. Bio ───────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 md:px-10 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-start">
            {/* Portrait — left col, slides in from left */}
            <Reveal direction="left">
              {portraitSrc ? (
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
                  <Image
                    src={portraitSrc}
                    alt="Portrait"
                    fill
                    className="object-cover"
                    style={{ objectPosition: portraitPosition }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="relative aspect-[3/4] bg-bg-secondary rounded-sm border-glass" />
              )}
            </Reveal>

            {/* Bio text — right col, slides in from right */}
            <Reveal direction="right" className="md:pt-8">
              <div className="border-l-2 border-accent-orange pl-6 md:pl-8">
                <p className="text-xs uppercase tracking-[0.3em] text-accent-orange mb-6">
                  {page?.subtitle || 'The Videographer'}
                </p>
                {page?.content?.length ? (
                  <TextBlock content={page.content} />
                ) : (
                  <p className="text-text-secondary leading-relaxed text-base md:text-lg">
                    Based in London with over seven years behind the lens, I create cinematic films
                    that tell authentic stories. From weddings to brand videos, every project is
                    crafted with intention and a deep love for the visual medium.
                  </p>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 3. Skills ───────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-bg-secondary border-y border-white/[0.06]">
        <div className="container mx-auto px-6 md:px-10 max-w-6xl">
          <Reveal className="mb-12 md:mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-accent-orange mb-4">Expertise</p>
            <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight">
              What I Do
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {SKILLS.map(({ label, Icon }, i) => (
              <SkillCard key={label} label={label} Icon={Icon} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Timeline ─────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 md:px-10 max-w-6xl">
          <Reveal className="mb-14 md:mb-20 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-accent-orange mb-4">Career</p>
            <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight">
              The Journey
            </h2>
          </Reveal>
          <div className="relative max-w-4xl mx-auto">
            {/* Vertical line: left on mobile, centered on desktop */}
            <div className="absolute top-0 bottom-0 left-4 md:left-1/2 w-px md:-translate-x-px bg-gradient-to-b from-transparent via-accent-orange/40 to-transparent" />
            {TIMELINE.map((item, i) => (
              <TimelineItem
                key={item.year}
                year={item.year}
                text={item.text}
                index={i}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CTA ───────────────────────────────────────────────────────────── */}
      <CTASection
        headline="Let's Work Together"
        subtext="Open for projects in London and beyond."
        primaryLabel="Get in Touch"
        primaryHref="/contact"
        secondaryLabel="View Work"
        secondaryHref="/work"
      />
    </>
  )
}
