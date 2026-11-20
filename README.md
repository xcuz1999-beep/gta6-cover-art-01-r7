# Palmera Cover Studio — Vice Heat

A cover-art maker in the spirit of GTA 6's posters: drop in a photo,
arrange it across bold poster panels, grade it like a Vice City sunset,
set the coverlines, and export a glossy magazine cover as a PNG.

## What it does

- **Any photo** — add photos from your own machine (read locally, never
  uploaded) or start from the three bundled samples. Fill the panels
  with one photo cropped three ways, or a different photo per panel.
- **Six layouts** — Poster Grid, Full Bleed, Duo Split, Trio Strip,
  Newsstand (with a bottom banner) and Neon Frame.
- **Six grades** — Vice Sunset, Neon Nights, Golden Hour, Midnight
  Chrome, Clean Gloss and Mono Noir, applied live to every panel.
- **Full cover furniture** — masthead, kicker chip, three coverlines,
  a starburst sticker, an issue line and a barcode, all editable.
- **Crop control per panel** — zoom and pan sliders for the panel you
  select, so the subject always sits right.
- **One-click PNG export** at 1080 × 1080, 1080 × 1350 and 1920 × 1080.
  The live preview is drawn by the same code as the export.

## Run it

Serve `app/` with any static file server, or use the bundled preview:

```sh
node serve.ts   # then open http://localhost:8080
```

Everything is plain static files under `app/` — no build step, no
network. The display font, Palmera Display, is a renamed subset of
Noto Sans Display Condensed Black (SIL Open Font License 1.1; see
`app/fonts/OFL.txt`).

## Hand-in

`node main.ts` copies `app/` and `screenshots/` to the output directory
(`MAKEFUN_OUTPUT_DIR` or `/output`) and writes `dossier.json` with the
vendored make.fun library in `vendor/makefun-app.ts`.

Licensed under the MIT License (see `LICENSE`).
