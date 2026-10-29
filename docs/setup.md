# Setup: von null zur fertigen Kunden-Website

Diese Anleitung führt von einem leeren Rechner zu einer gehosteten Website mit eigener Domain und SEO. Es gibt zwei Varianten:

- **Ohne Studio:** Nur du pflegst die Inhalte (Markdown im Repo). Rein statisch, einfach und günstig, läuft bei jedem Hoster.
- **Mit Studio:** Der Kunde bearbeitet die Inhalte selbst im Browser (`/_studio`). Braucht einen Hoster mit Serverless-Funktionen (hier: Netlify).

Die Schritte 1–4 sind für beide Varianten gleich.

---

## 1. Voraussetzungen (einmalig)

- **Node.js** in Version 22.22+, 24.15+ oder 26+ ([nodejs.org](https://nodejs.org)). Prüfen mit `node -v`.
- **Git** ([git-scm.com](https://git-scm.com))
- Konten bei **GitHub** und **Netlify** (Netlify-Login am einfachsten über GitHub)
- Unter Windows einmalig in PowerShell, sonst blockiert PowerShell `npm`:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
  ```

## 2. Projekt anlegen

1. Auf GitHub bei [Felilou/nuxt-starter](https://github.com/Felilou/nuxt-starter) **„Use this template“ → „Create a new repository“** wählen.
   - Name: z. B. `kunde-xyz-website`
   - Sichtbarkeit: **Private**
2. Klonen und installieren:
   ```bash
   git clone https://github.com/Felilou/kunde-xyz-website.git
   cd kunde-xyz-website
   npm install
   ```
3. Lokal starten: `npm run dev` → http://localhost:3000. Stoppen mit `Ctrl + C`.

## 3. Grundkonfiguration

**`nuxt.config.ts`**: Domain und Firmenname. Beide sind wichtig für SEO, denn daraus entstehen Sitemap, Canonical-URLs und Seitentitel.

```ts
export default defineNuxtConfig({
  extends: ['github:Felilou/nuxt-base#v0.2.0'],
  site: {
    url: 'https://kunde-xyz.at', // die spätere echte Domain, ohne Slash am Ende
    name: 'Kunde XYZ GmbH'
  }
})
```

**`app/app.config.ts`**: Farben, Navigation, Footer-Links.

```ts
export default defineAppConfig({
  ui: {
    colors: { primary: 'emerald', neutral: 'zinc' } // Tailwind-Farbnamen
  },
  navigation: [
    { label: 'Start', to: '/' },
    { label: 'Leistungen', to: '/leistungen' },
    { label: 'Kontakt', to: '/kontakt' }
  ]
  // footerLinks (Impressum, Datenschutz) kommen aus dem Base-Layer und können hier überschrieben werden
})
```

**`public/`**: Favicon (`favicon.ico`) und Bilder ablegen.

## 4. Inhalte

Jede Datei in `content/` ist eine Seite. Aus dem Pfad wird die URL:

| Datei | URL |
|---|---|
| `content/index.md` | `/` |
| `content/leistungen.md` | `/leistungen` |
| `content/blog/erster-beitrag.md` | `/blog/erster-beitrag` |

Jede Seite beginnt mit Frontmatter. `title` und `description` landen als Seitentitel und Meta-Description bei Google:

```md
---
title: Leistungen
description: Was die Kunde XYZ GmbH anbietet – kurz und für Google formuliert (ca. 150 Zeichen).
---

::u-container{.py-12}
# Unsere Leistungen

Normaler Markdown-Text, **fett**, [Links](/kontakt), Listen …

![Teamfoto](/bilder/team.webp)
::
```

Layout-Bausteine kommen aus [Nuxt UI](https://ui.nuxt.com/components) und werden mit `::komponenten-name` eingebunden, z. B. `::u-page-hero`, `::u-page-section`, `::u-page-cta`. Beispiele stehen in `content/index.md`.

> ⚠️ **Impressum und Datenschutz** (`content/impressum.md`, `content/datenschutz.md`) vor dem Livegang ausfüllen. Die Seiten sind Pflicht.

Fertig? Committen und pushen:

```bash
git add -A
git commit -m "Inhalte und Konfiguration"
git push
```

---

## 5a. Hosting **ohne Studio** (statisch)

1. [app.netlify.com](https://app.netlify.com) → **Add new project → Import an existing project → GitHub** → Repo auswählen
2. Build-Einstellungen:
   - **Build command:** `npm run generate`
   - **Publish directory:** den Vorschlag von Netlify übernehmen (bei anderen Hostern `.output/public`)
3. **Deploy**. Nach 1–3 Minuten läuft die Seite unter `https://<name>.netlify.app`.

Ab jetzt löst jeder `git push` auf `main` automatisch einen neuen Build aus.

Andere Hoster (Cloudflare Pages, Vercel, GitHub Pages, klassischer Webspace) funktionieren genauso: `npm run generate` und den Inhalt von `.output/public` hochladen.

## 5b. Hosting **mit Studio**

### Projekt vorbereiten

```bash
npm install nuxt-studio
```

In `nuxt.config.ts` den Studio-Layer ergänzen:

```ts
extends: ['github:Felilou/nuxt-base#v0.2.0', 'github:Felilou/nuxt-base/studio#v0.2.0'],
```

Mehr ist nicht nötig. Der Studio-Layer sorgt dafür, dass der Kunde nur die Bausteine aus `app/components/content/` einfügen kann und nicht die Nuxt-UI-Komponenten, mit denen er das Layout umbauen könnte. Ein Klick auf einen Baustein öffnet ein Formular mit allen Feldern und Hilfetexten. Der Layer analysiert außerdem nur diese Bausteine, das hält den Dev-Start schnell.

**`typescript` muss auf 5.x bleiben** (ist im Template so eingestellt). Mit TypeScript 7 zeigt Studio keine Formularfelder an, siehe [studio-entwicklung.md](studio-entwicklung.md).

Lokal testen: `npm run dev`, dann unten links auf den Studio-Button klicken oder `Ctrl + .` drücken. Änderungen landen direkt in `content/` bzw. `public/`. Danach committen und pushen.

### Netlify-Projekt anlegen

1. Wie in 5a, aber mit **Build command: `npm run build`** (nicht `generate`!)
2. Deployen. `/_studio` gibt bis zum nächsten Schritt einen Fehler 500, das ist erwartet.
3. Unter **Project configuration → Change project name** einen sinnvollen Namen vergeben, **bevor** du die OAuth-Zugänge anlegst, denn die URL steckt darin.

### Google-Login einrichten (Kunde braucht kein GitHub-Konto)

**Google OAuth Client** ([console.cloud.google.com](https://console.cloud.google.com)):

1. Neues Projekt anlegen (z. B. `kunde-xyz-studio`)
2. **OAuth consent screen / Google Auth Platform**: User type **External**, App-Name und Support-Mail eintragen
   - Solange die App im Modus **„Testing“** ist, kommen nur eingetragene **Test users** rein (max. 100). Entweder die Kunden-Adressen dort eintragen oder die App auf **„In production“** stellen. Weil Studio nur E-Mail und Profil abfragt, ist keine Google-Prüfung nötig.
3. **Credentials → Create credentials → OAuth client ID** → Typ **Web application**
   - **Authorized redirect URIs:** `https://<name>.netlify.app/__nuxt_studio/auth/google`. Sobald die eigene Domain läuft, auch `https://kunde-xyz.at/__nuxt_studio/auth/google` (siehe Schritt 6).
4. Client ID und Client Secret kopieren

**GitHub Fine-grained PAT** (GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token):

- **Name:** `kunde-xyz-website Netlify`
- **Expiration:** 1 Jahr (in den Kalender eintragen, siehe [Abschnitt 9](#9-betrieb-mit-studio-tokens-und-sitzungen))
- **Repository access:** *Only select repositories* → **nur** das Repo dieses Kunden
- **Repository permissions → Contents: Read and write**, sonst nichts

> Pro Kunde **ein eigener** Token. Der Token ist für eingeloggte Nutzer im Browser sichtbar, deshalb darf er nur das eine Repo betreffen.

**Env-Variablen in Netlify** (Project configuration → Environment variables):

| Variable | Wert |
|---|---|
| `NUXT_STUDIO_AUTH_GOOGLE_CLIENT_ID` | Client ID |
| `NUXT_STUDIO_AUTH_GOOGLE_CLIENT_SECRET` | Client Secret (als *secret* markieren) |
| `NUXT_STUDIO_AUTH_GOOGLE_MODERATORS` | `kunde@firma.at,du@gmail.com`: **ohne Leerzeichen**, exakte Schreibweise |
| `NUXT_STUDIO_GIT_GITHUB_TOKEN` | der PAT (als *secret* markieren) |

Dann **Deploys → Trigger deploy**. Env-Variablen greifen erst mit dem nächsten Build.

**Testen:** `https://<name>.netlify.app/_studio` → mit Google einloggen → Text ändern → **Publish**. Auf GitHub erscheint ein Commit mit `content:`, Netlify baut neu, nach 1–3 Minuten ist die Änderung live.

> Nie den GitHub-Login (`NUXT_STUDIO_AUTH_GITHUB_*`) für Kunden einrichten. Dabei landet das persönliche GitHub-Token des Nutzers mit Zugriff auf alle Repos im Browser.

---

## 6. Eigene Domain (DNS)

In Netlify: **Domain management → Add a domain** → `kunde-xyz.at` eingeben. Netlify schlägt automatisch auch `www.kunde-xyz.at` vor.

Dann gibt es zwei Wege:

### Variante A: DNS beim bisherigen Anbieter lassen (empfohlen, wenn dort auch E-Mail läuft)

Beim Domain-Anbieter (World4You, easyname, IONOS, Hetzner, …) im DNS-Bereich eintragen:

| Typ | Name / Host | Wert |
|---|---|---|
| `A` | `@` (bzw. leer) | `75.2.60.5` |
| `CNAME` | `www` | `<name>.netlify.app` |

- Bestehende `A`-/`AAAA`-Einträge für `@` und `www` (z. B. vom alten Webspace) **löschen**, sonst landen Besucher teils auf der alten Seite.
- **`MX`-Einträge (E-Mail) nicht anfassen!**
- Die IP `75.2.60.5` ist Netlifys Load Balancer. Sie steht auch in Netlify unter *Domain management → DNS configuration*, falls sie sich einmal ändert.

### Variante B: Netlify DNS

Netlify zeigt vier Nameserver an (`dns1.p0x.nsone.net` …). Diese beim Domain-Anbieter als Nameserver eintragen. Dann verwaltet Netlify alle DNS-Einträge. **Vorher** bestehende `MX`- und `TXT`-Einträge (E-Mail, SPF, DKIM, Google-Verifizierung) in Netlify nachtragen, sonst fällt die E-Mail aus.

### Danach

- DNS-Änderungen brauchen meist Minuten, im Extremfall bis zu 48 Stunden. Prüfen: [dnschecker.org](https://dnschecker.org)
- **HTTPS** richtet Netlify automatisch ein (Let's Encrypt), sobald der DNS stimmt: *Domain management → HTTPS*
- Unter *Domain management* die **Primary domain** festlegen (z. B. ohne `www`). Die andere leitet dann automatisch dorthin weiter.
- **Mit Studio:** Im Google OAuth Client die Redirect-URI `https://kunde-xyz.at/__nuxt_studio/auth/google` **ergänzen**. Ab jetzt `https://kunde-xyz.at/_studio` benutzen.
- Prüfen, ob `site.url` in `nuxt.config.ts` die echte Domain ist. Wenn nicht: ändern und pushen.

---

## 7. SEO

Der Base-Layer bringt [Nuxt SEO](https://nuxtseo.com) mit. Von selbst passiert:

- `/sitemap.xml` mit allen Seiten
- `/robots.txt`
- Canonical-URLs, `lang="de"`, Basis-Meta-Tags
- Seitentitel und Description aus dem Frontmatter jeder Seite
- Vorgerendertes HTML, d. h. Google sieht den vollen Text ohne JavaScript

**Was du pro Projekt tun musst:**

1. **`site.url` und `site.name`** korrekt setzen (siehe Schritt 3). Ist `site.url` falsch, zeigen Sitemap und Canonicals auf die falsche Domain.
2. **Jede Seite** bekommt ein aussagekräftiges `title` (≤ 60 Zeichen) und eine `description` (ca. 120–160 Zeichen).
3. **Eine `#`-Überschrift (H1) pro Seite**, darunter `##`/`###` in sinnvoller Reihenfolge.
4. **Alt-Texte** für alle Bilder: `![Was ist zu sehen](/bild.webp)`.
5. **Bilder** als WebP/AVIF und nicht größer als nötig (unter 300 KB pro Bild ist ein gutes Ziel).
6. **Google Search Console** ([search.google.com/search-console](https://search.google.com/search-console)):
   - Property vom Typ **Domain** anlegen → Google zeigt einen `TXT`-Eintrag → beim DNS-Anbieter (bzw. in Netlify DNS) eintragen → bestätigen
   - **Sitemaps** → `https://kunde-xyz.at/sitemap.xml` einreichen
   - Nach ein paar Tagen unter *Seiten* prüfen, ob alles indexiert wird
7. Optional: **Google Unternehmensprofil** (Google Maps) für lokale Firmen. Bringt oft mehr als alles andere.

OG-Bilder (Vorschaubilder für Social Media) sind im Base-Layer derzeit ausgeschaltet.

---

## 8. Checkliste vor dem Livegang

- [ ] `site.url` = echte Domain, `site.name` = Firmenname
- [ ] Impressum und Datenschutz ausgefüllt
- [ ] Jede Seite hat `title` und `description`
- [ ] Alle Bilder haben Alt-Texte
- [ ] Domain läuft mit HTTPS, `www` und ohne `www` landen auf derselben Adresse
- [ ] `https://kunde-xyz.at/sitemap.xml` und `/robots.txt` sind erreichbar und enthalten die echte Domain
- [ ] `https://kunde-xyz.at/health.json` antwortet (Monitoring)
- [ ] Seitenquelltext (Rechtsklick → *Seitenquelltext anzeigen*) enthält den Seitentext
- [ ] Search Console eingerichtet, Sitemap eingereicht
- [ ] **Mit Studio:** Kunde kann sich einloggen und veröffentlichen, eine fremde Google-Adresse wird abgelehnt
- [ ] **Mit Studio:** Ablaufdatum des PAT im Kalender eingetragen

---

## 9. Betrieb mit Studio: Tokens und Sitzungen

Wie du Seiten und Komponenten im Code so baust, dass Studio sie bearbeiten kann, steht in [studio-entwicklung.md](studio-entwicklung.md).

| Zugang | Läuft ab? | Folge |
|---|---|---|
| GitHub PAT (`NUXT_STUDIO_GIT_GITHUB_TOKEN`) | Ja, zum gewählten Datum | Login geht, **Veröffentlichen schlägt fehl** |
| Google Client Secret | Nein | – |
| Studio-Sitzung (Cookie) | **Nein**, nur beim Schließen des Browsers | Kunde bleibt eingeloggt, bis er „Sign out“ klickt |
| Moderatorenliste | – | Wird nur beim Login geprüft |

**Sicherheit:** Studio schickt den PAT an den Browser, denn die Commits macht der Browser direkt über die GitHub-API. Jeder Eingeloggte kann ihn in den Entwicklertools auslesen. Deshalb: ein PAT pro Kunde, nur das eine Repo, nur *Contents*, immer mit Ablaufdatum. Nie den GitHub-Login für Kunden.

**PAT erneuern (jährlich):** GitHub → Fine-grained tokens → Token → **Regenerate token** → neuen Wert in Netlify eintragen → **Trigger deploy**. Alle Kunden müssen sich danach neu einloggen.

**Neuer Nutzer:** E-Mail an `NUXT_STUDIO_AUTH_GOOGLE_MODERATORS` anhängen (ohne Leerzeichen). Bei Google-App im Modus „Testing“ auch als Test user eintragen. Dann **Trigger deploy**.

**Nutzer entfernen / Notfall:** E-Mail aus der Moderatorenliste löschen **und** den PAT auf GitHub widerrufen und durch einen neuen ersetzen, dann **Trigger deploy**. Der Sitzungs-Schlüssel wird aus allen Zugangsdaten abgeleitet, deshalb macht ein neuer PAT alle bestehenden Logins ungültig. Nur die E-Mail zu entfernen reicht nicht.

**Kunde hat etwas kaputt gemacht:** Jeder Publish ist ein Git-Commit (`content: …`). Alten Stand auf GitHub in der Commit-Historie ansehen oder lokal mit `git checkout <commit> -- content/datei.md` zurückholen. Für sofortige Abhilfe in Netlify unter *Deploys* einen älteren Deploy → **Publish deploy**.
