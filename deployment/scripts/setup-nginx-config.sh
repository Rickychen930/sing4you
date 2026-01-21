#!/bin/bash

# Setup Nginx configuration for christina-sings4you.com.au
# Usage: Run this script on the server as root
# sudo ./setup-nginx-config.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    error "Please run as root (use sudo)"
fi

APP_DIR="/var/www/christina-sings4you"
NGINX_CONFIG_SOURCE="$APP_DIR/deployment/nginx/christina-sings4you.com.au.conf"
NGINX_CONFIG_TARGET="/etc/nginx/sites-available/christina-sings4you.com.au.conf"
NGINX_ENABLED="/etc/nginx/sites-enabled/christina-sings4you.com.au.conf"

log "Setting up Nginx configuration..."

# Check if source config exists
if [ ! -f "$NGINX_CONFIG_SOURCE" ]; then
    error "Nginx config source not found: $NGINX_CONFIG_SOURCE"
fi

# Backup existing config if it exists
if [ -f "$NGINX_CONFIG_TARGET" ]; then
    log "Backing up existing Nginx configuration..."
    cp "$NGINX_CONFIG_TARGET" "$NGINX_CONFIG_TARGET.backup.$(date +%Y%m%d-%H%M%S)"
fi

# Copy config file
log "Copying Nginx configuration..."
cp "$NGINX_CONFIG_SOURCE" "$NGINX_CONFIG_TARGET"
chmod 644 "$NGINX_CONFIG_TARGET"

# Create symlink if it doesn't exist
if [ ! -L "$NGINX_ENABLED" ]; then
    log "Creating symlink..."
    ln -s "$NGINX_CONFIG_TARGET" "$NGINX_ENABLED"
else
    log "Symlink already exists"
fi

# Remove default Nginx site if it exists
if [ -L "/etc/nginx/sites-enabled/default" ]; then
    log "Removing default Nginx site..."
    rm /etc/nginx/sites-enabled/default
fi

# Test Nginx configuration
log "Testing Nginx configuration..."
if nginx -t; then
    log "✅ Nginx configuration is valid"
else
    error "Nginx configuration test failed! Please check the config file."
fi

# Reload Nginx
log "Reloading Nginx..."
systemctl reload nginx || systemctl restart nginx
log "✅ Nginx reloaded successfully"

log ""
log "✅ Nginx configuration setup completed!"
log ""
info "Configuration file: $NGINX_CONFIG_TARGET"
info "Enabled symlink: $NGINX_ENABLED"
info ""
info "To edit configuration:"
info "  nano $NGINX_CONFIG_TARGET"
info ""
info "After editing, test and reload:"
info "  nginx -t && systemctl reload nginx"
