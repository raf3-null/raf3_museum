# raf3 museum

A monochrome 3D display cabinet for a personal gaming gear collection. CSS 3D geometry provides cabinet walls, shelves, and plinths; all 10 products use credited photographs. Includes pointer parallax, a motion toggle, category filters, an accessible inspection dialog, and a list view.

## Preview locally

No dependencies or build step required. From the repository root:

```sh
python3 -m http.server 4173
```

Open http://localhost:4173.

## Structure

- `index.html`, `style.css`, and `app.js` — website source at the repository root
- `assets/` — optimized product photographs
- `PHOTO-SOURCES.json` — image sources and credits
- `PRODUCT.md` and `DESIGN.md` — product and visual direction
- `.openai/hosting.json` — existing Sites deployment configuration

Product images belong to their respective owners. Sources are linked on each product page.

## Vercel

Import this repository as a static site. Use the repository root, with no build command or dependency installation.
