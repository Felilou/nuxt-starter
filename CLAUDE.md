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

- Pages are Markdown in `content/`, built with Nuxt UI components in MDC syntax (`::u-page-hero`). `content.config.ts` must keep the `pages` collection, because the layer's `[...slug].vue` queries it.
- Customize through `app/app.config.ts` (`ui.colors`, `navigation`, `footerLinks`) and `site` in `nuxt.config.ts`. To override a layer file (component, layout, page), create a file at the same path.
- Don't change `/health.json`. The central monitoring tool reads it.
