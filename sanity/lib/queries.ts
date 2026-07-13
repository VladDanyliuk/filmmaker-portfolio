import { groq } from 'next-sanity'

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    heroHeadline,
    heroSubtitle,
    heroPrimaryCtaText,
    heroPrimaryCtaUrl,
    heroSecondaryCtaText,
    heroSecondaryCtaUrl,
    heroVideo{ asset->{ url, mimeType } },
    heroFallbackImage,
    siteDescription,
    contactEmail,
    instagramUrl,
    vimeoUrl
  }
`

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    title,
    subtitle,
    content,
    heroImage,
    portraitImage,
    seoTitle,
    seoDescription
  }
`

export const allServicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id,
    title,
    description
  }
`

// Projects plus the categorySettings singleton in one round trip — the
// /services page needs both (settings drive the per-category "Coming Soon"
// lock in GalleryGrid).
export const projectsWithCategorySettingsQuery = groq`{
  "projects": *[_type == "project"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    category,
    role,
    coverImage,
    youtubeUrl,
    vimeoUrl,
    mp4File{ asset->{ url, mimeType } },
    description,
    year,
    client,
    featured
  },
  "categorySettings": *[_type == "categorySettings"][0] {
    weddingComingSoon,
    eventsComingSoon,
    businessVideosComingSoon,
    musicVideoComingSoon,
    concertsComingSoon,
    shortFilmComingSoon,
    shortFormContentComingSoon
  }
}`

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(order asc) [0...6] {
    _id,
    title,
    "slug": slug.current,
    category,
    role,
    coverImage,
    youtubeUrl,
    vimeoUrl,
    mp4File{ asset->{ url, mimeType } }
  }
`

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    category,
    role,
    coverImage,
    youtubeUrl,
    vimeoUrl,
    mp4File{ asset->{ url, mimeType } },
    description,
    year,
    client
  }
`
