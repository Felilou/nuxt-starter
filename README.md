# nuxt-starter

Vorlage für Kunden-Websites auf Basis von [nuxt-base](https://github.com/Felilou/nuxt-base).

## Neues Kundenprojekt

1. Auf GitHub „Use this template“ → Repo `kunde-xyz-website` anlegen, klonen, `npm install`.
2. `nuxt.config.ts`: `site.url` und `site.name` setzen.
3. `app/app.config.ts`: Farben (`ui.colors`) und Navigation anpassen.
4. Inhalte in `content/` als Markdown anlegen. Impressum und Datenschutz ausfüllen!
5. Repo mit dem Hoster verbinden (Netlify, Vercel, Cloudflare Pages, ...):
   - **Ohne Studio:** Build-Befehl `npm run generate`, Ausgabeordner `.output/public`
   - **Mit Studio:** siehe [nuxt-base README](https://github.com/Felilou/nuxt-base#optional-nuxt-studio-f%C3%BCr-kunden-die-selbst-editieren). Build mit `npm run build`.
6. Prüfen: `https://<domain>/health.json` muss erreichbar sein (für das Monitoring).

## Befehle

- `npm run dev`: Dev-Server auf http://localhost:3000
- `npm run generate`: statischer Build
- `npm run build`: SSR/Hybrid-Build

## Basis aktualisieren

Den Tag in `nuxt.config.ts` hochsetzen (z. B. `#v0.1.0` → `#v0.2.0`), dann `npm run dev` und prüfen.
