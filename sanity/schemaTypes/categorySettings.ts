import { defineField, defineType } from 'sanity'

// One "Coming Soon" switch per portfolio category. Titles mirror the tabs on
// the /services page; each flag hides that category's project grid behind a
// "Coming Soon" message when turned on. Managed as a singleton document —
// see sanity/structure.ts.
const CATEGORY_FLAGS: { name: string; title: string }[] = [
  { name: 'weddingComingSoon', title: 'Wedding' },
  { name: 'eventsComingSoon', title: 'Events' },
  { name: 'businessVideosComingSoon', title: 'Business Videos' },
  { name: 'musicVideoComingSoon', title: 'Music Video' },
  { name: 'concertsComingSoon', title: 'Concerts' },
  { name: 'shortFilmComingSoon', title: 'Short Film' },
  { name: 'shortFormContentComingSoon', title: 'Short Form Content' },
]

export const categorySettings = defineType({
  name: 'categorySettings',
  title: 'Category Visibility',
  type: 'document',
  fields: CATEGORY_FLAGS.map(({ name, title }) =>
    defineField({
      name,
      title: `${title} — Coming Soon`,
      type: 'boolean',
      initialValue: false,
      description: `When on, the ${title} tab shows a "Coming Soon" message instead of its projects.`,
    })
  ),
  preview: {
    prepare: () => ({ title: 'Category Visibility' }),
  },
})
