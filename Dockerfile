# Multi-stage Dockerfile for Wing AI Business Management & POS
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

# Build frontend and production assets
RUN npm run build

# Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm install -g tsx

# Copy built frontend dist and backend files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Persistent volume for database
VOLUME ["/app/data"]

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/vps-info || exit 1

# Start production server using tsx
CMD ["tsx", "server.ts"]
