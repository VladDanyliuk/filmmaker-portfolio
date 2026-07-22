import type { NextConfig } from 'next'

// Content-Security-Policy.
//
// 'unsafe-inline' (script + style) and 'unsafe-eval' are required by this stack
// without a nonce: Next.js App Router injects inline bootstrap/hydration scripts,
// framer-motion/Tailwind emit inline styles, and the Sanity Studio bundle at
// /studio relies on eval + inline styles. A stricter nonce-based policy would
// require a middleware that rewrites the CSP per request — see notes in the PR.
//
// connect/frame/img/media/worker entries cover: Sanity API + CDN (incl. Studio
// realtime over wss + blob web workers), the Vimeo oEmbed fetch in GalleryGrid,
// and YouTube/Vimeo video embeds. Resend is server-side only (no client origin).
//
// Google entries cover consent-gated GA4 (gtag.js): googletagmanager.com loads
// the script, and google-analytics.com + googletagmanager.com receive the beacon
// data. Fonts (Clash Display + Inter Tight) are self-hosted from /public/fonts,
// so no Google Fonts origins are needed.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://img.youtube.com https://i.vimeocdn.com https://f.vimeocdn.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.sanity.io wss://*.sanity.io https://vimeo.com https://www.google-analytics.com https://www.googletagmanager.com",
  "frame-src 'self' https://www.youtube-nocookie.com https://player.vimeo.com",
  "media-src 'self' blob: https:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
      {
        // Vimeo oEmbed thumbnails. The plain thumbnail_url uses /video/, but the
        // "with play button" variant uses /filter/overlay, so allow any path.
        protocol: 'https',
        hostname: 'i.vimeocdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'f.vimeocdn.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
