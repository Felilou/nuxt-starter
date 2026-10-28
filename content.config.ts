import { defineCollection, defineContentConfig } from '@nuxt/content'

// Required by the nuxt-base layer: its catch-all page renders the "pages" collection.
export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: '**/*.md'
    })
  }
})
