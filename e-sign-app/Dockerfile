# Stage 1: Build frontend assets
FROM node:20-alpine AS asset-builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build
COPY . .
RUN npm run build

# Stage 2: Production PHP environment
# Using serversideup/php image which is optimized for Laravel & Nginx
FROM serversideup/php:8.3-fpm-nginx AS php-runtime

# Switch to root for system updates
USER root

# Install necessary system dependencies for PHP extensions
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    zip \
    unzip \
    libpq-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql pdo_pgsql bcmath zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /var/www/html

# Copy application files with correct ownership
COPY --chown=www-data:www-data . .

# Copy built assets from builder stage
COPY --from=asset-builder --chown=www-data:www-data /app/public/build ./public/build

# Final PHP-specific configurations
# Note: serversideup handles Nginx and FPM config automatically
USER www-data

# Install production PHP dependencies
RUN composer install --no-interaction --no-dev --optimize-autoloader

# Storage and cache linked folders
RUN php artisan storage:link || true

# Environment configuration for production
ENV PHP_OPCACHE_ENABLE=1
ENV AUTORUN_LARAVEL_MIGRATIONS=false
ENV AUTORUN_LARAVEL_CONFIG_CACHE=true
ENV AUTORUN_LARAVEL_ROUTE_CACHE=true
ENV AUTORUN_LARAVEL_VIEW_CACHE=true

# Expose port (Coolify usually maps this)
EXPOSE 8080
