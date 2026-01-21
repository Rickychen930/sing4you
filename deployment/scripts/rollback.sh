#!/bin/bash

# Rollback script - Restore from backup
# Usage: ./rollback.sh [backup-filename]

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
BACKUP_DIR="/backup/christina-sings4you"

if [ ! -d "$BACKUP_DIR" ]; then
    error "Backup directory not found: $BACKUP_DIR"
fi

# List available backups
log "Available backups:"
ls -lh "$BACKUP_DIR"/*.tar.gz 2>/dev/null | tail -10 || warning "No backups found"

# Get backup file
if [ -z "$1" ]; then
    echo ""
    info "Usage: $0 <backup-filename>"
    info "Example: $0 backup-20240121-120000.tar.gz"
    echo ""
    info "Or specify 'latest' to use the most recent backup:"
    BACKUP_FILE=$(ls -t "$BACKUP_DIR"/*.tar.gz 2>/dev/null | head -1)
    if [ -z "$BACKUP_FILE" ]; then
        error "No backups found!"
    fi
    info "Latest backup: $(basename $BACKUP_FILE)"
    read -p "Use latest backup? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
else
    if [ "$1" == "latest" ]; then
        BACKUP_FILE=$(ls -t "$BACKUP_DIR"/*.tar.gz 2>/dev/null | head -1)
        if [ -z "$BACKUP_FILE" ]; then
            error "No backups found!"
        fi
    else
        BACKUP_FILE="$BACKUP_DIR/$1"
        if [ ! -f "$BACKUP_FILE" ]; then
            error "Backup file not found: $BACKUP_FILE"
        fi
    fi
fi

log "Rolling back to: $(basename $BACKUP_FILE)"

# Confirm rollback
warning "⚠️  WARNING: This will replace current application with backup!"
warning "⚠️  Current application will be backed up first"
read -p "Continue? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log "Rollback cancelled"
    exit 0
fi

# Create backup of current state
log "Creating backup of current state..."
CURRENT_BACKUP="$BACKUP_DIR/pre-rollback-$(date +%Y%m%d-%H%M%S).tar.gz"
cd "$APP_DIR" || error "Application directory not found"
tar -czf "$CURRENT_BACKUP" \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    . || warning "Failed to backup current state"

# Stop services
log "Stopping services..."
if command -v pm2 &> /dev/null; then
    pm2 stop christina-sings4you-api || true
else
    systemctl stop christina-sings4you || true
fi

# Extract backup
log "Extracting backup..."
cd "$APP_DIR" || error "Application directory not found"
tar -xzf "$BACKUP_FILE" || error "Failed to extract backup"

# Set permissions
log "Setting permissions..."
chown -R www-data:www-data "$APP_DIR"
chmod -R 755 "$APP_DIR"

# Install dependencies if package.json changed
if [ -f "package.json" ]; then
    log "Installing dependencies..."
    npm ci --production --no-audit --no-fund || npm install --production
fi

# Build if needed
if [ -f "package.json" ]; then
    log "Building application..."
    npm run build || warning "Build failed, continuing..."
    npm run build:server || warning "Server build failed, continuing..."
fi

# Restart services
log "Restarting services..."
if command -v pm2 &> /dev/null; then
    pm2 restart christina-sings4you-api || pm2 start deployment/pm2/ecosystem.config.js --env production
    pm2 save
else
    systemctl start christina-sings4you || error "Failed to start service"
fi

# Reload Nginx
log "Reloading Nginx..."
nginx -t && systemctl reload nginx || warning "Nginx reload failed"

log "Rollback completed successfully!"
log "Current state backed up to: $(basename $CURRENT_BACKUP)"
