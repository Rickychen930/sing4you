#!/bin/bash

# Script untuk setup Nginx configuration
# Usage: sudo ./setup-nginx.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    error "Please run as root (use sudo)"
fi

APP_DIR="/var/www/christina-sings4you"
NGINX_CONFIG_SOURCE="$APP_DIR/deployment/nginx/christina-sings4you.com.au.conf"
NGINX_CONFIG_TARGET="/etc/nginx/sites-available/christina-sings4you.com.au"
NGINX_ENABLED="/etc/nginx/sites-enabled/christina-sings4you.com.au"

log "Setting up Nginx configuration..."

# Check if source config exists
if [ ! -f "$NGINX_CONFIG_SOURCE" ]; then
    error "Nginx config source not found: $NGINX_CONFIG_SOURCE"
fi

# Copy config
log "Copying Nginx configuration..."
cp "$NGINX_CONFIG_SOURCE" "$NGINX_CONFIG_TARGET"
log "✓ Configuration copied to $NGINX_CONFIG_TARGET"

# Enable site
if [ ! -L "$NGINX_ENABLED" ]; then
    log "Enabling site..."
    ln -s "$NGINX_CONFIG_TARGET" "$NGINX_ENABLED"
    log "✓ Site enabled"
else
    log "✓ Site already enabled"
fi

# Test configuration
log "Testing Nginx configuration..."
if nginx -t; then
    log "✓ Nginx configuration is valid"
else
    error "Nginx configuration test failed!"
fi

# Reload Nginx
log "Reloading Nginx..."
systemctl reload nginx || error "Failed to reload Nginx"
log "✓ Nginx reloaded"

log "Nginx setup completed successfully!"
log ""
warning "⚠️  Don't forget to setup SSL certificate:"
warning "   certbot --nginx -d christina-sings4you.com.au -d www.christina-sings4you.com.au"
