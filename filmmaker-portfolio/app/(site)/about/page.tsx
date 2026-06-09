import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { pageBySlugQuery } from '@/sanity/lib/queries'
import type { Page } from '@/lib/types'
import { AboutContent } from './AboutContent'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch<Page>(pageBySlugQuery, { slug: 'about' }).catch(() => null)
  return {
    title: page?.seoTitle || 'About',
    description: page?.seoDescription || '',
  }
}

export default async function AboutPage() {
  const page = await client.fetch<Page>(pageBySlugQuery, { slug: 'about' }).catch(() => null)
  return <AboutContent page={page} />
}
