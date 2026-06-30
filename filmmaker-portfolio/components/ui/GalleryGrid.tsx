'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { urlFor } from '@/sanity/lib/image'
import type { Project } from '@/lib/types'
import { VideoEmbed } from './VideoEmbed'

interface GalleryGridProps {
  projects: Project[]
  showFilters?: boolean
}

const CATEGORIES = [
  'Wedding',
  'Events',
  'Business Videos',
  'Music Video',
  'Concerts',
  'Short Film',
  'Short Form Content',
]

// Display-label overrides for Sanity category values whose stored value differs
// from the label we want to show. The underlying Sanity values stay unchanged
// (no data migration needed); we only relabel them in the UI.
const CATEGORY_LABELS: Record<string, string> = {
  commercial: 'Events',
  documentary: 'Business Videos',
  'brand-film': 'Short Form Content',
}

function formatCategory(slug: string): string {
  const override = CATEGORY_LABELS[slug.toLowerCase()]
  if (override) return override
  return slug
    .replace(/\d{4}$/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
}

function extractYouTubeId(url: string): string | null {
  // Handles watch?v=ID, youtu.be/ID, and Shorts (youtube.com/shorts/ID).
  const match = url.match(/(?:v=|youtu\.be\/|shorts\/)([^&?/]+)/)
  return match?.[1] ?? null
}

// Returns an ordered list of thumbnail URLs to try. Each is attempted in turn;
// when one fails to load (onError) the next is used, and when the list is
// exhausted a text placeholder is shown. This matters for YouTube: not every
// video has a maxresdefault.jpg frame, so we fall back to hqdefault.jpg (which
// effectively always exists).
function getThumbnailCandidates(
  project: Project,
  vimeoThumbnails: Record<string, string>
): string[] {
  if (project.coverImage) {
    // Force the card's 16:9 frame with fit('crop') so the Sanity hotspot/crop
    // is honoured (width-only URLs ignore the focal point — they just scale the
    // full image, which the aspect-video container then slices). Same approach
    // as the /about portrait and /services hero.
    return [urlFor(project.coverImage).width(1280).height(720).fit('crop').url()]
  }
  if (project.youtubeUrl) {
    const id = extractYouTubeId(project.youtubeUrl)
    if (id) {
      return [
        `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
        `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      ]
    }
  }
  if (project.vimeoUrl) {
    const thumb = vimeoThumbnails[project._id]
    return thumb ? [thumb] : []
  }
  return []
}

function Thumbnail({
  candidates,
  title,
}: {
  candidates: string[]
  title: string
}) {
  const [index, setIndex] = useState(0)

  // Reset when the candidate list changes (e.g. a Vimeo thumbnail arrives async).
  useEffect(() => {
    setIndex(0)
  }, [candidates])

  const src = candidates[index]

  if (!src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <p className="font-display text-text-secondary/25 text-sm text-center">{title}</p>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={title}
      fill
      className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
      sizes="(max-width: 768px) 100vw, 50vw"
      loading="lazy"
      onError={() => setIndex((i) => i + 1)}
    />
  )
}

export function GalleryGrid({ projects, showFilters = true }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState('Wedding')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [vimeoThumbnails, setVimeoThumbnails] = useState<Record<string, string>>({})

  // Lightbox accessibility: capture the element that opened the lightbox so
  // focus can be restored on close.
  const lightboxRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const openLightbox = (e: React.SyntheticEvent, project: Project) => {
    triggerRef.current = e.currentTarget as HTMLElement
    setSelectedProject(project)
  }

  // Escape to close + focus trap. Focus moves to the close button on open and
  // returns to the triggering element on close.
  useEffect(() => {
    if (!selectedProject) return

    closeBtnRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null)
        return
      }
      if (e.key !== 'Tab') return

      const node = lightboxRef.current
      if (!node) return
      const focusables = node.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
      )
      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      triggerRef.current?.focus()
    }
  }, [selectedProject])

  useEffect(() => {
    const needsVimeo = projects.filter(
      (p) => !p.coverImage && !p.youtubeUrl && p.vimeoUrl
    )
    if (!needsVimeo.length) return

    Promise.all(
      needsVimeo.map(async (p) => {
        try {
          const res = await fetch(
            `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(p.vimeoUrl!)}`
          )
          if (!res.ok) return null
          const data = await res.json()
          return [p._id, data.thumbnail_url as string] as const
        } catch {
          return null
        }
      })
    ).then((results) => {
      const map: Record<string, string> = {}
      results.forEach((r) => { if (r) map[r[0]] = r[1] })
      setVimeoThumbnails(map)
    })
  }, [projects])

  const filtered = showFilters
    ? projects.filter((p) => formatCategory(p.category) === activeCategory)
    : projects

  return (
    <div>
      {/* ── Filters — minimal underlined tabs ──────────────────────────────── */}
      {showFilters && (
        <div className="overflow-x-auto no-scrollbar pb-px mb-12 md:mb-16 -mx-6 px-6 md:mx-0 md:px-0">
          <div className="flex justify-start md:justify-center gap-6 md:gap-9 min-w-max">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative pb-2 text-sm tracking-wide whitespace-nowrap transition-colors duration-200 ${
                    active
                      ? 'text-text-primary'
                      : 'text-text-secondary/60 hover:text-text-primary'
                  }`}
                >
                  {cat}
                  {active && (
                    <motion.span
                      layoutId="filter-underline"
                      className="absolute left-0 right-0 -bottom-px h-px bg-accent-orange"
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Empty state — e.g. the default category has no projects yet ─────── */}
      {showFilters && filtered.length === 0 && (
        <p className="text-text-secondary/60 text-center py-16">
          No projects in this category yet.
        </p>
      )}

      {/* ── Uniform grid — equal-size cards, 2 per row ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-14">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => {
            const candidates = getThumbnailCandidates(project, vimeoThumbnails)
            // A project is playable in the lightbox if it has an uploaded MP4,
            // a YouTube URL, or a Vimeo URL. MP4 takes priority at render time.
            const hasPlayable = !!(
              project.mp4File?.asset?.url ||
              project.youtubeUrl ||
              project.vimeoUrl
            )

            return (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px 0px' }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <article className="group rounded-xl overflow-hidden bg-bg-secondary border border-white/[0.08] transition-all duration-300 hover:border-white/[0.16] hover:shadow-[0_8px_32px_rgba(0,0,0,0.45)]">

                  {/* ── Thumbnail ──────────────────────────────────────────── */}
                  <div
                    className={`relative aspect-video overflow-hidden bg-bg ${hasPlayable ? 'cursor-pointer' : ''} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange`}
                    onClick={(e) => hasPlayable && openLightbox(e, project)}
                    role={hasPlayable ? 'button' : undefined}
                    tabIndex={hasPlayable ? 0 : undefined}
                    aria-label={hasPlayable ? `Play ${project.title}` : undefined}
                    onKeyDown={
                      hasPlayable
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              openLightbox(e, project)
                            }
                          }
                        : undefined
                    }
                  >
                    <Thumbnail
                      candidates={candidates}
                      title={project.title}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/45 transition-colors duration-300" />

                    {/* Play button — always visible on touch, hover-reveal on desktop */}
                    {hasPlayable && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-14 h-14 rounded-full border border-white/40 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                          <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── Metadata ───────────────────────────────────────────── */}
                  <div className="px-5 md:px-6 py-5 space-y-3">
                    <h3 className="font-display font-medium text-text-primary leading-snug text-lg">
                      {project.title}
                    </h3>

                    {(project.client || project.role) && (
                      <div className="space-y-1 text-sm">
                        {project.client && (
                          <p>
                            <span className="text-text-secondary/50">Client: </span>
                            <span className="text-text-primary">{project.client}</span>
                          </p>
                        )}
                        {project.role && (
                          <p>
                            <span className="text-text-secondary/50">Role: </span>
                            <span className="text-text-primary">{project.role}</span>
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <span className="text-xs uppercase tracking-wider text-accent-orange">
                        {formatCategory(project.category)}
                      </span>
                      {project.year && (
                        <span className="text-xs text-text-secondary/45">Year: {project.year}</span>
                      )}
                    </div>

                    {project.description && (
                      <p className="text-sm text-text-secondary/65 leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                </article>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* ── Lightbox ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedProject &&
          (selectedProject.mp4File?.asset?.url ||
            selectedProject.youtubeUrl ||
            selectedProject.vimeoUrl) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-start md:items-center justify-center overflow-y-auto p-4 md:p-10"
          >
            <motion.div
              ref={lightboxRef}
              role="dialog"
              aria-modal="true"
              aria-label={selectedProject.title}
              tabIndex={-1}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full my-auto ${
                selectedProject.mp4File?.asset?.url ? 'max-w-sm' : 'max-w-4xl'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-accent-orange mb-1">
                    {formatCategory(selectedProject.category)}
                  </p>
                  <h3 className="font-display text-xl font-medium text-text-primary">
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  ref={closeBtnRef}
                  onClick={() => setSelectedProject(null)}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-white/[0.12] text-text-secondary hover:text-text-primary hover:border-white/25 transition-colors duration-200"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              {selectedProject.mp4File?.asset?.url ? (
                // Uploaded MP4 (vertical Reel) takes priority — play natively.
                // Muted autoplay + loop satisfies browser autoplay policies;
                // controls let the viewer unmute, scrub, and fullscreen.
                <div className="relative w-full aspect-[9/16] max-h-[80vh] mx-auto rounded-sm overflow-hidden bg-black">
                  <video
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    // Never let the browser pop this out into Picture-in-Picture.
                    // The video autoplays while the framer-motion modal is still
                    // animating in (opacity/scale < 1); Chrome's auto-PiP heuristic
                    // treats the briefly-occluded playing video as a PiP candidate
                    // and floats it out, leaving the modal black. This also removes
                    // the PiP button from the native controls.
                    disablePictureInPicture
                    className="absolute inset-0 w-full h-full object-contain"
                  >
                    {/* Use the asset's real MIME type (video/mp4 or video/quicktime
                        for .mov) so the browser gets an accurate hint rather than
                        assuming mp4. */}
                    <source
                      src={selectedProject.mp4File.asset.url}
                      type={selectedProject.mp4File.asset.mimeType || undefined}
                    />
                  </video>
                </div>
              ) : (
                <VideoEmbed
                  url={(selectedProject.youtubeUrl || selectedProject.vimeoUrl)!}
                  title={selectedProject.title}
                />
              )}
              {selectedProject.description && (
                <p className="text-sm text-text-secondary/80 mt-4 leading-relaxed whitespace-pre-line">
                  {selectedProject.description}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
