#!/bin/bash

# Deploy sing4you application to production server
# Usage: ./deploy-to-server.sh [server_ip] [server_user]
# Example: ./deploy-to-server.sh 76.13.96.198 root

set -e

# Configuration
SERVER_IP=${1:-76.13.96.198}
SERVER_USER=${2:-root}
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

# Check if .env exists locally
if [ ! -f "$LOCAL_DIR/.env" ]; then
    warning ".env file not found in local directory"
    warning "Make sure to create .env file before deployment"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

log "Starting deployment to server: $SERVER_USER@$SERVER_IP"
log "Local directory: $LOCAL_DIR"
log "Remote directory: $APP_DIR"

# Test SSH connection
log "Testing SSH connection..."
if ! ssh -o ConnectTimeout=5 -o BatchMode=yes "$SERVER_USER@$SERVER_IP" exit 2>/dev/null; then
    error "Cannot connect to server. Please check:"
    error "  1. SSH key is set up"
    error "  2. Server IP is correct: $SERVER_IP"
    error "  3. User has access: $SERVER_USER"
fi
log "✅ SSH connection successful"

# Check Node.js version
log "Checking Node.js version..."
NODE_VERSION=$(node --version | sed 's/v//')
NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d'.' -f1)
NODE_MINOR=$(echo "$NODE_VERSION" | cut -d'.' -f2)

if [ "$NODE_MAJOR" -lt 20 ] || ([ "$NODE_MAJOR" -eq 20 ] && [ "$NODE_MINOR" -lt 19 ]); then
    error "Node.js version $NODE_VERSION is too old. Vite 7+ requires Node.js 20.19+ or 22.12+"
    error "Please upgrade Node.js: https://nodejs.org/"
fi

log "✅ Node.js version: $NODE_VERSION (compatible)"

# Build application locally
log "Building application locally..."
cd "$LOCAL_DIR" || error "Failed to change to local directory"

if [ ! -d "node_modules" ]; then
    log "Installing dependencies..."
    npm ci || error "Failed to install dependencies"
fi

log "Building frontend..."
npm run build || error "Frontend build failed"

log "Building backend..."
npm run build:server || error "Backend build failed"

log "✅ Build completed successfully"

# Create deployment package (exclude unnecessary files)
log "Creating deployment package..."
TEMP_DIR=$(mktemp -d)
DEPLOY_PACKAGE="$TEMP_DIR/sing4you-deploy.tar.gz"

tar -czf "$DEPLOY_PACKAGE" \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.gitignore' \
    --exclude='src' \
    --exclude='*.md' \
    --exclude='.env' \
    --exclude='.env.*' \
    --exclude='*.log' \
    --exclude='dist/client' \
    --exclude='deployment/scripts' \
    --exclude='deployment/*.md' \
    --exclude='deployment/nginx' \
    --exclude='deployment/systemd' \
    -C "$LOCAL_DIR" \
    . || error "Failed to create deployment package"

log "✅ Deployment package created: $(du -h "$DEPLOY_PACKAGE" | cut -f1)"

# Upload to server
log "Uploading to server..."
scp "$DEPLOY_PACKAGE" "$SERVER_USER@$SERVER_IP:/tmp/sing4you-deploy.tar.gz" || error "Failed to upload package"

# Cleanup local temp file
rm -f "$DEPLOY_PACKAGE"
rmdir "$TEMP_DIR" 2>/dev/null || true

# Extract on server
log "Extracting on server..."
ssh "$SERVER_USER@$SERVER_IP" << EOF
    set -e
    
    # Create app directory if it doesn't exist
    mkdir -p $APP_DIR
    
    # Backup existing .env if it exists
    if [ -f "$APP_DIR/.env" ]; then
        echo "Backing up existing .env file..."
        cp "$APP_DIR/.env" "$APP_DIR/.env.backup.\$(date +%Y%m%d-%H%M%S)"
    fi
    
    # Extract package
    cd $APP_DIR
    tar -xzf /tmp/sing4you-deploy.tar.gz
    
    # Cleanup
    rm -f /tmp/sing4you-deploy.tar.gz
    
    echo "✅ Package extracted successfully"
EOF

# Upload .env file if it exists locally
if [ -f "$LOCAL_DIR/.env" ]; then
    log "Uploading .env file..."
    scp "$LOCAL_DIR/.env" "$SERVER_USER@$SERVER_IP:$APP_DIR/.env" || warning "Failed to upload .env file"
    ssh "$SERVER_USER@$SERVER_IP" "chmod 600 $APP_DIR/.env && chown root:root $APP_DIR/.env"
    log "✅ .env file uploaded"
else
    warning ".env file not found. Make sure to create it on the server:"
    warning "  ssh $SERVER_USER@$SERVER_IP"
    warning "  nano $APP_DIR/.env"
fi

# Run deployment script on server
log "Running deployment script on server..."
ssh "$SERVER_USER@$SERVER_IP" << EOF
    set -e
    cd $APP_DIR
    
    # Install production dependencies
    if [ ! -d "node_modules" ]; then
        echo "Installing production dependencies..."
        npm ci --production --no-audit --no-fund
    else
        echo "Updating dependencies..."
        npm ci --production --no-audit --no-fund
    fi
    
    # Set permissions
    chown -R root:root $APP_DIR
    chmod -R 755 $APP_DIR
    chmod 600 $APP_DIR/.env 2>/dev/null || true
    
    # Check Node.js version on server
    NODE_VERSION=\$(node --version | sed 's/v//')
    NODE_MAJOR=\$(echo "\$NODE_VERSION" | cut -d'.' -f1)
    NODE_MINOR=\$(echo "\$NODE_VERSION" | cut -d'.' -f2)
    
    if [ "\$NODE_MAJOR" -lt 20 ] || ([ "\$NODE_MAJOR" -eq 20 ] && [ "\$NODE_MINOR" -lt 19 ]); then
        echo "⚠️  Warning: Node.js version \$NODE_VERSION is too old. Upgrading to Node.js 20.x..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y -qq nodejs
        echo "✅ Node.js upgraded to: \$(node --version)"
    fi
    
    # Setup PM2 if not already running
    if ! command -v pm2 &> /dev/null; then
        echo "Installing PM2..."
        npm install -g pm2@latest
        pm2 startup systemd -u root --hp /root || true
    fi
    
    # Create log directory
    mkdir -p /var/log/pm2
    chmod 755 /var/log/pm2
    
    # Start or restart PM2 process
    if pm2 list | grep -q "christina-sings4you-api"; then
        echo "Restarting PM2 process..."
        pm2 restart christina-sings4you-api --update-env
    else
        echo "Starting PM2 process..."
        pm2 start deployment/pm2/ecosystem.config.cjs --env production
    fi
    
    pm2 save
    
    echo "✅ Deployment completed on server"
EOF

# Health check
log "Performing health check..."
sleep 5

MAX_RETRIES=5
RETRY_COUNT=0
HEALTH_CHECK_PASSED=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if ssh "$SERVER_USER@$SERVER_IP" "curl -f -s http://localhost:3001/api/health > /dev/null 2>&1"; then
        HEALTH_CHECK_PASSED=true
        log "✅ Health check passed!"
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    log "Health check attempt $RETRY_COUNT/$MAX_RETRIES failed, retrying..."
    sleep 3
done

if [ "$HEALTH_CHECK_PASSED" = false ]; then
    warning "Health check failed. Please check server logs:"
    warning "  ssh $SERVER_USER@$SERVER_IP"
    warning "  pm2 logs christina-sings4you-api"
else
    log "✅ Deployment completed successfully!"
    log "Application should be available at: https://christina-sings4you.com.au"
fi
