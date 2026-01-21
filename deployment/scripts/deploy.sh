#!/bin/bash

# Deployment script for christina-sings4you.com.au
# Usage: ./deploy.sh [production|staging]

set -e  # Exit on error

ENVIRONMENT=${1:-production}
APP_DIR="/var/www/christina-sings4you"
LOG_FILE="/var/log/christina-sings4you-deploy.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    error "Please run as root (use sudo)"
fi

log "Starting deployment for environment: $ENVIRONMENT"

# Navigate to application directory
cd "$APP_DIR" || error "Application directory not found: $APP_DIR"

# Backup current version
log "Creating backup..."
BACKUP_DIR="/backup/christina-sings4you"
mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz" \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    . || warning "Backup failed, continuing..."

# Pull latest code (if using git)
if [ -d ".git" ]; then
    log "Pulling latest code..."
    # Stash local changes if any
    git stash || true
    git pull origin master || warning "Git pull failed, continuing with existing code..."
else
    log "Not a git repository, skipping git pull..."
fi

# Install dependencies
log "Installing dependencies..."
npm ci --production --no-audit --no-fund || error "Failed to install dependencies"

# Check if build files exist (from CI/CD)
if [ -d "dist" ] && [ -d "dist/client" ] && [ -d "dist/server" ]; then
    log "Build files found from CI/CD, skipping build..."
else
    warning "Build files not found, attempting to build on server..."
    # Install dev dependencies for building
    log "Installing dev dependencies for build..."
    npm ci --no-audit --no-fund || error "Failed to install dev dependencies"
    
    # Build frontend
    log "Building frontend..."
    npm run build || error "Frontend build failed"
    
    # Build backend
    log "Building backend..."
    npm run build:server || error "Backend build failed"
    
    # Remove dev dependencies after build to save space
    log "Removing dev dependencies..."
    npm prune --production || warning "Failed to remove dev dependencies"
fi

# Set permissions
log "Setting permissions..."
chown -R www-data:www-data "$APP_DIR"
chmod -R 755 "$APP_DIR"

# Restart services
log "Restarting services..."

# Check if using PM2
if command -v pm2 &> /dev/null; then
    log "Restarting with PM2..."
    
    # Check if process exists
    if pm2 list | grep -q "christina-sings4you-api"; then
        log "Process exists, restarting..."
        pm2 restart christina-sings4you-api --update-env || error "Failed to restart PM2 process"
    else
        log "Process not found, starting new instance..."
        pm2 start deployment/pm2/ecosystem.config.cjs --env production || error "Failed to start PM2 process"
    fi
    
    # Wait a bit for PM2 to start processes
    sleep 3
    
    pm2 save || warning "Failed to save PM2 process list"
    
    # Show PM2 status
    log "PM2 Process Status:"
    pm2 list
    
    # Show recent logs to help debug
    log "Recent PM2 logs (last 10 lines):"
    pm2 logs christina-sings4you-api --lines 10 --nostream || warning "Could not retrieve PM2 logs"
else
    # Fallback to systemd
    log "PM2 not found, trying systemd..."
    if systemctl is-active --quiet christina-sings4you; then
        systemctl restart christina-sings4you || error "Failed to restart systemd service"
    else
        log "Systemd service not active, starting..."
        systemctl start christina-sings4you || error "Failed to start systemd service"
    fi
fi

# Reload Nginx
log "Reloading Nginx..."
nginx -t && systemctl reload nginx || error "Nginx reload failed"

# Health check
log "Performing health check..."
log "Waiting for server to be ready..."
sleep 10  # Give server more time to start

MAX_RETRIES=5
RETRY_COUNT=0
HEALTH_CHECK_PASSED=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    # Try health endpoint first (simpler, more reliable)
    if curl -f -s http://localhost:3001/api/health > /dev/null 2>&1; then
        HEALTH_CHECK_PASSED=true
        log "Health check passed using /api/health endpoint!"
        break
    fi
    
    # Fallback to /api/hero if health endpoint not available
    if curl -f -s http://localhost:3001/api/hero > /dev/null 2>&1; then
        HEALTH_CHECK_PASSED=true
        log "Health check passed using /api/hero endpoint!"
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    
    # Get more details about the failure
    log "Health check attempt $RETRY_COUNT/$MAX_RETRIES failed, retrying..."
    
    # Check if server is listening on port 3001
    if ! netstat -tuln | grep -q ":3001 "; then
        log "Warning: Port 3001 is not listening. Server may not have started."
    fi
    
    # Check PM2 logs for errors
    if command -v pm2 &> /dev/null; then
        log "Recent PM2 logs:"
        pm2 logs christina-sings4you-api --lines 5 --nostream || true
    fi
    
    sleep 3  # Increased wait time between retries
done

if [ "$HEALTH_CHECK_PASSED" = true ]; then
    log "✅ Health check passed!"
else
    error "Health check failed after $MAX_RETRIES attempts! Check logs for details."
    log "Troubleshooting:"
    log "1. Check PM2 logs: pm2 logs christina-sings4you-api"
    log "2. Check if port 3001 is listening: netstat -tuln | grep 3001"
    log "3. Check server logs in: $APP_DIR/logs/"
    log "4. Verify .env file exists and has correct values"
    exit 1
fi

log "Deployment completed successfully!"
log "Application is live at: https://christina-sings4you.com.au"
