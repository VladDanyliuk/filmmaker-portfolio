'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { urlFor } from '@/sanity/lib/image'
import type { SiteSettings } from '@/lib/types'

interface HeroSectionProps {
  settings: SiteSettings
}

export function HeroSection({ settings }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)

  // Page-level scroll reset fallback for iOS Safari — fires on every mount
  // (i.e. every navigation to "/"), catches cases where the layout-level
  // ScrollToTop component doesn't fire in time.
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'auto'
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    window.scrollTo(0, 0)
    requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = ''
    })
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (isMobile === false && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [isMobile])

  const heroVideoUrl = settings?.heroVideo?.asset?.url
  const heroVideoMime = settings?.heroVideo?.asset?.mimeType

  const fallbackImage = settings?.heroFallbackImage
  const fallbackSrc = fallbackImage
    ? urlFor(fallbackImage).width(1920).fit('crop').url()
    : null
  const hotspot = fallbackImage?.hotspot
  const objectPosition = hotspot
    ? `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`
    : 'center'

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
    },
  }

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* ── Background ── */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isMobile === null ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {isMobile === false && heroVideoUrl ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <source src={heroVideoUrl} type={heroVideoMime || undefined} />
          </video>
        ) : fallbackSrc ? (
          <Image
            src={fallbackSrc}
            alt="Hero background"
            fill
            priority
            className="object-cover"
            style={{ objectPosition }}
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-bg-secondary" />
        )}
      </div>

      {/* ── Overlays ── */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/30 via-transparent to-transparent" />

      {/* ── Content ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto px-6 md:px-10 text-center md:text-left max-w-5xl"
      >
        <motion.p
          variants={itemVariants}
          className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent-orange mb-6 md:mb-8"
        >
          London · Videographer
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[1] mb-6 md:mb-8"
        >
          {settings?.heroHeadline || 'Cinematic Stories\nCome Alive'}
        </motion.h1>

        {settings?.heroSubtitle && (
          <motion.p
            variants={itemVariants}
            className="text-text-secondary text-base md:text-lg max-w-xl mb-10 md:mb-12 mx-auto md:mx-0 leading-relaxed"
          >
            {settings.heroSubtitle}
          </motion.p>
        )}

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-4"
        >
          {settings?.heroPrimaryCtaText && (
            <Link
              href={settings.heroPrimaryCtaUrl || '/services'}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent-orange text-bg font-medium text-sm rounded-full hover:bg-accent-gold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] glow-orange w-full sm:w-auto"
            >
              {settings.heroPrimaryCtaText}
            </Link>
          )}
          {settings?.heroSecondaryCtaText && (
            <Link
              href={settings.heroSecondaryCtaUrl || '/contact'}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-glass text-text-primary font-medium text-sm rounded-full hover:border-white/20 hover:bg-white/5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
            >
              {settings.heroSecondaryCtaText}
            </Link>
          )}
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-widest text-text-secondary">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-text-secondary to-transparent"
        />
      </motion.div>
    </section>
  )
}
