# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
RUN npm ci --only=production && npm install --only=dev

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine

# 🛡️ Security: Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production deps
RUN npm ci --only=production --no-audit --no-fund

# 🛡️ Security: Switch to non-root user
USER nextjs

# Expose port (Fly.io expects 8080 by default)
EXPOSE 8080

# Graceful shutdown + health check endpoint
ENV PORT=8080
ENV NODE_ENV=production

# Start server
CMD ["node", "dist/server.js"]
