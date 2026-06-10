import type { PortableTextBlock } from '@portabletext/types'

export interface SiteSettings {
  heroHeadline: string
  heroSubtitle: string
  heroPrimaryCtaText: string
  heroPrimaryCtaUrl: string
  heroSecondaryCtaText: string
  heroSecondaryCtaUrl: string
  heroVideoUrl: string
  heroFallbackImage: SanityImage
  siteDescription: string
  contactEmail: string
  instagramUrl: string
  vimeoUrl: string
}

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
  alt?: string
}

export interface Page {
  title: string
  subtitle: string
  content: PortableTextBlock[]
  heroImage?: SanityImage
  portraitImage?: SanityImage
  seoTitle?: string
  seoDescription?: string
}

export interface Service {
  _id: string
  title: string
  description: string
}

export interface Project {
  _id: string
  title: string
  slug: string
  category: string
  coverImage?: SanityImage
  youtubeUrl?: string
  vimeoUrl?: string
  description?: string
  year?: number
  client?: string
  featured?: boolean
}
