#!/bin/bash

# Script untuk deploy dengan upload .env file
# Usage: ./deploy-with-env.sh [production|staging]

set -e

ENVIRONMENT=${1:-production}
SERVER_IP="72.61.214.25"
SERVER_USER="root"
APP_DIR="/var/www/christina-sings4you"
LOCAL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Colors
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

log "Starting deployment with .env upload to $ENVIRONMENT environment"
log "Server: $SERVER_USER@$SERVER_IP"
log "Local directory: $LOCAL_DIR"

# Check if .env exists locally
if [ ! -f "$LOCAL_DIR/.env" ]; then
    error ".env file not found in $LOCAL_DIR/.env"
    info "Please create .env file first or use deploy-from-local.sh without .env"
fi

# Upload .env file first
log "Uploading .env file to server..."
scp "$LOCAL_DIR/.env" "$SERVER_USER@$SERVER_IP:$APP_DIR/.env" || error "Failed to upload .env file"

# Set permissions on server
log "Setting .env file permissions on server..."
ssh "$SERVER_USER@$SERVER_IP" "chmod 600 $APP_DIR/.env && chown www-data:www-data $APP_DIR/.env" || error "Failed to set .env permissions"

log "✓ .env file uploaded and permissions set"

# Build locally first
log "Building application locally..."
cd "$LOCAL_DIR"

# Check if build succeeds
if ! npm run build; then
    error "Local build failed! Fix errors before deploying."
fi

if ! npm run build:server; then
    error "Server build failed! Fix errors before deploying."
fi

log "Build completed successfully!"

# Create temporary exclude file for rsync
EXCLUDE_FILE=$(mktemp)
cat > "$EXCLUDE_FILE" << EOF
node_modules/
.git/
.env
.env.*
!.env.example
*.log
dist/
dist-ssr/
build/
.DS_Store
*.swp
*.swo
*~
.vscode/
.idea/
coverage/
*.tmp
*.backup
*.bak
EOF

# Sync files to server (excluding .env since we already uploaded it)
log "Syncing files to server..."
rsync -avz --delete \
    --exclude-from="$EXCLUDE_FILE" \
    -e "ssh -o StrictHostKeyChecking=no" \
    "$LOCAL_DIR/" "$SERVER_USER@$SERVER_IP:$APP_DIR/"

# Clean up exclude file
rm "$EXCLUDE_FILE"

log "Files synced successfully!"

# Run deployment script on server
log "Running deployment script on server..."
ssh "$SERVER_USER@$SERVER_IP" "cd $APP_DIR && chmod +x deployment/scripts/deploy.sh && sudo ./deployment/scripts/deploy.sh $ENVIRONMENT"

log "Deployment completed successfully!"
log "Application is live at: https://christina-sings4you.com.au"

# Health check
log "Running health check..."
ssh "$SERVER_USER@$SERVER_IP" "cd $APP_DIR && chmod +x deployment/scripts/health-check.sh && ./deployment/scripts/health-check.sh"
