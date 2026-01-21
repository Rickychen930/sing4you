#!/bin/bash

# Setup PM2 for christina-sings4you.com.au
# This script installs PM2, sets up logging, and configures auto-start

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

log "Starting PM2 setup for christina-sings4you..."

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    log "Installing PM2 globally..."
    npm install -g pm2@latest || error "Failed to install PM2"
    log "✅ PM2 installed successfully"
else
    PM2_VERSION=$(pm2 --version)
    log "PM2 is already installed (version: $PM2_VERSION)"
fi

# Create log directory
log "Creating PM2 log directory..."
mkdir -p /var/log/pm2
chmod 755 /var/log/pm2
log "✅ Log directory created: /var/log/pm2"

# Setup PM2 startup script
log "Setting up PM2 startup script..."
pm2 startup systemd -u root --hp /root || warning "PM2 startup script setup failed (may already be configured)"

# Check if ecosystem config exists
APP_DIR="/var/www/christina-sings4you"
ECOSYSTEM_CONFIG="$APP_DIR/deployment/pm2/ecosystem.config.cjs"

if [ -f "$ECOSYSTEM_CONFIG" ]; then
    log "Found ecosystem config at: $ECOSYSTEM_CONFIG"
    
    # Check if process is already running
    if pm2 list | grep -q "christina-sings4you-api"; then
        warning "Process 'christina-sings4you-api' is already running"
        info "To restart: pm2 restart christina-sings4you-api"
        info "To reload: pm2 reload christina-sings4you-api"
    else
        info "Process not running. You can start it with:"
        info "  cd $APP_DIR"
        info "  pm2 start deployment/pm2/ecosystem.config.cjs --env production"
    fi
else
    warning "Ecosystem config not found at: $ECOSYSTEM_CONFIG"
    warning "Make sure the application is deployed first"
fi

# Save PM2 process list
log "Saving PM2 process list..."
pm2 save || warning "Failed to save PM2 process list (no processes running yet)"

# Show PM2 status
log "PM2 Status:"
pm2 list

log "✅ PM2 setup completed!"
log ""
info "Useful PM2 commands:"
info "  pm2 list                    - List all processes"
info "  pm2 logs christina-sings4you-api - View logs"
info "  pm2 monit                   - Monitor processes"
info "  pm2 restart christina-sings4you-api - Restart process"
info "  pm2 stop christina-sings4you-api    - Stop process"
info "  pm2 delete christina-sings4you-api  - Delete process"
info "  pm2 save                    - Save process list"
info "  pm2 resurrect               - Restore saved processes"
