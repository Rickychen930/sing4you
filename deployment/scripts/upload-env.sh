#!/bin/bash

# Script untuk upload .env file ke server
# Usage: ./deployment/scripts/upload-env.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

SERVER_IP="72.61.214.25"
SERVER_USER="root"
SERVER_DIR="/var/www/christina-sings4you"
ENV_FILE=".env"
SSH_KEY="$HOME/.ssh/id_deploy"

log "Uploading .env file to server..."

# Check if .env exists locally
if [ ! -f "$ENV_FILE" ]; then
    error ".env file not found in current directory"
fi

# Upload using scp with SSH key
if [ -f "$SSH_KEY" ]; then
    log "Using SSH key: $SSH_KEY"
    scp -i "$SSH_KEY" "$ENV_FILE" "$SERVER_USER@$SERVER_IP:$SERVER_DIR/"
else
    log "Uploading to $SERVER_USER@$SERVER_IP:$SERVER_DIR/..."
    scp "$ENV_FILE" "$SERVER_USER@$SERVER_IP:$SERVER_DIR/"
fi

if [ $? -eq 0 ]; then
    log "✓ .env file uploaded successfully!"
    log ""
    log "Setting permissions on server..."
    if [ -f "$SSH_KEY" ]; then
        ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "chmod 600 $SERVER_DIR/.env && chown www-data:www-data $SERVER_DIR/.env"
    else
        ssh "$SERVER_USER@$SERVER_IP" "chmod 600 $SERVER_DIR/.env && chown www-data:www-data $SERVER_DIR/.env"
    fi
    
    if [ $? -eq 0 ]; then
        log "✓ Permissions set successfully!"
        log ""
        warning "⚠️  IMPORTANT: Verify .env file on server:"
        log "   ssh $SERVER_USER@$SERVER_IP"
        log "   cat $SERVER_DIR/.env | grep JWT_SECRET"
        log ""
        log "Then rebuild and restart:"
        log "   cd $SERVER_DIR"
        log "   npm run build:server"
        log "   pm2 restart christina-sings4you-api"
    else
        warning "Upload successful but failed to set permissions. Set manually:"
        warning "   ssh $SERVER_USER@$SERVER_IP"
        warning "   chmod 600 $SERVER_DIR/.env"
        warning "   chown www-data:www-data $SERVER_DIR/.env"
    fi
else
    error "Upload failed. Please check SSH connection and credentials."
fi
