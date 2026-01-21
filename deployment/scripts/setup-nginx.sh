#!/bin/bash

# Setup Nginx configuration script
# Usage: sudo ./setup-nginx.sh [http-only|ssl]

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

# Configuration
APP_DIR="/var/www/christina-sings4you"
NGINX_AVAILABLE="/etc/nginx/sites-available/christina-sings4you.com.au"
NGINX_ENABLED="/etc/nginx/sites-enabled/christina-sings4you.com.au"
MODE=${1:-http-only}

# Check if app directory exists
if [ ! -d "$APP_DIR" ]; then
    error "Application directory not found: $APP_DIR"
fi

# Determine which config file to use
if [ "$MODE" = "ssl" ]; then
    NGINX_CONF="$APP_DIR/deployment/nginx/christina-sings4you.com.au.conf"
    log "Using SSL configuration"
else
    NGINX_CONF="$APP_DIR/deployment/nginx/christina-sings4you.com.au.http-only.conf"
    log "Using HTTP-only configuration"
fi

# Check if config file exists
if [ ! -f "$NGINX_CONF" ]; then
    error "Nginx config file not found: $NGINX_CONF"
fi

log "Setting up Nginx configuration..."

# Backup existing config if it exists
if [ -f "$NGINX_AVAILABLE" ]; then
    log "Backing up existing configuration..."
    cp "$NGINX_AVAILABLE" "${NGINX_AVAILABLE}.backup.$(date +%Y%m%d-%H%M%S)"
fi

# Copy config file
log "Copying configuration file..."
cp "$NGINX_CONF" "$NGINX_AVAILABLE"

# Enable site
log "Enabling site..."
ln -sf "$NGINX_AVAILABLE" "$NGINX_ENABLED"

# Remove default nginx site
if [ -f "/etc/nginx/sites-enabled/default" ]; then
    log "Removing default nginx site..."
    rm -f /etc/nginx/sites-enabled/default
fi

# Test nginx configuration
log "Testing nginx configuration..."
if nginx -t; then
    log "✅ Nginx configuration test passed!"
else
    error "Nginx configuration test failed! Please check the configuration."
fi

# Reload nginx
log "Reloading nginx..."
systemctl reload nginx || error "Failed to reload nginx"

# Check nginx status
if systemctl is-active --quiet nginx; then
    log "✅ Nginx is running successfully!"
else
    error "Nginx is not running! Check logs: journalctl -u nginx"
fi

log ""
log "✅ Nginx setup completed successfully!"
log ""
log "Configuration file: $NGINX_AVAILABLE"
log "Enabled site: $NGINX_ENABLED"
log ""

if [ "$MODE" = "http-only" ]; then
    log "Next steps:"
    log "1. Verify DNS is pointing to this server (72.61.214.25)"
    log "2. Wait for DNS propagation (check with: dig christina-sings4you.com.au)"
    log "3. Test HTTP access: http://christina-sings4you.com.au"
    log "4. Setup SSL: sudo certbot --nginx -d christina-sings4you.com.au -d www.christina-sings4you.com.au"
    log "5. After SSL is installed, run: sudo ./setup-nginx.sh ssl"
else
    log "SSL configuration is active!"
    log "Make sure SSL certificates are installed at:"
    log "  /etc/letsencrypt/live/christina-sings4you.com.au/fullchain.pem"
    log "  /etc/letsencrypt/live/christina-sings4you.com.au/privkey.pem"
    log ""
    log "Test HTTPS access: https://christina-sings4you.com.au"
fi

log ""
log "To check nginx status: sudo systemctl status nginx"
log "To view nginx logs: sudo tail -f /var/log/nginx/christina-sings4you-*.log"
