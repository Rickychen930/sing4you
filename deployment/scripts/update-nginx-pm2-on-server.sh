#!/bin/bash

# Update Nginx and PM2 directly on the server
# Usage: Run this script on the server as root
# sudo ./update-nginx-pm2-on-server.sh

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

echo ""
log "=== Updating System Packages ==="
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get upgrade -y -qq

echo ""
log "=== Updating Nginx ==="

# Check current Nginx version
if command -v nginx &> /dev/null; then
    NGINX_VERSION=$(nginx -v 2>&1 | awk -F'/' '{print $2}')
    log "Current Nginx version: $NGINX_VERSION"
else
    warning "Nginx is not installed. Installing..."
    apt-get install -y -qq nginx
    systemctl enable nginx
    systemctl start nginx
fi

# Update Nginx
log "Updating Nginx..."
apt-get install -y -qq --only-upgrade nginx || apt-get install -y -qq nginx

# Verify Nginx configuration
log "Verifying Nginx configuration..."
if nginx -t; then
    log "✅ Nginx configuration is valid"
    
    # Reload Nginx (graceful reload, no downtime)
    log "Reloading Nginx..."
    systemctl reload nginx || systemctl restart nginx
    log "✅ Nginx reloaded successfully"
else
    error "Nginx configuration test failed! Please fix configuration first."
fi

# Show new Nginx version
NEW_NGINX_VERSION=$(nginx -v 2>&1 | awk -F'/' '{print $2}')
log "Nginx version after update: $NEW_NGINX_VERSION"

echo ""
log "=== Updating PM2 ==="

# Check current PM2 version
if command -v pm2 &> /dev/null; then
    PM2_VERSION=$(pm2 --version)
    log "Current PM2 version: $PM2_VERSION"
else
    warning "PM2 is not installed. Installing..."
    npm install -g pm2@latest
    pm2 startup systemd -u root --hp /root
fi

# Update PM2 to latest version
log "Updating PM2 to latest version..."
npm install -g pm2@latest

# Show new PM2 version
NEW_PM2_VERSION=$(pm2 --version)
log "PM2 version after update: $NEW_PM2_VERSION"

# Save PM2 process list
log "Saving PM2 process list..."
pm2 save || warning "No processes to save"

# Update PM2 startup script (in case it changed)
log "Updating PM2 startup script..."
pm2 startup systemd -u root --hp /root || warning "PM2 startup script update failed (may already be configured)"

echo ""
log "=== Service Status ==="

# Check Nginx status
if systemctl is-active --quiet nginx; then
    log "✅ Nginx is running"
    systemctl status nginx --no-pager -l | head -5
else
    warning "⚠️  Nginx is not running"
    log "Starting Nginx..."
    systemctl start nginx
fi

# Check PM2 processes
log ""
log "PM2 Process Status:"
pm2 list

echo ""
log "=== Update Summary ==="
log "Nginx: $NGINX_VERSION → $NEW_NGINX_VERSION"
log "PM2: $PM2_VERSION → $NEW_PM2_VERSION"
log ""
log "✅ Update completed successfully!"
log ""
info "Useful commands:"
info "  nginx -t                    - Test Nginx configuration"
info "  systemctl status nginx      - Check Nginx status"
info "  systemctl reload nginx      - Reload Nginx (no downtime)"
info "  systemctl restart nginx     - Restart Nginx"
info "  pm2 list                    - List PM2 processes"
info "  pm2 logs                    - View PM2 logs"
info "  pm2 monit                   - Monitor PM2 processes"
