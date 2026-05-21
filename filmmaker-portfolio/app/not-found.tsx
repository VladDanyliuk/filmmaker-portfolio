import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div>
        <p className="text-xs uppercase tracking-widest text-accent-orange mb-4">404</p>
        <h1 className="font-display text-4xl md:text-6xl font-medium tracking-tight mb-6">
          Page Not Found
        </h1>
        <p className="text-text-secondary mb-10">This scene didn't make the cut.</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-3.5 bg-accent-orange text-bg font-medium text-sm rounded-full hover:bg-accent-gold transition-all duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
