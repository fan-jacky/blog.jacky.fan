# ─── Build stage ─────────────────────────────────────────────────────────────
FROM node:26-alpine AS builder

WORKDIR /app

# Build-time secret (passed via --build-arg or docker compose build args)
ARG PAYLOAD_SECRET
ENV PAYLOAD_SECRET=${PAYLOAD_SECRET}

RUN npm install -g pnpm@11

# Install dependencies (including devDependencies needed for the build)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json next.config.ts next-env.d.ts ./
COPY src ./src
RUN pnpm install --frozen-lockfile

# Patch Form component: fix client-side navigation in Docker
RUN find node_modules -path '*/@payloadcms/ui/dist/forms/Form/index.js' -exec sed -i 's|startRouteTransition(() => router.push(redirect));|startRouteTransition(() => { setTimeout(() => { window.location.href = redirect; }, 100); });|' {} \;

# Copy source and build
COPY . .
# Force clean build - remove all caches
RUN rm -rf .next .turbo node_modules/.cache
RUN pnpm run build

# ─── Production stage ─────────────────────────────────────────────────────────
FROM node:26-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

RUN npm install -g pnpm@11

# Copy only what is needed to run the app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/tsconfig.json ./

EXPOSE 3001

CMD ["npx", "next", "start"]
