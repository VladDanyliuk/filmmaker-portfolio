import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

if (!projectId) {
  console.warn(
    '[Sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is not set. ' +
    'Copy .env.local.example to .env.local and fill in your project ID.'
  )
}

export const client = createClient({
  projectId: projectId || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
})
