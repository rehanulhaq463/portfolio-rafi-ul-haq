# Rafiul Haq — Consulting Website

A static, dependency-free website (HTML + CSS + vanilla JS). No build step, no npm packages.

## Structure

```
index.html                 All content and section markup (semantic, SEO + Open Graph + JSON-LD)
assets/css/styles.css      Design tokens (:root), layout and components
assets/js/main.js          Header state, mobile menu, scroll reveals, project case-note dialogs,
                           generated landscape "plates", contact form
assets/img/                Field portrait (from the supplied CV), OG share image
assets/favicon.svg         Favicon
assets/Rafiul_Haq_Resume.pdf   Downloadable CV linked from About and Experience
```

## Run locally

Any static server works:

```bash
cd site
python3 -m http.server 8000      # then open http://localhost:8000
# or: npx serve .
```

## Deploy

Upload the folder as-is to Netlify (drag-and-drop), Vercel, Cloudflare Pages, GitHub Pages or any web host. No build command; publish directory is the folder root.

After choosing a domain, replace `https://www.example.com/` in the `canonical` and `og:url` tags in `index.html`, and make `og:image` an absolute URL (e.g. `https://yourdomain.com/assets/img/og-image.jpg`) so social previews work.

## Contact form

- **Default (no setup):** submitting validates the fields, then opens the visitor's email app with a pre-filled message to rafiulhaq@gmail.com. The page says plainly that nothing is sent until the visitor presses send.
- **Direct submission (optional):** create a form endpoint (e.g. Formspree, Basin, Getform) and put its URL in `data-endpoint=""` on the `<form>` in `index.html`. The script then POSTs JSON and shows "delivered" only after a successful 2xx response; on failure it shows the email address instead.

## Editing content

- Text lives directly in `index.html`, section by section (comments mark each one).
- Project "Case notes" / "Assignments" pop-ups come from the `<template id="tpl-…">` blocks next to each project; the button's `data-open` value matches the template id.
- Project visuals are generated SVG plates. Set `data-motif` (`delta`, `mangrove`, `contour`, `rows`, `wind`, `juniper`) and `data-tone` (`forest`, `sea`, `sage`, `sand`, `stone`). To use a real photograph instead, replace the `<div class="plate" …>` with an `<img>` inside a `<div class="plate">` and give the image `style="width:100%;height:100%;object-fit:cover"`.
- Colours and type are set as tokens at the top of `styles.css`.

## Accessibility & performance

Skip link, landmarks, keyboard-operable menu (Esc closes) and dialogs, visible focus, `prefers-reduced-motion` respected, content fully visible without JavaScript. Images are WebP with JPEG fallback and responsive `srcset`; total page weight is roughly 300 KB plus fonts.
