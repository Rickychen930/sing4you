#!/bin/bash

# Quick deploy script - untuk deployment cepat tanpa backup
# Usage: ./quick-deploy.sh
# WARNING: Script ini tidak membuat backup, gunakan dengan hati-hati!

set -e

APP_DIR="/var/www/christina-sings4you"
ENVIRONMENT=${1:-production}

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    warning "Not running as root. Some commands may fail."
fi

log "Starting quick deployment..."

cd "$APP_DIR" || exit 1

# Pull latest code (if git)
if [ -d ".git" ]; then
    log "Pulling latest code..."
    git pull origin master || warning "Git pull failed"
fi

# Install dependencies
log "Installing dependencies..."
npm ci --production --no-audit --no-fund || npm install --production

# Build
log "Building application..."
npm run build || exit 1
npm run build:server || exit 1

# Restart PM2
if command -v pm2 &> /dev/null; then
    log "Restarting PM2..."
    pm2 restart christina-sings4you-api || pm2 start deployment/pm2/ecosystem.config.cjs --env production
    pm2 save
else
    log "Restarting systemd service..."
    systemctl restart christina-sings4you
fi

# Reload Nginx
log "Reloading Nginx..."
nginx -t && systemctl reload nginx || warning "Nginx reload failed"

log "Quick deployment completed!"
