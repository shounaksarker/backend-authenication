# ---------- Stage 1: Builder ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# ARG DATABASE_URL="mysql://root:password@db:3306/authdb"
# ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate

# ---------- Stage 2: Production ----------
FROM node:20-alpine

WORKDIR /app

# Only copy necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env .env
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts


ENV NODE_ENV=production

EXPOSE 5100

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:5100/health || exit 1

CMD ["sh", "-c", "npx prisma migrate deploy --config=./prisma.config.ts && node src/server.js"]

