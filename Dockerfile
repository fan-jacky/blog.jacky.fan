# ─── Build stage ─────────────────────────────────────────────────────────────
FROM node:26-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@10

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# ─── Production stage ─────────────────────────────────────────────────────────
FROM node:26-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4100
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=4100

COPY --from=builder /app/.output ./.output

EXPOSE 4100

CMD ["node", ".output/server/index.mjs"]
