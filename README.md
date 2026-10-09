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

## Content

All the placeholder content lives in `content/lamgold-content.xlsx`, with the
photos in `content/images/`. Edit the sheet, then push it to Sanity:

```bash
npm run content:push -- --dry-run   # check the sheet
npm run content:push                # write it to Sanity
```

The push needs an Editor token in `storefront/.env.local` as
`SANITY_API_WRITE_TOKEN` (sanity.io/manage → LamGold → API → Tokens). The sheet's
"Read me" tab explains each tab. Before Shopify is connected, products are
stand-ins; remove them with `npm run content:push -- --remove-dummy` first.

## Deployment (Vercel)

1. Import the GitHub repo in Vercel (Add New → Project).
2. **Root Directory:** `storefront` (leave "Include files outside the root
   directory" on, so the npm workspace installs). Framework: Next.js.
3. **Environment variables:**
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
     `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_READ_TOKEN` (same as `.env.local`)
   - `NEXT_PUBLIC_SANITY_STUDIO_URL` = the hosted Studio, e.g. `https://lamgold.sanity.studio`
   - `NEXT_PUBLIC_DEMO_CART` = `1` while presenting without Shopify
   - `SHOPIFY_STORE_DOMAIN`, `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` = `lamgold.myshopify.com`
   - Leave out `SHOPIFY_STOREFRONT_ACCESS_TOKEN` until the store is connected
   - `ENQUIRY_WEBHOOK_URL` when the enquiry form should send
4. Deploy. Then in sanity.io/manage → API → CORS origins, add the Vercel URL
   (with credentials allowed) so live preview works.

The Studio deploys separately with `npm run deploy --workspace=studio`
(Sanity-hosted at `<name>.sanity.studio`). `/studio` on the site redirects to it.

See `storefront/README.md` and `studio/README.md` for more detail on each app.
