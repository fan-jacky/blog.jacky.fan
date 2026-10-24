# blog.jacky.fan — Local Development

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   MongoDB    │     │  Payload CMS │     │  Astro Blog  │
│   :27019     │◄────│   :4101      │◄────│   :4100      │
│   (Docker)   │     │   (native)   │     │   (native)   │
└──────────────┘     └──────────────┘     └──────────────┘
```

Three services, two of which run natively for fast iteration.

## Quick Start

```bash
# 1. Start MongoDB (Docker)
docker compose up -d mongodb

# 2. Start CMS (native, port 4101)
cd cms && NODE_OPTIONS='--no-deprecation' npx next dev --webpack -p 4101

# 3. Start Astro blog (native, port 4100)
pnpm run dev        # = pnpm --dir web dev
```

Then visit **http://localhost:4100**.

## Stop Everything

```bash
kill $(lsof -ti :4100)   # Astro blog
kill $(lsof -ti :4101)   # CMS
docker compose down      # MongoDB
```

## Port Map

| Service   | Dev Port | Docker Port | Production |
|-----------|----------|-------------|------------|
| MongoDB   | 27019    | 27017 (internal) | 27028 (rpi5-1) |
| CMS       | 4101     | 4201        | 4201 (rpi5-1) |
| Astro     | 4100     | 4100 (internal) | 4200→4100 (rpi5-1) |

## .env — Local vs Production

The blog's env lives in **`web/.env`** (copy from `web/.env.example`). The root `.env`
is consumed by `docker-compose.yml` for the production deployment:

```bash
# Local dev (web/.env, default after setup)
PAYLOAD_URL=http://localhost:4101
PUBLIC_PAYLOAD_URL=http://localhost:4101

# Production (root .env / docker-compose)
PAYLOAD_URL=http://cms:4201
PUBLIC_PAYLOAD_URL=
```

- `PAYLOAD_URL` — server-side CMS URL (build-time prerender + server endpoints)
- `PUBLIC_PAYLOAD_URL` — CMS origin exposed to browser JS (live preview island, media URLs). Empty string = proxy mode: browser CMS calls go to same-origin `/api/*` and the Astro server proxies to the internal CMS.

`.env` files are gitignored — back up before editing. The `cms/.env` (CMS config) is pre-configured for local dev and shouldn't need changes.

## CMS Admin

Access the admin panel at **http://localhost:4101/admin**.

Credentials: `admin@blog.local` / `Admin123!`.

If no admin user exists, create one:
```bash
cd cms && npx tsx src/scripts/create-admin.ts
```

## Static Output & Rebuilds

The Astro frontend prerenders **all public pages to static HTML** at build time
(`web/dist`). Live preview (`/cms-preview/[slug]`) and the `/api/*` endpoints are
the only server-rendered routes. Consequences:

- Publishing a post requires a **rebuild + redeploy** of the `web` service
  (webhook or cron on rpi5-1: `docker compose build web && docker compose up -d web`).
- `pnpm --dir web build` needs the CMS reachable (`localhost:4101` locally);
  if unreachable it warns and prerenders an empty post list instead of failing.
- On **first deploy**, the `web` image builds before the CMS container is up —
  rebuild `web` once after the first boot to bake in content.

## Tech Stack

- **Framework**: Astro 5 (static output, `@astrojs/node` standalone adapter)
- **Live preview**: Vue island (`@payloadcms/live-preview-vue`) — the only client-side Vue
- **CSS**: SCSS partials (`@use`), Tailwind, daisyUI
- **CMS**: Payload CMS 3.x (Slate rich text, MongoDB)
- **Smooth scroll**: locomotive-scroll v5 (Lenis)
- **Package manager**: pnpm

## Common Commands

```bash
pnpm --dir web check    # Type checking (astro check)
pnpm --dir web build    # Production build (prerenders static HTML; needs CMS up)
pnpm --dir web dev      # Dev server on :4100
```
