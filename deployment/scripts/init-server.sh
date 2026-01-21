#!/bin/bash

# Script untuk inisialisasi awal server
# Membuat direktori dan setup dasar sebelum deployment
# Usage: sudo ./init-server.sh

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
LOG_DIR="/var/log/pm2"
BACKUP_DIR="/backup/christina-sings4you"

log "Initializing server for christina-sings4you.com.au..."

# Create application directory
log "Creating application directory: $APP_DIR"
mkdir -p "$APP_DIR"
chown -R www-data:www-data "$APP_DIR"
chmod -R 755 "$APP_DIR"
log "✓ Application directory created"

# Create log directory
log "Creating log directory: $LOG_DIR"
mkdir -p "$LOG_DIR"
chown -R www-data:www-data "$LOG_DIR"
chmod -R 755 "$LOG_DIR"
log "✓ Log directory created"

# Create backup directory
log "Creating backup directory: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"
chown -R root:root "$BACKUP_DIR"
chmod 755 "$BACKUP_DIR"
log "✓ Backup directory created"

# Create .env file placeholder
if [ ! -f "$APP_DIR/.env" ]; then
    log "Creating .env file template..."
    cat > "$APP_DIR/.env" << 'EOF'
# Production Environment Variables
# Update with your actual values

NODE_ENV=production
PORT=3001
CLIENT_URL=https://christina-sings4you.com.au
SITE_URL=https://christina-sings4you.com.au

# MongoDB Configuration
MONGODB_URI=mongodb+srv://sings4you:YOUR_PASSWORD@sings4you.qahkyi2.mongodb.net/christinasings4u?retryWrites=true&w=majority

# JWT Configuration
# Generate secrets with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=CHANGE_THIS_TO_A_SECURE_RANDOM_STRING
JWT_REFRESH_SECRET=CHANGE_THIS_TO_A_SECURE_RANDOM_STRING
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# SMTP (Optional)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
EOF
    chmod 600 "$APP_DIR/.env"
    chown www-data:www-data "$APP_DIR/.env"
    log "✓ .env file template created"
    warning "⚠️  IMPORTANT: Update $APP_DIR/.env with your actual values!"
else
    log "✓ .env file already exists"
fi

log ""
log "Server initialization completed!"
log ""
info "Next steps:"
info "1. Upload application files to $APP_DIR"
info "2. Update $APP_DIR/.env with your actual values"
info "3. Run: sudo ./deployment/scripts/setup-server.sh (for full server setup)"
info "4. Or run: sudo ./deployment/scripts/deploy.sh (if files already uploaded)"
