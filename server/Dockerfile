# Multi-stage Dockerfile for NestJS GraphQL Backend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile=false

# Generate Prisma Client
RUN pnpm prisma generate

# Copy source code and build
COPY . .
RUN pnpm build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000

CMD ["node", "dist/main.js"]
