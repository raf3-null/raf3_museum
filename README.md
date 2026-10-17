# raf3 museum

A dark studio with a fully orbitable Three.js cabinet. Drag or swipe to rotate 360°, scroll/pinch to zoom, and click photographs on the front shelves to inspect each item. Solid sides and a closed back hide all exhibits when viewed from behind. Includes view presets, keyboard controls, category filters, accessible product dialogs, and a list fallback when WebGL is unavailable.

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

## 3D runtime

Three.js r169 and OrbitControls are self-hosted in `vendor/three/` under the included MIT license. No install or build is required. The renderer draws on demand; all product photographs remain front-facing planes inside a solid 3D cabinet.
