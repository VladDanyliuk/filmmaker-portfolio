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

const CATEGORIES = ['All', 'Commercial', 'Documentary', 'Music Video', 'Short Film', 'Brand Film', 'Wedding']

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)
  return match?.[1] ?? null
}

function getCardThumbnail(
  project: Project,
  vimeoThumbnails: Record<string, string>
): string | null {
  if (project.coverImage) {
    return urlFor(project.coverImage).width(800).url()
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
  const [activeCategory, setActiveCategory] = useState('All')
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

  const filtered =
    activeCategory === 'All'
      ? projects
      : projects.filter(
          (p) =>
            p.category.toLowerCase().replace(/-/g, ' ') ===
            activeCategory.toLowerCase()
        )

  return (
    <div>
      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 md:gap-3 mb-10 md:mb-14">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-xs tracking-wide rounded-full border transition-all duration-200 ${
                activeCategory === cat
                  ? 'border-accent-orange text-accent-orange bg-accent-orange/10'
                  : 'border-glass text-text-secondary hover:border-white/20 hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        <AnimatePresence>
          {filtered.map((project, i) => {
            const imgSrc = getCardThumbnail(project, vimeoThumbnails)
            const hasVideo = !!(project.youtubeUrl || project.vimeoUrl)

            return (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => hasVideo && setSelectedProject(project)}
                className={`group relative aspect-video overflow-hidden rounded-sm bg-bg-secondary border border-glass ${
                  hasVideo ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={project.title}
                    fill
                    className="object-contain transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                ) : (
                  /* Dark placeholder when no image source is available */
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <p className="font-display text-text-secondary/30 text-sm text-center leading-relaxed">
                      {project.title}
                    </p>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-400" />

                {/* Play icon — shown for both YouTube and Vimeo */}
                {hasVideo && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 rounded-full border border-white/40 bg-bg/50 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-xs uppercase tracking-widest text-accent-orange mb-1">
                    {project.category}
                  </p>
                  <p className="font-display text-base font-medium text-white">
                    {project.title}
                  </p>
                  {project.client && (
                    <p className="text-xs text-white/60 mt-0.5">{project.client}</p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* Video lightbox — handles both YouTube and Vimeo */}
      <AnimatePresence>
        {selectedProject && (selectedProject.youtubeUrl || selectedProject.vimeoUrl) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-accent-orange mb-1">
                    {selectedProject.category}
                  </p>
                  <h3 className="font-display text-xl font-medium text-text-primary">
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-glass text-text-secondary hover:text-text-primary hover:border-white/20 transition-colors duration-200"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <VideoEmbed
                url={(selectedProject.youtubeUrl || selectedProject.vimeoUrl)!}
                title={selectedProject.title}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
