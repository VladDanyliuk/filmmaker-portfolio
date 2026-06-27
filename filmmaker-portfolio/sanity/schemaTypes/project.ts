import { defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Events', value: 'commercial' },
          { title: 'Business Videos', value: 'documentary' },
          { title: 'Music Video', value: 'music-video' },
          { title: 'Short Film', value: 'short-film' },
          { title: 'Brand Film', value: 'brand-film' },
          { title: 'Wedding', value: 'wedding' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'e.g. Director, Cinematographer, Editor',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      description: 'Optional — leave blank to auto-fetch thumbnail from YouTube or Vimeo.',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      description: 'Full YouTube video URL, e.g. https://www.youtube.com/watch?v=XXXXX',
    }),
    defineField({
      name: 'vimeoUrl',
      title: 'Vimeo URL',
      type: 'url',
      description: 'Full Vimeo video URL, e.g. https://vimeo.com/XXXXXXX',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram Reel URL',
      type: 'url',
      description:
        'Full Instagram Reel/post URL, e.g. https://www.instagram.com/reel/XXXXX. ' +
        'Instagram cannot be embedded inline, so the card links out to Instagram — ' +
        'upload a Cover Image above for the thumbnail. Used only when no YouTube/Vimeo URL is set.',
    }),
    defineField({
      name: 'description',
      title: 'Project Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Home Page',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Newest First',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
  ],
})
