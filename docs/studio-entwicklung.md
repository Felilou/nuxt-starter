# Für Studio entwickeln: Code so schreiben, dass Kunden ihn bearbeiten können

Diese Anleitung richtet sich an Entwickler. Sie zeigt, wie du Seiten, Komponenten und Daten so baust, dass Nuxt Studio sie erkennt und als Editor oder Formular anbietet.

Stand: `nuxt-studio` 1.8, `@nuxt/content` 3.16 (Oktober 2026). In `studio-test` ausprobiert sind die Bausteine, das Erkennen der Props, Pflichtfelder und JSDoc-Hilfetexte sowie der Komponenten-Filter `studio.editor.components`. Nicht ausprobiert sind die Collection-Schemas mit `.editor()` (Abschnitte 3 und 4). Die sind nur aus dem Code von `@nuxt/content` abgeleitet.

> ⚠️ **TypeScript muss 5.x bleiben** (`"typescript": "^5.9.3"` in `package.json`). Studio liest Props über `vue-component-meta`, und das braucht die JavaScript-API von TypeScript, die TypeScript 7 nicht mehr hat. Mit TS 7 bricht der Parser still ab (`ts.readJsonConfigFile is not a function`), und Studio zeigt **keine Felder** an. Nach einem Versionswechsel `.nuxt/component-meta.mjs` löschen, sonst bleibt das alte, leere Ergebnis im Cache.

---

## Das Prinzip in drei Sätzen

1. **Studio bearbeitet nur Dateien in `content/` und `public/`.** Was in `.vue`, `.ts` oder `app.config.ts` steht, sieht Studio nicht.
2. **Struktur und Aussehen gehören in den Code, Inhalt gehört in `content/`.** Dein Code legt fest, *wie* etwas aussieht. Der Kunde bestimmt in `content/`, *was* drinsteht.
3. **Studio baut seine Formulare aus Typen:** aus den **Props deiner Vue-Komponenten** und aus den **Zod-Schemas deiner Collections**. Je genauer die Typen, desto besser das Formular.

Daraus ergeben sich vier Werkzeuge:

| Du willst bearbeitbar machen … | Werkzeug | Studio zeigt |
|---|---|---|
| Fließtext, Überschriften, Seiten | Markdown-Datei in einer `page`-Collection | Visueller Editor (wie Word) |
| Wiederkehrende Blöcke (Hero, Team, Preise …) | Vue-Komponente in `app/components/content/` | Block im Editor + Formular für die Props |
| Zusätzliche Felder pro Seite (Titelbild, Kategorie …) | Zod-Schema auf der `page`-Collection | Formular über dem Text |
| Globale Daten (Navigation, Footer, Kontaktdaten, Team-Liste …) | `data`-Collection mit Schema (`.yml`/`.json`) | Reines Formular |

---

## Mitgelieferte Bausteine

Das Template bringt in `app/components/content/` fertige Bausteine mit. `content/index.md` zeigt alle im Einsatz. Für jeden gilt: **Der Kunde ändert Texte, Bilder und Links, Layout und Überschriften-Ebenen legst du fest.**

| Baustein | Markdown | Kunde ändert | Fest im Code |
|---|---|---|---|
| `HeroSection` | `::hero-section` | Titel, Text, Button, Bild | `<h1>` (einziges der Seite), Anordnung |
| `TextSection` | `::text-section` | Titel, Fließtext | `<h2>`, Textbreite |
| `TextImageSection` | `::text-image-section` | Titel, Text, Bild + Alt-Text | `<h2>`, Bild links, Seitenverhältnis |
| `ImageSection` | `::image-section` | Bild, Alt-Text, Bildunterschrift | volle Breite, 16:9 |
| `FeatureGrid` + `FeatureItem` | `::feature-grid` / `:::feature-item` | Titel, Karten hinzufügen, entfernen, umsortieren, Icon, Text | `<h2>` / `<h3>`, 3-Spalten-Raster |
| `CtaSection` | `::cta-section` | Titel, Text, Button | `<h2>`, Box-Design |

Warum das für SEO wichtig ist:
- **Genau ein `<h1>` pro Seite**, und zwar im Hero. Alle anderen Bausteine erzeugen `<h2>`/`<h3>`. Der Kunde schreibt im Fließtext keine `#`-Überschriften.
- **Alt-Texte sind Pflichtfelder** (`imageAlt` ist bei Bild-Bausteinen required).
- **Bilder laufen über `<NuxtImg>`** mit fester Größe und WebP. Lädt der Kunde ein 8-MB-Foto hoch, wird trotzdem eine kleine Datei ausgeliefert, und das Layout springt nicht (CLS).

Neue Bausteine nach demselben Muster bauen, siehe Abschnitt 2.

---

## 1. Seiten: Markdown in einer Page-Collection

Das ist im Template schon eingerichtet (`content.config.ts`, Collection `pages`). Jede `.md`-Datei in `content/` wird zu einer Seite, und der Catch-all `[...slug].vue` aus dem Base-Layer rendert sie.

```md
---
title: Leistungen
description: Für Google, ca. 150 Zeichen.
---

# Unsere Leistungen

Text, **fett**, [Link](/kontakt), Listen …
```

**Regeln, damit es im visuellen Editor gut aussieht:**
- Text ist **Markdown**, kein HTML. HTML-Blöcke zeigt Studio nur als Code an.
- Layout-Wrapper sparsam einsetzen. Jedes `::u-container` ist für den Kunden ein Block, in den er „hineinklicken“ muss.
- Für alles, was gestaltet ist, eine Komponente schreiben (Abschnitt 2), statt Tailwind-Klassen im Markdown zu verstreuen. Sonst kann der Kunde sie versehentlich ändern.

---

## 2. Komponenten: Blöcke, die der Kunde einfügen und ausfüllen kann

### Wo die Datei liegen muss

**`app/components/content/`**. Komponenten dort sind global registriert und können in Markdown benutzt werden. Studio liest über `nuxt-component-meta` ihre Props und Slots aus und bietet sie im Editor an (`/` → Komponente wählen).

`app/components/content/FeatureCard.vue` → im Markdown `::feature-card`

### Props werden zum Formular

```vue
<script setup lang="ts">
withDefaults(defineProps<{
  /** Überschrift der Karte */
  title: string
  /** Kurzer Text unter der Überschrift */
  description?: string
  /** Icon aus Lucide, z. B. i-lucide-rocket */
  icon?: string
  /** Bild aus der Medienbibliothek, z. B. /bilder/team.webp */
  image?: string
  /** Hervorgehobene Variante */
  highlight?: boolean
  /** Ausrichtung */
  align?: 'left' | 'center'
}>(), {
  align: 'left',
  highlight: false
})
</script>

<template>
  <UCard :class="[highlight && 'ring-2 ring-primary', align === 'center' && 'text-center']">
    <UIcon v-if="icon" :name="icon" class="size-8 text-primary" />
    <img v-if="image" :src="image" :alt="title" class="rounded-lg">
    <h3 class="text-lg font-semibold">{{ title }}</h3>
    <p v-if="description" class="text-muted">{{ description }}</p>
  </UCard>
</template>
```

Was Studio daraus macht:

| Im Code | Im Studio-Formular |
|---|---|
| `title: string` | Textfeld (Pflicht) |
| `description?: string` | Textfeld (optional) |
| `highlight?: boolean` | Schalter |
| `align?: 'left' \| 'center'` | Auswahl-Liste |
| `/** Kommentar */` über der Prop | Beschreibung/Hilfetext neben dem Feld |
| `withDefaults(...)` | Vorbelegung |

**Faustregeln für Props:**
- **Primitive Typen** (`string`, `number`, `boolean`, String-Unions) geben die besten Formulare. Verschachtelte Objekte und Arrays als Props sind für Kunden mühsam. Dafür lieber Slots oder eine Data-Collection verwenden (Abschnitt 4).
- **String-Unions statt freier Strings**, wenn es nur ein paar sinnvolle Werte gibt (`'left' | 'center'`, `'primary' | 'neutral'`). Dann kann der Kunde nichts Kaputtes eintippen.
- **JSDoc-Kommentar** an jede Prop. Das ist der Hilfetext für den Kunden, also auf Deutsch und verständlich formulieren.
- **Defaults** für alles Optionale, damit der Block auch halb ausgefüllt gut aussieht.

### Slots werden zu frei bearbeitbarem Text

Für längeren Text mit Formatierung (fett, Links, Listen) **Slots statt String-Props** benutzen. Der Inhalt eines Slots ist im Studio-Editor ganz normaler Rich Text.

```vue
<!-- app/components/content/TextImage.vue -->
<script setup lang="ts">
defineProps<{
  /** Bild aus der Medienbibliothek */
  image: string
  /** Alternativtext für das Bild (für Google und Screenreader) */
  alt: string
  /** Bild links oder rechts */
  side?: 'left' | 'right'
}>()
</script>

<template>
  <div class="grid items-center gap-8 md:grid-cols-2">
    <img :src="image" :alt="alt" class="rounded-xl" :class="side === 'right' && 'md:order-2'">
    <div>
      <h2 class="text-2xl font-bold">
        <slot name="title" mdc-unwrap="p" />
      </h2>
      <slot />
    </div>
  </div>
</template>
```

Im Markdown:

```md
::text-image{image="/bilder/werkstatt.webp" alt="Unsere Werkstatt" side="right"}
#title
Handwerk seit 1985

#default
Wir reparieren **alles**, was Räder hat.

- Schnell
- Fair
- [Termin vereinbaren](/kontakt)
::
```

- `<slot />` ist der Standard-Slot, `<slot name="title" />` ein benannter Slot (`#title` im Markdown)
- `mdc-unwrap="p"` entfernt das automatische `<p>` um einzeilige Slots. Das ist nützlich für Überschriften.

### Blöcke ineinander verschachteln

Komponenten können Kinder enthalten. Damit baust du Raster, in die der Kunde selbst Karten einfügt:

```vue
<!-- app/components/content/CardGrid.vue -->
<template>
  <div class="grid gap-6 md:grid-cols-3">
    <slot />
  </div>
</template>
```

```md
::card-grid
  :::feature-card{title="Schnell" icon="i-lucide-zap"}
  :::

  :::feature-card{title="Fair" icon="i-lucide-scale"}
  :::
::
```

Verschachtelte Komponenten bekommen einen Doppelpunkt mehr (`:::`).

### Daten in Komponenten nicht hart codieren

```vue
<!-- ❌ Kunde kann den Text nie ändern -->
<template>
  <section><h2>Unser Team</h2> ... </section>
</template>

<!-- ✅ Text kommt aus dem Markdown -->
<template>
  <section><h2><slot name="title" mdc-unwrap="p" /></h2> ... </section>
</template>
```

Jeder Text, den der Kunde je ändern wollen könnte, gehört in eine Prop, einen Slot oder eine Collection, nie direkt ins Template.

### Komponenten-Liste in Studio aufräumen

Standardmäßig bietet Studio **alle** registrierten Komponenten an, also auch Dutzende aus Nuxt UI. Für Kunden ist es übersichtlicher, nur deine Blöcke anzubieten. Das stellst du in `nuxt.config.ts` ein:

```ts
studio: {
  editor: {
    components: {
      // Pfad-Muster (enthält "/") oder Namens-Muster (z. B. 'U*')
      include: ['**/components/content/**'],
      groups: [
        { label: 'Abschnitte', include: ['**/components/content/sections/**'] },
        { label: 'Elemente', include: ['**/components/content/elements/**'] }
      ]
    }
  }
}
```

Die Muster werden mit `minimatch` geprüft. Wenn sie nicht greifen, testest du sie am schnellsten lokal im Dev-Modus.

Wenn du `include` setzt, zeigt Studio die Nuxt-UI-Komponenten (`::u-page-hero` usw.) nicht mehr im Einfüge-Menü an. Bestehende Blöcke auf den Seiten funktionieren aber weiter. Am saubersten ist es, für jeden Abschnitt eine eigene Komponente zu bauen, die intern Nuxt UI benutzt.

---

## 3. Zusätzliche Felder pro Seite: Schema auf der Page-Collection

Wenn jede Seite mehr als `title` und `description` braucht (Titelbild, Kategorie, „in Navigation anzeigen“ …), erweiterst du die Collection um ein Schema. Studio zeigt diese Felder als Formular über dem Text an.

```ts
// content.config.ts
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        image: z.string().optional().editor({ input: 'media', label: 'Titelbild' }),
        icon: z.string().optional().editor({ input: 'icon', iconLibraries: ['lucide'] }),
        intro: z.string().optional().editor({ input: 'textarea', label: 'Kurztext für Übersichten' }),
        showInNav: z.boolean().default(false).editor({ label: 'In der Navigation anzeigen' }),
        category: z.enum(['Leistung', 'Referenz', 'Sonstiges']).optional(),
        internalNote: z.string().optional().editor({ hidden: true })
      })
    })
  }
})
```

`title`, `description` und `body` haben Page-Collections automatisch. Die musst du nicht ins Schema schreiben.

**`.editor({ … })`** steuert, wie Studio ein Feld darstellt:

| Option | Wirkung |
|---|---|
| `input: 'media'` | Bild-Auswahl aus der Medienbibliothek statt Textfeld |
| `input: 'icon'` | Icon-Auswahl (mit `iconLibraries: ['lucide']`) |
| `input: 'textarea'` | Mehrzeiliges Textfeld |
| `label` | Feldname im Formular (Deutsch, für den Kunden) |
| `description` / `tooltip` | Hilfetext |
| `hidden: true` | Feld nicht im Formular anzeigen |

Wie Zod-Typen im Formular erscheinen:

| Zod | Formular |
|---|---|
| `z.string()` | Textfeld |
| `z.number()` | Zahlenfeld |
| `z.boolean()` | Schalter |
| `z.enum([...])` | Auswahl-Liste |
| `z.date()` | Datumsauswahl |
| `z.array(z.object({...}))` | Liste mit „Eintrag hinzufügen“ |
| `.optional()` / `.default(x)` | kein Pflichtfeld / Vorbelegung |

Benutzen kannst du die Felder überall, wo du die Seite abfragst:

```ts
const { data: services } = await useAsyncData('services', () =>
  queryCollection('pages').where('category', '=', 'Leistung').all()
)
// services.value[0].image, .intro, .icon …
```

Wenn die Seite die eigentliche Seite rendert und dabei ein Feld wie `image` anzeigen soll, musst du die Seiten-Komponente des Base-Layers überschreiben: Datei `app/pages/[...slug].vue` im Projekt anlegen, gleicher Pfad wie im Layer.

---

## 4. Globale Daten: Data-Collections

Alles, was **nicht zu einer Seite gehört** (Navigation, Footer, Kontaktdaten, Öffnungszeiten, Team-Liste, Referenzen …), kommt in eine **Data-Collection**: eine `.yml`- oder `.json`-Datei mit Schema. Studio zeigt sie als **reines Formular** an, ohne Markdown.

### Eine einzelne Datei (z. B. Einstellungen)

```ts
// content.config.ts
const link = z.object({
  label: z.string().editor({ label: 'Text' }),
  to: z.string().editor({ label: 'Ziel (z. B. /kontakt)' })
})

settings: defineCollection({
  type: 'data',
  source: 'settings.yml',
  schema: z.object({
    navigation: z.array(link).editor({ label: 'Hauptmenü' }),
    footerLinks: z.array(link).editor({ label: 'Footer-Links' }),
    phone: z.string().optional().editor({ label: 'Telefon' }),
    email: z.string().email().optional().editor({ label: 'E-Mail' }),
    address: z.string().optional().editor({ input: 'textarea', label: 'Adresse' }),
    logo: z.string().optional().editor({ input: 'media', label: 'Logo' })
  })
})
```

```yaml
# content/settings.yml
navigation:
  - label: Start
    to: /
footerLinks:
  - label: Impressum
    to: /impressum
phone: +43 1 234 56 78
```

```vue
<script setup lang="ts">
const { data: settings } = await useAsyncData('settings', () =>
  queryCollection('settings').first()
)
</script>

<template>
  <UNavigationMenu :items="settings?.navigation" />
</template>
```

**Navigation und Footer** stehen im Base-Layer in `app.config.ts` und das Layout liest sie von dort. Damit der Kunde sie bearbeiten kann, legst du im Projekt `app/layouts/default.vue` an (überschreibt das Layout des Layers) und liest dort aus `settings` statt aus `useAppConfig()`. Die Vorlage dafür ist das Layout in `nuxt-base/app/layouts/default.vue`, in dem du nur die Datenquelle tauschst.

### Viele gleichartige Einträge (z. B. Team, Referenzen)

Eine Datei pro Eintrag in einem Ordner. Der Kunde kann in Studio dann Einträge anlegen und löschen wie Seiten.

```ts
team: defineCollection({
  type: 'data',
  source: 'team/*.yml',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    photo: z.string().editor({ input: 'media' }),
    order: z.number().default(0).editor({ label: 'Reihenfolge' })
  })
})
```

```
content/team/anna.yml
content/team/markus.yml
```

```ts
const { data: team } = await useAsyncData('team', () =>
  queryCollection('team').order('order', 'ASC').all()
)
```

Aus der Liste machst du eine Komponente `app/components/content/TeamList.vue`, die diese Abfrage enthält. Der Kunde setzt dann `::team-list` auf eine beliebige Seite und pflegt die Personen in `content/team/`.

Wichtig: Die `pages`-Collection hat `source: '**/*.md'`. `.yml`-Dateien landen also nicht versehentlich als Seite dort. Wenn du einen Ordner mit `.md`-Dateien als eigene Collection willst (z. B. Blog), musst du ihn in `pages` mit `exclude` ausnehmen:

```ts
pages: defineCollection({
  type: 'page',
  source: { include: '**/*.md', exclude: ['blog/**'] }
}),
blog: defineCollection({
  type: 'page',
  source: 'blog/**/*.md',
  schema: z.object({ date: z.date(), image: z.string().editor({ input: 'media' }) })
})
```

---

## 5. Bilder

- Immer als **String-Pfad** speichern (`/bilder/foto.webp`), relativ zu `public/`
- In Schemas `.editor({ input: 'media' })` setzen, dann bekommt der Kunde die Bild-Auswahl statt eines Textfelds
- In Komponenten-Props einen JSDoc-Hinweis wie „Bild aus der Medienbibliothek“ hinzufügen
- Für Größen-Optimierung `<NuxtImg>` statt `<img>` verwenden (`@nuxt/image` ist im Base-Layer):
  ```vue
  <NuxtImg :src="image" :alt="alt" width="800" format="webp" loading="lazy" />
  ```
- Immer ein **Alt-Text-Feld** neben dem Bild anbieten (Prop oder Schema-Feld). Sonst gibt es keinen Alt-Text, und das schadet Barrierefreiheit und SEO.

---

## 6. Live-Vorschau: Daten nur über `queryCollection` holen

Studio zeigt Änderungen schon **vor** dem Veröffentlichen live auf der Seite an. Dafür tauscht es die Content-Datenbank im Browser aus. Das funktioniert nur, wenn deine Komponenten die Daten über `queryCollection` holen.

```ts
// ✅ Live-Vorschau funktioniert
const { data } = await useAsyncData('settings', () => queryCollection('settings').first())

// ❌ Wird zur Build-Zeit eingebacken, Studio-Änderungen erscheinen erst nach dem Deploy
import settings from '~/content/settings.json'
```

Außerdem jedem `useAsyncData` einen **eindeutigen Schlüssel** geben (`'settings'`, `` `page-${route.path}` ``), sonst teilen sich verschiedene Abfragen den Cache.

---

## 7. Was bewusst im Code bleibt

| Bleibt im Code | Warum |
|---|---|
| Farben, Schriften, Abstände (`app.config.ts`, CSS) | Design soll konsistent bleiben |
| `nuxt.config.ts`, `site.url` | Technisch, Fehler schaden SEO und Betrieb |
| Aufbau der Komponenten | Der Kunde *benutzt* Blöcke, er baut keine |
| Formulare, Integrationen, Logik | Kein Inhalt |

Faustregel: **Wenn der Kunde dich wegen einer Änderung anrufen müsste, gehört sie in `content/`. Wenn eine Änderung das Design kaputt machen kann, gehört sie in den Code.**

---

## Checkliste für eine neue Komponente

- [ ] Liegt in `app/components/content/` (ggf. Unterordner für Studio-Gruppen)
- [ ] Alle Texte kommen aus Props oder Slots, nichts hart codiert
- [ ] Props mit klaren Typen, String-Unions statt freier Strings, wo möglich
- [ ] JSDoc-Kommentar auf Deutsch an jeder Prop
- [ ] Defaults für optionale Props
- [ ] Bilder als Pfad-String plus Alt-Text-Prop
- [ ] Sieht auch mit nur den Pflichtfeldern gut aus
- [ ] Daten aus Collections über `queryCollection` mit eindeutigem Schlüssel
- [ ] Lokal im Dev-Modus in Studio eingefügt und ausgefüllt
