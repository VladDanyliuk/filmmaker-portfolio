'use client'

import { useState, useEffect } from 'react'
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
  'Commercial',
  'Documentary',
  'Music Video',
  'Short Film',
  'Brand Film',
]

function formatCategory(slug: string): string {
  return slug
    .replace(/\d{4}$/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)
  return match?.[1] ?? null
}

function getCardThumbnail(
  project: Project,
  vimeoThumbnails: Record<string, string>
): string | null {
  if (project.coverImage) {
    return urlFor(project.coverImage).width(900).url()
  }
  if (project.youtubeUrl) {
    const id = extractYouTubeId(project.youtubeUrl)
    if (id) return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
  }
  if (project.vimeoUrl) {
    return vimeoThumbnails[project._id] ?? null
  }
  return null
}

export function GalleryGrid({ projects, showFilters = true }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState('Wedding')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [vimeoThumbnails, setVimeoThumbnails] = useState<Record<string, string>>({})

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

      {/* ── Editorial grid — featured + secondary ──────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-14">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => {
            const imgSrc = getCardThumbnail(project, vimeoThumbnails)
            const hasVideo = !!(project.youtubeUrl || project.vimeoUrl)
            const isFeatured = i === 0

            return (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px 0px' }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className={isFeatured ? 'md:col-span-2' : ''}
              >
                <article className="group rounded-xl overflow-hidden bg-bg-secondary border border-white/[0.08] transition-all duration-300 hover:border-white/[0.16] hover:shadow-[0_8px_32px_rgba(0,0,0,0.45)]">

                  {/* ── Thumbnail ──────────────────────────────────────────── */}
                  <div
                    className={`relative aspect-video overflow-hidden bg-bg ${hasVideo ? 'cursor-pointer' : ''}`}
                    onClick={() => hasVideo && setSelectedProject(project)}
                  >
                    {imgSrc ? (
                      <Image
                        src={imgSrc}
                        alt={project.title}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes={isFeatured ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center p-6">
                        <p className="font-display text-text-secondary/25 text-sm text-center">
                          {project.title}
                        </p>
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/45 transition-colors duration-300" />

                    {/* Play button — always visible on touch, hover-reveal on desktop */}
                    {hasVideo && (
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
                    <h3
                      className={`font-display font-medium text-text-primary leading-snug ${
                        isFeatured ? 'text-xl md:text-2xl' : 'text-lg'
                      }`}
                    >
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
                      <p
                        className={`text-sm text-text-secondary/65 leading-relaxed ${
                          isFeatured ? 'line-clamp-3 max-w-2xl' : 'line-clamp-2'
                        }`}
                      >
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
        {selectedProject && (selectedProject.youtubeUrl || selectedProject.vimeoUrl) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-start md:items-center justify-center overflow-y-auto p-4 md:p-10"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl my-auto"
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
                  onClick={() => setSelectedProject(null)}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-white/[0.12] text-text-secondary hover:text-text-primary hover:border-white/25 transition-colors duration-200"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <VideoEmbed
                url={(selectedProject.youtubeUrl || selectedProject.vimeoUrl)!}
                title={selectedProject.title}
              />
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
