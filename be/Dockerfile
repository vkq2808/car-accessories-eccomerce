# ========== BUILD BACKEND ==========
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ========== FINAL IMAGE ==========
FROM alpine:3.18

# Cài các dependency
RUN apk add --no-cache \
    nodejs \
    npm \
    mysql mysql-client \
    supervisor

# Tạo user an toàn
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Thư mục làm việc
WORKDIR /app

# Copy source
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json

# Copy config supervisor và init SQL (nếu có)
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY init.sql /docker-entrypoint-initdb.d/init.sql

# Set ENV
ENV NODE_ENV=production
ENV PORT=3001

# Expose các cổng
EXPOSE 3001 3306

# Chạy bằng supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
