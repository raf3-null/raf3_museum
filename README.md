# raf3 museum

A monochrome personal gaming gear collection featuring 10 items, category filters, and individual exhibit pages.

## Preview locally

No dependencies or build step required. From the repository root:

```sh
python3 -m http.server 4173 --directory dist
```

Open http://localhost:4173.

## Structure

- `dist/` — deployable HTML, CSS, JavaScript, and optimized product photographs
- `PHOTO-SOURCES.json` — image sources and credits
- `PRODUCT.md` and `DESIGN.md` — product and visual direction
- `.openai/hosting.json` — existing Sites deployment configuration

Product images belong to their respective owners. Sources are linked on each product page.
