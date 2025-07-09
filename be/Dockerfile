# ========== BUILD BACKEND ==========
FROM node:18 AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# ========== FINAL STAGE ==========
FROM ubuntu:22.04

# Cài Node, MySQL, Supervisor
RUN apt-get update && \
    apt-get install -y nodejs npm mysql-server supervisor && \
    apt-get clean

# Copy source backend từ stage trước
COPY --from=builder /app /app

# Copy cấu hình supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy SQL seed (nếu có)
COPY docker-entrypoint-initdb.d /docker-entrypoint-initdb.d

# Thiết lập biến môi trường cho MySQL
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=car_db
ENV MYSQL_USER=car_user
ENV MYSQL_PASSWORD=car_pass

# Expose các cổng
EXPOSE 3000
EXPOSE 3306

CMD ["/usr/bin/supervisord"]
