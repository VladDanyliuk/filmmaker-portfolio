import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import type { PortableTextBlock } from '@portabletext/types'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-text-secondary leading-relaxed mb-5">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-text-primary mt-10 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-xl md:text-2xl font-medium tracking-tight text-text-primary mt-8 mb-3">
        {children}
      </h3>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-medium text-text-primary">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-text-secondary">{children}</em>,
  },
  types: {
    image: ({ value }) => {
      const src = urlFor(value).width(1200).height(675).fit('crop').url()
      return (
        <figure className="my-8 md:my-12">
          <div className="relative w-full aspect-video overflow-hidden rounded-sm border-glass">
            <Image
              src={src}
              alt={value.alt || ''}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-3 text-xs text-text-secondary text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

interface TextBlockProps {
  content: PortableTextBlock[]
  className?: string
}

export function TextBlock({ content, className }: TextBlockProps) {
  if (!content?.length) return null
  return (
    <div className={className}>
      <PortableText value={content} components={components} />
    </div>
  )
}
