#!/bin/bash

# Backup script untuk aplikasi christina-sings4you.com.au
# Usage: ./backup.sh

set -e

APP_DIR="/var/www/christina-sings4you"
BACKUP_DIR="/backup/christina-sings4you"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_NAME="backup-$TIMESTAMP"

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

log "Starting backup process..."

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create backup
log "Creating backup archive..."
cd "$APP_DIR" || error "Application directory not found: $APP_DIR"

tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    --exclude='*.log' \
    --exclude='.env' \
    . || error "Backup failed!"

# Get backup size
BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_NAME.tar.gz" | cut -f1)

log "Backup created successfully: $BACKUP_NAME.tar.gz ($BACKUP_SIZE)"

# List recent backups
log "Recent backups:"
ls -lh "$BACKUP_DIR" | tail -5

# Cleanup old backups (keep last 7 days)
log "Cleaning up old backups (keeping last 7 days)..."
find "$BACKUP_DIR" -name "backup-*.tar.gz" -mtime +7 -delete || warning "Failed to cleanup old backups"

log "Backup process completed!"
