# blog.jacky.fan — Local Development

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   MongoDB    │     │  Payload CMS │     │  Nuxt Blog   │
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

# 3. Start Nuxt blog (native, port 4100)
pnpm run dev
```

Then visit **http://localhost:4100**.

## Stop Everything

```bash
kill $(lsof -ti :4100)   # Nuxt
kill $(lsof -ti :4101)   # CMS
docker compose down      # MongoDB
```

## Port Map

| Service   | Dev Port | Docker Port | Production |
|-----------|----------|-------------|------------|
| MongoDB   | 27019    | 27017 (internal) | 27028 (rpi5-1) |
| CMS       | 4101     | 4201        | 4201 (rpi5-1) |
| Nuxt      | 4100     | 4100 (internal) | 4200→4100 (rpi5-1) |

## .env — Local vs Production

The root `.env` controls whether the blog connects to the **local CMS** or the **production CMS**:

```bash
# Local dev (default after setup)
PAYLOAD_URL=http://localhost:4101
NUXT_PUBLIC_PAYLOAD_URL=http://localhost:4101

# Production
PAYLOAD_URL=https://cms-blog.jacky.fan
NUXT_PUBLIC_PAYLOAD_URL=https://cms-blog.jacky.fan
```

- `PAYLOAD_URL` — server-side CMS URL (used during SSR by Nitro)
- `NUXT_PUBLIC_PAYLOAD_URL` — client-side CMS URL (exposed to browser JS)

`.env` is gitignored — back up before editing. The `cms/.env` (CMS config) is pre-configured for local dev and shouldn't need changes.

## CMS Admin

Access the admin panel at **http://localhost:4101/admin**.

Credentials: `admin@blog.local` / `Admin123!`.

If no admin user exists, create one:
```bash
cd cms && npx tsx src/scripts/create-admin.ts
```

## Tech Stack

- **Framework**: Nuxt 3 (SSR, Vue 3, TypeScript)
- **CSS**: SCSS partials (`@use`), Tailwind, daisyUI
- **CMS**: Payload CMS 3.x (Slate rich text, MongoDB)
- **Smooth scroll**: Locomotive Scroll v5 (Lenis)
- **Package manager**: pnpm

## Common Commands

```bash
npx nuxi typecheck     # Type checking (don't use tsc --noEmit)
pnpm run build          # Production build (don't run while dev server is active)
```
