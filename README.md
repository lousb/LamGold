# LamGold

Next.js + Sanity + Shopify storefront for LamGold (custom gold jewellery - chains, pendants and earrings, made-to-order and ready-to-wear).

This project started from the [Sanity Photon](https://github.com/jazsouf/sanity-photon) starter template and has been adapted with a LamGold-specific Sanity schema (Settings, Home page builder, Product).

## Structure

- `storefront/` - Next.js App Router frontend
- `studio/` - Sanity Studio (CMS)

## Getting started

1. Install dependencies from the repo root:

   ```bash
   npm install
   ```

2. Copy the environment variable templates and fill in LamGold's real values:

   ```bash
   cp .env.example .env.local
   cp storefront/.env.example storefront/.env.local
   cp studio/.env.example studio/.env.local
   ```

3. Run both apps together:

   ```bash
   npm run dev
   ```

   - Storefront: http://localhost:3000
   - Studio: http://localhost:3333

## Deployment

- Storefront deploys to Vercel.
- Studio deploys with `npm run deploy --workspace=studio` (Sanity-hosted at `[projectId].sanity.studio`), or via the `/studio` route embedded in the storefront.

See `storefront/README.md` and `studio/README.md` for more detail on each app.
