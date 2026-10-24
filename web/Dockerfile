# ─── Build stage ─────────────────────────────────────────────────────────────
# Static HTML for all public pages is prerendered here. If the CMS is not
# reachable at build time (e.g. first deploy), pages are prerendered empty —
# rebuild the web service once the CMS is up to bake in content.
FROM node:26-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@12.15.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# PAYLOAD_URL points at the CMS container if it is on the build network;
# otherwise the build falls back to prerendering an empty site (see
# src/lib/payload.ts fetchPayloadPostsForBuild).
ARG PAYLOAD_URL=http://localhost:4101
ENV PAYLOAD_URL=${PAYLOAD_URL}
RUN pnpm run build

# ─── Production stage ─────────────────────────────────────────────────────────
# Serves the prerendered HTML plus the on-demand routes (live preview, API).
FROM node:26-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4100

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 4100

CMD ["node", "dist/server/entry.mjs"]
