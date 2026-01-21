#!/bin/bash

# Script untuk setup server agar siap untuk GitHub Actions deployment
# Usage: sudo ./setup-github-actions.sh

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

log "Setting up server for GitHub Actions deployment..."

# Ensure app directory exists
if [ ! -d "$APP_DIR" ]; then
    log "Creating application directory..."
    mkdir -p "$APP_DIR"
fi

# Set permissions
log "Setting permissions..."
chown -R www-data:www-data "$APP_DIR"
chmod -R 755 "$APP_DIR"

# Ensure deployment scripts are executable
if [ -d "$APP_DIR/deployment/scripts" ]; then
    log "Making deployment scripts executable..."
    chmod +x "$APP_DIR/deployment/scripts"/*.sh
fi

# Setup sudoers for www-data to run deploy script without password
log "Setting up sudoers for deployment..."
SUDOERS_FILE="/etc/sudoers.d/christina-sings4you-deploy"

cat > "$SUDOERS_FILE" << 'EOF'
# Allow www-data to run deployment scripts without password
www-data ALL=(ALL) NOPASSWD: /var/www/christina-sings4you/deployment/scripts/deploy.sh
www-data ALL=(ALL) NOPASSWD: /var/www/christina-sings4you/deployment/scripts/backup.sh
www-data ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart christina-sings4you
www-data ALL=(ALL) NOPASSWD: /usr/bin/systemctl reload nginx
www-data ALL=(ALL) NOPASSWD: /usr/bin/nginx -t
EOF

chmod 440 "$SUDOERS_FILE"

# Or, if using root user for deployment, ensure SSH key is set up
log "SSH key setup instructions:"
info "1. Generate SSH key on your local machine:"
info "   ssh-keygen -t ed25519 -C 'github-actions' -f ~/.ssh/github_actions_deploy"
info ""
info "2. Copy public key to server:"
info "   ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@76.13.96.198"
info ""
info "3. Add private key to GitHub Secrets as SSH_PRIVATE_KEY"
info "   cat ~/.ssh/github_actions_deploy"

# Ensure rsync is installed
if ! command -v rsync &> /dev/null; then
    log "Installing rsync..."
    apt update && apt install -y rsync
fi

# Ensure directories exist
log "Creating necessary directories..."
mkdir -p /backup/christina-sings4you
mkdir -p /var/log/pm2
chown -R www-data:www-data /backup/christina-sings4you
chown -R www-data:www-data /var/log/pm2

log "Server setup for GitHub Actions completed!"
log ""
info "Next steps:"
info "1. Setup GitHub Secrets in repository settings"
info "2. Test deployment by pushing to master branch"
info "3. Monitor deployment in GitHub Actions tab"
