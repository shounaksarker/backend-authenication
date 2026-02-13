# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ARG DATABASE_URL="mysql://root:password@db:3306/authdb"
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate

# ---------- Stage 2: Production ----------
FROM node:20-alpine

WORKDIR /app

# Only copy necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

ENV NODE_ENV=production

EXPOSE 5100

CMD ["node", "src/server.js"]
