# Portfolio — Taha Alsheikh Taha

Personal portfolio for a .NET backend developer.
**Live:** https://ttse17.github.io/Portfolio/

A single static page with no build step, no framework and no runtime
dependencies — plain HTML, CSS and JavaScript. Open `index.html` and it works.

---

## Structure

```
index.html                 The whole page — content lives here, not in JS
css/styles.css             Design tokens + all styling
Js/app.js                  Progressive enhancement only (see below)
imgs/                      WebP screenshots + the social preview image
assets/                    CV (PDF)
favicon.svg
robots.txt, sitemap.xml
```

Content is written directly in `index.html` rather than rendered from a JS
array. That is deliberate: crawlers, link previews and readers with JavaScript
disabled all get the full page. `Js/app.js` only *enhances* — theme switching,
project filtering, scroll-spy, reveal animations. Turn JavaScript off and every
project, link and section is still there.

---

## Running it locally

Any static server works:

```bash
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then open <http://localhost:8000>. Opening `index.html` straight from the file
system also works — nothing here needs a server.

## Deploying

The repo is served by GitHub Pages from the default branch. Push to `main` and
the site updates. Paths are relative, so it also works from a subfolder.

---

## Making changes

### Add a project

Copy any `<article class="project">` block inside `#projects-grid` and edit it.
Two things matter:

- `data-type="web"` or `data-type="desktop"` — this drives the filter buttons.
  The counts in those buttons are recalculated at runtime, so nothing else needs
  updating.
- Give the `<img>` real `width` / `height` attributes matching the file. They
  reserve space before the image loads and stop the layout from jumping.

If a project has no screenshot, use the poster block instead of an `<img>`:

```html
<div class="project__poster">
  <svg class="icon" aria-hidden="true"><use href="#i-graduation" /></svg>
</div>
```

Icons live in the inline `<svg>` sprite at the top of `<body>`. Add a new
`<symbol id="i-...">` there and reference it with `<use href="#i-...">`.

### Change the colours

Everything comes from custom properties in the `:root` block of
`css/styles.css`. `--accent` is the brand blue; the light theme overrides sit in
`:root[data-theme="light"]`. Changing `--accent` recolours buttons, links,
focus rings, icon tiles and the hero glow in one edit.

### Turn the hero badge into an availability badge

The dot next to "Backend Developer · Damascus, Syria" is currently brand blue —
purely decorative. To make it read as *available for work*, change the badge
text in `index.html` and set the dot to green in `css/styles.css`:

```css
.hero__status .dot {
  --dot: #22c55e;
}
```

### Update the CV

Replace `assets/Taha-Alsheikh-Taha-CV.pdf`. The Download CV button points at
that exact filename.

---

## What the page does for you

**Accessibility**

- Semantic landmarks (`header` / `nav` / `main` / `section` / `footer`), one
  `<h1>`, headings in order
- Skip-to-content link
- Real `<button>` elements for the filters and menu, with `aria-pressed` /
  `aria-expanded` that actually reflect state
- A live region announces the result count when a filter changes
- Visible `:focus-visible` rings throughout; menu closes on Escape
- Every image has descriptive alt text
- All motion is disabled under `prefers-reduced-motion`

**Performance**

- Zero external requests — no CDN, no webfont, no icon font
- Screenshots are WebP, resized to their display width (9.6 MB → 0.67 MB)
- Below-the-fold images are lazy-loaded with dimensions reserved
- One `scroll` listener, throttled with `requestAnimationFrame`
- Theme is applied before first paint, so there is no flash of the wrong colours

**SEO / sharing**

- Description, canonical URL, Open Graph and Twitter card tags
- A generated 1200×630 preview image (`imgs/og-image.png`)
- `Person` JSON-LD structured data
- `robots.txt` and `sitemap.xml`

**Other**

- Dark and light themes, defaulting to the visitor's system preference and
  remembered in `localStorage` (wrapped in `try/catch`, so blocked storage
  degrades quietly)
- Print stylesheet — the page prints as a readable document with link URLs
  expanded

---

## Browser support

Modern evergreen browsers. Uses CSS Grid, custom properties, `clamp()`,
`color-mix()`, `aspect-ratio` and `IntersectionObserver`. Older browsers get an
unstyled-but-readable fallback rather than a broken layout.
