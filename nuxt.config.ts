// Layout, SEO, CMS and the /health.json monitoring endpoint come from the base layer.
// Bump the tag deliberately to pull in base updates.
export default defineNuxtConfig({
  extends: ['github:Felilou/nuxt-base#v0.2.0'],

  site: {
    url: 'https://example.com',
    name: 'Beispiel GmbH'
  }
})
