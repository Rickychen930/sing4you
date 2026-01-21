#!/bin/bash

# Full Server Setup Script for christina-sings4you.com.au
# This script sets up the entire server environment from scratch

set -e

SERVER_IP="76.13.96.198"
APP_DIR="/var/www/christina-sings4you"
APP_USER="www-data"

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

log "Starting full server setup for christina-sings4you.com.au..."

# Update system packages
log "Updating system packages..."
apt-get update -qq || warning "Failed to update packages"
apt-get upgrade -y -qq || warning "Failed to upgrade packages"

# Install Node.js (if not installed)
if ! command -v node &> /dev/null; then
    log "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - || error "Failed to setup Node.js repository"
    apt-get install -y nodejs || error "Failed to install Node.js"
    log "✅ Node.js installed: $(node --version)"
else
    log "Node.js is already installed: $(node --version)"
fi

# Install npm (if not installed)
if ! command -v npm &> /dev/null; then
    log "Installing npm..."
    apt-get install -y npm || error "Failed to install npm"
    log "✅ npm installed: $(npm --version)"
else
    log "npm is already installed: $(npm --version)"
fi

# Install PM2
if ! command -v pm2 &> /dev/null; then
    log "Installing PM2..."
    npm install -g pm2@latest || error "Failed to install PM2"
    log "✅ PM2 installed: $(pm2 --version)"
else
    log "PM2 is already installed: $(pm2 --version)"
fi

# Install Nginx (if not installed)
if ! command -v nginx &> /dev/null; then
    log "Installing Nginx..."
    apt-get install -y nginx || error "Failed to install Nginx"
    systemctl enable nginx || warning "Failed to enable Nginx"
    log "✅ Nginx installed"
else
    log "Nginx is already installed"
fi

# Install Git (if not installed)
if ! command -v git &> /dev/null; then
    log "Installing Git..."
    apt-get install -y git || error "Failed to install Git"
    log "✅ Git installed"
else
    log "Git is already installed"
fi

# Install build essentials (for native modules)
log "Installing build essentials..."
apt-get install -y build-essential python3 || warning "Failed to install build essentials"

# Create application directory
log "Creating application directory..."
mkdir -p "$APP_DIR"
chown -R $APP_USER:$APP_USER "$APP_DIR"
chmod -R 755 "$APP_DIR"
log "✅ Application directory created: $APP_DIR"

# Create log directories
log "Creating log directories..."
mkdir -p /var/log/pm2
mkdir -p "$APP_DIR/logs"
chmod -R 755 /var/log/pm2
chmod -R 755 "$APP_DIR/logs"
log "✅ Log directories created"

# Setup PM2 startup
log "Setting up PM2 startup..."
pm2 startup systemd -u root --hp /root || warning "PM2 startup already configured"

# Setup firewall (UFW)
if command -v ufw &> /dev/null; then
    log "Configuring firewall..."
    ufw allow 22/tcp || true  # SSH
    ufw allow 80/tcp || true  # HTTP
    ufw allow 443/tcp || true # HTTPS
    ufw --force enable || warning "Firewall configuration failed"
    log "✅ Firewall configured"
fi

# Display system information
log "System setup completed!"
log ""
info "System Information:"
info "  Node.js: $(node --version)"
info "  npm: $(npm --version)"
info "  PM2: $(pm2 --version)"
info "  Application Directory: $APP_DIR"
info ""
info "Next steps:"
info "1. Deploy your application code to $APP_DIR"
info "2. Create .env file: $APP_DIR/.env"
info "3. Install dependencies: cd $APP_DIR && npm ci --production"
info "4. Build application: npm run build && npm run build:server"
info "5. Start with PM2: pm2 start $APP_DIR/deployment/pm2/ecosystem.config.cjs --env production"
info "6. Save PM2: pm2 save"
info "7. Setup Nginx configuration (see deployment/nginx/)"
info "8. Setup SSL certificate (Let's Encrypt)"
