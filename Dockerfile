# ─── Build stage ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./
# Use npm install to support both lock-file formats
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# ─── Production stage ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4100
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=4100

COPY --from=builder /app/.output ./.output

EXPOSE 4100

CMD ["node", ".output/server/index.mjs"]
