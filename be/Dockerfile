# ========== BUILD BACKEND ==========
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code and build
COPY . .
RUN npm run build

# Install only production dependencies for the final stage
RUN npm ci --only=production && npm cache clean --force

# ========== FINAL STAGE ==========
FROM node:18-alpine

# Install supervisor and create app user
RUN apk add --no-cache supervisor && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Create necessary directories
RUN mkdir -p /app /var/log/supervisor

# Copy built application and production dependencies from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/dist /app/dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json /app/package.json

# Copy supervisor configuration
COPY --chown=nextjs:nodejs supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Set working directory
WORKDIR /app

# Create log directory and set permissions
RUN mkdir -p /var/log/supervisor && \
    chown -R nextjs:nodejs /var/log/supervisor

# Environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Expose only the backend port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Run supervisor as root (it will start the backend process as nextjs user)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
