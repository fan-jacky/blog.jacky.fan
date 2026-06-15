# ─── Build stage ─────────────────────────────────────────────────────────────
FROM node:26-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@10

# Install dependencies (including devDependencies needed for the build)
COPY package.json pnpm-lock.yaml tsconfig.json next.config.ts next-env.d.ts ./
COPY src ./src
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm run build

# ─── Production stage ─────────────────────────────────────────────────────────
FROM node:26-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

RUN npm install -g pnpm@10

# Copy only what is needed to run the app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.ts ./

EXPOSE 3001

CMD ["pnpm", "run", "start"]
