# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A client website (or the template for one) built on the Nuxt layer `github:Felilou/nuxt-base`. The tag in `nuxt.config.ts` pins the layer version. Most behavior lives in the layer: layout, the catch-all content page, SEO setup and `/health.json`. Read its source in `node_modules/.c12/` after `npm install`, or on GitHub.

## Commands

- `npm run dev`: dev server
- `npm run generate`: static build into `.output/public/` (default for sites without Studio)
- `npm run build`: SSR/hybrid build. Required when the optional Studio layer is used.

There is no linter or test setup.

## Project specifics

- Pages are Markdown in `content/`, built from the blocks in `app/components/content/` in MDC syntax (`::hero-section`, `::text-section`, …). `content.config.ts` must keep the `pages` collection, because the layer's `[...slug].vue` queries it.
- Blocks split content from layout: clients edit props and slots (text, images, links) in Studio, while layout and heading levels stay fixed in code for SEO. `HeroSection` renders the page's only `<h1>`, and other blocks render `<h2>`/`<h3>`. Image blocks require `imageAlt` and use `<NuxtImg>` with fixed sizes. Follow this pattern for new blocks, and give props German JSDoc, because Studio shows them to clients. See `docs/studio-entwicklung.md`.
- Customize through `app/app.config.ts` (`ui.colors`, `navigation`, `footerLinks`) and `site` in `nuxt.config.ts`. To override a layer file (component, layout, page), create a file at the same path.
- `typescript` is 7.x on purpose. Trade-off: TypeScript 7 lacks the JS API that `vue-component-meta` needs, so Studio shows no prop fields for the blocks, only slots and code mode. TS 5.9 fixes that, but adds about 30 s to dev startup, which the user rejected. After changing it, delete `.nuxt/component-meta.mjs` (cached result).
- Don't change `/health.json`. The central monitoring tool reads it.
