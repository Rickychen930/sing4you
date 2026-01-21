#!/bin/bash

# Complete server initialization script for christina-sings4you.com.au
# This script sets up the entire server environment
# Usage: Run this script on the server as root

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

log "Starting server initialization for christina-sings4you.com.au..."

# Update system
log "Updating system packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get upgrade -y -qq

# Install essential packages
log "Installing essential packages..."
apt-get install -y -qq \
    curl \
    wget \
    git \
    build-essential \
    software-properties-common \
    ufw \
    fail2ban \
    htop \
    nano \
    unzip

# Install Node.js 20.x (required for Vite 7+)
if ! command -v node &> /dev/null; then
    log "Installing Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y -qq nodejs
    log "✅ Node.js installed: $(node --version)"
else
    NODE_VERSION=$(node --version)
    NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -lt 20 ]; then
        warning "Node.js version $NODE_VERSION is too old. Vite 7+ requires Node.js 20.19+ or 22.12+"
        log "Upgrading to Node.js 20.x..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y -qq nodejs
        log "✅ Node.js upgraded to: $(node --version)"
    else
        log "Node.js already installed: $NODE_VERSION"
    fi
fi

# Install Nginx
if ! command -v nginx &> /dev/null; then
    log "Installing Nginx..."
    apt-get install -y -qq nginx
    systemctl enable nginx
    systemctl start nginx
    log "✅ Nginx installed and started"
else
    log "Nginx already installed"
fi

# Install PM2
if ! command -v pm2 &> /dev/null; then
    log "Installing PM2..."
    npm install -g pm2@latest
    pm2 startup systemd -u root --hp /root
    log "✅ PM2 installed and configured"
else
    log "PM2 already installed"
fi

# Create application directory
log "Creating application directory..."
mkdir -p "$APP_DIR"
chmod 755 "$APP_DIR"

# Create log directories
log "Creating log directories..."
mkdir -p /var/log/pm2
mkdir -p "$APP_DIR/logs"
chmod 755 /var/log/pm2
chmod 755 "$APP_DIR/logs"

# Setup firewall
log "Configuring firewall..."
ufw --force enable
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 3001/tcp  # API (optional, if needed externally)
log "✅ Firewall configured"

# Setup fail2ban
log "Configuring fail2ban..."
systemctl enable fail2ban
systemctl start fail2ban
log "✅ Fail2ban configured"

# Create .env template if it doesn't exist
if [ ! -f "$APP_DIR/.env" ]; then
    log "Creating .env template..."
    cat > "$APP_DIR/.env.template" << 'ENVEOF'
# Server Configuration
PORT=3001
NODE_ENV=production
CLIENT_URL=https://christina-sings4you.com.au
SITE_URL=https://christina-sings4you.com.au

# Database Configuration
MONGODB_URI=mongodb+srv://sings4you:<db_password>@sings4you.qahkyi2.mongodb.net/christinasings4u

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary Configuration (Optional)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
ENVEOF
    chmod 600 "$APP_DIR/.env.template"
    warning ".env.template created. Please copy it to .env and fill in the values:"
    warning "  cp $APP_DIR/.env.template $APP_DIR/.env"
    warning "  nano $APP_DIR/.env"
fi

log "✅ Server initialization completed!"
log ""
info "Next steps:"
info "1. Copy .env.template to .env and configure:"
info "   cp $APP_DIR/.env.template $APP_DIR/.env"
info "   nano $APP_DIR/.env"
info ""
info "2. Deploy your application:"
info "   Use deploy-to-server.sh script from your local machine"
info ""
info "3. Setup Nginx configuration:"
info "   See deployment/nginx/ directory for configuration files"
info ""
info "4. Start the application with PM2:"
info "   cd $APP_DIR"
info "   pm2 start deployment/pm2/ecosystem.config.cjs --env production"
info "   pm2 save"
