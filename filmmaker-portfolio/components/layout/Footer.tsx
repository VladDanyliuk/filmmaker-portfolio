import Link from 'next/link'
import type { SiteSettings } from '@/lib/types'

interface FooterProps {
  settings: SiteSettings
}

export function Footer({ settings }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-glass bg-bg-secondary">
      <div className="container mx-auto px-6 md:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mb-12">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-display font-semibold text-2xl tracking-tight text-text-primary"
            >
              SA<span className="text-gradient-warm">.</span>
            </Link>
            <p className="mt-4 text-text-secondary text-sm leading-relaxed max-w-xs">
              London-based filmmaker crafting cinematic stories for brands, artists, and documentaries.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs uppercase tracking-widest text-text-secondary mb-5">Navigate</p>
            <nav className="flex flex-col gap-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About' },
                { href: '/work', label: 'Services' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact & Social */}
          <div>
            <p className="text-xs uppercase tracking-widest text-text-secondary mb-5">Connect</p>
            <div className="flex flex-col gap-3">
              {settings?.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="text-sm text-text-secondary hover:text-accent-orange transition-colors duration-200 w-fit"
                >
                  {settings.contactEmail}
                </a>
              )}
              {settings?.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 w-fit"
                >
                  Instagram
                </a>
              )}
              {settings?.vimeoUrl && (
                <a
                  href={settings.vimeoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 w-fit"
                >
                  Vimeo
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-glass pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-secondary">
            &copy; {year} Filmmaker Portfolio. All rights reserved.
          </p>
          <p className="text-xs text-text-secondary">
            Based in London, UK
          </p>
        </div>
      </div>
    </footer>
  )
}
