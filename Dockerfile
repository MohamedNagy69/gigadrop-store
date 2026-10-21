# ============================================================
# GIGADROP — Production Dockerfile (Node 20 Alpine)
# ============================================================
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm install

# Copy application source
COPY . .

# Generate Prisma Client & Build Next.js production bundle
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

# Run database push & start Next.js server
CMD ["sh", "-c", "npx prisma db push && npm run start"]
