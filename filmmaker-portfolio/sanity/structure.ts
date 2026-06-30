import type { StructureResolver } from 'sanity/structure'

// Category folders for the Services (project) list. Titles mirror the /services
// page filters; values must match the `category` field options in
// sanity/schemaTypes/project.ts. This is purely a Studio navigation grouping —
// it does not change any document data or the category field itself.
const CATEGORIES: { title: string; value: string }[] = [
  { title: 'Wedding', value: 'wedding' },
  { title: 'Events', value: 'commercial' },
  { title: 'Business Videos', value: 'documentary' },
  { title: 'Music Video', value: 'music-video' },
  { title: 'Concerts', value: 'concerts' },
  { title: 'Short Film', value: 'short-film' },
  { title: 'Short Form Content', value: 'brand-film' },
]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings')
        ),
      S.divider(),
      S.documentTypeListItem('page').title('Pages'),
      S.listItem()
        .title('Services')
        .child(
          S.list()
            .title('Services by Category')
            .items([
              ...CATEGORIES.map(({ title, value }) =>
                S.listItem()
                  .id(value)
                  .title(title)
                  .child(
                    S.documentList()
                      .title(title)
                      .schemaType('project')
                      .filter('_type == "project" && category == $category')
                      .params({ category: value })
                      .defaultOrdering([{ field: 'order', direction: 'asc' }])
                  )
              ),
              S.divider(),
              // Catch-all so projects with no category set are never hidden.
              S.listItem()
                .id('uncategorized')
                .title('Uncategorized')
                .child(
                  S.documentList()
                    .title('Uncategorized')
                    .schemaType('project')
                    .filter('_type == "project" && !defined(category)')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
              S.divider(),
              // Flat view of every project, regardless of category.
              S.listItem()
                .id('all')
                .title('All Services')
                .child(
                  S.documentList()
                    .title('All Services')
                    .schemaType('project')
                    .filter('_type == "project"')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
            ])
        ),
    ])
