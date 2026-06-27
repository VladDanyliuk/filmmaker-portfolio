import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'heroPrimaryCtaText',
      title: 'Hero Primary CTA Button Text',
      type: 'string',
    }),
    defineField({
      name: 'heroPrimaryCtaUrl',
      title: 'Hero Primary CTA Button URL',
      type: 'string',
    }),
    defineField({
      name: 'heroSecondaryCtaText',
      title: 'Hero Secondary CTA Button Text',
      type: 'string',
    }),
    defineField({
      name: 'heroSecondaryCtaUrl',
      title: 'Hero Secondary CTA Button URL',
      type: 'string',
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero Background Video',
      type: 'file',
      options: { accept: 'video/mp4,video/quicktime' },
      description:
        'Desktop hero background video (.mp4 or .mov), uploaded directly here — no developer needed. ' +
        'On mobile, the Hero Mobile Fallback Image below is shown instead.',
    }),
    defineField({
      name: 'heroFallbackImage',
      title: 'Hero Mobile Fallback Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Meta Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'vimeoUrl',
      title: 'Vimeo URL',
      type: 'url',
    }),
  ],
})
