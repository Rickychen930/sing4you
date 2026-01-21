#!/bin/bash

# Script untuk membuat .env file di server
# Usage: Jalankan di server SSH

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

APP_DIR="/var/www/christina-sings4you"
ENV_FILE="$APP_DIR/.env"

log "Membuat .env file di server..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    error "Please run as root (use sudo)"
fi

# Generate secure JWT secrets
log "Generating secure JWT secrets..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Create .env file
log "Creating .env file..."
cat > "$ENV_FILE" << EOF
# Production Environment Variables
# Generated on $(date)

# Server Configuration
NODE_ENV=production
PORT=3001
CLIENT_URL=https://christina-sings4you.com.au
SITE_URL=https://christina-sings4you.com.au

# Database Configuration
# MongoDB Atlas Connection String
# IMPORTANT: Replace <db_password> with your actual MongoDB Atlas password
MONGODB_URI=mongodb+srv://sings4you:<db_password>@sings4you.qahkyi2.mongodb.net/christinasings4u?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary Configuration (Optional - for media uploads)
# If not using Cloudinary, leave these empty
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email Configuration (Optional - if using contact form)
# SMTP_HOST=
# SMTP_PORT=587
# SMTP_USER=
# SMTP_PASS=
# SMTP_FROM=
EOF

# Set permissions
chmod 600 "$ENV_FILE"
chown www-data:www-data "$ENV_FILE"

log "✓ .env file created successfully!"
log ""
warning "⚠️  IMPORTANT: Update MONGODB_URI in .env file:"
warning "   sudo nano $ENV_FILE"
warning "   Replace <db_password> with your actual MongoDB Atlas password"
log ""
info "Generated JWT secrets:"
info "  JWT_SECRET: ${JWT_SECRET:0:20}..."
info "  JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET:0:20}..."
log ""
info "After updating MONGODB_URI, restart PM2:"
info "   pm2 restart christina-sings4you-api"
