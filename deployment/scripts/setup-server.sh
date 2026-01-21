#!/bin/bash

# Initial server setup script for christina-sings4you.com.au
# Run this script once on a fresh server
# Usage: sudo ./setup-server.sh

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

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    error "Please run as root (use sudo)"
fi

log "Starting server setup for christina-sings4you.com.au"

# Update system
log "Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 18.x
log "Installing Node.js 18.x..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
else
    log "Node.js already installed: $(node --version)"
fi

# Install Nginx
log "Installing Nginx..."
apt install -y nginx

# Install PM2
log "Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
else
    log "PM2 already installed"
fi

# Install Certbot
log "Installing Certbot..."
apt install -y certbot python3-certbot-nginx

# Install Git
log "Installing Git..."
apt install -y git

# Install build tools
log "Installing build tools..."
apt install -y build-essential

# Install UFW firewall
log "Installing and configuring firewall..."
apt install -y ufw
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Create directories
log "Creating application directories..."
mkdir -p /var/www/christina-sings4you
mkdir -p /var/log/pm2
mkdir -p /backup/christina-sings4you

# Set permissions
chown -R www-data:www-data /var/www/christina-sings4you
chown -R www-data:www-data /var/log/pm2
chmod -R 755 /var/www/christina-sings4you

# Create log rotation for PM2
log "Setting up log rotation..."
cat > /etc/logrotate.d/pm2 << EOF
/var/log/pm2/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

log "Server setup completed successfully!"
log ""
log "Next steps:"
log "1. Upload your application files to /var/www/christina-sings4you"
log "2. Copy deployment/nginx/christina-sings4you.com.au.conf to /etc/nginx/sites-available/"
log "3. Enable the site: ln -s /etc/nginx/sites-available/christina-sings4you.com.au /etc/nginx/sites-enabled/"
log "4. Set up SSL: certbot --nginx -d christina-sings4you.com.au -d www.christina-sings4you.com.au"
log "5. Configure .env file with your production values"
log "6. Build and start the application"
log ""
log "See DEPLOYMENT_GUIDE.md for detailed instructions."
