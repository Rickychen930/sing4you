#!/bin/bash

# Debug script for 401 Unauthorized errors
# Usage: ./debug-401.sh

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
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

APP_DIR="/var/www/christina-sings4you"
ENV_FILE="$APP_DIR/.env"

log "Starting 401 Error Debugging..."
echo ""

# Check if running on server
if [ ! -d "$APP_DIR" ]; then
    error "This script should be run on the server!"
    error "Application directory not found: $APP_DIR"
    exit 1
fi

# 1. Check JWT Secrets
info "1. Checking JWT Secrets..."
if [ -f "$ENV_FILE" ]; then
    JWT_SECRET=$(grep "^JWT_SECRET=" "$ENV_FILE" | cut -d '=' -f2- | tr -d '"' | tr -d "'")
    JWT_REFRESH_SECRET=$(grep "^JWT_REFRESH_SECRET=" "$ENV_FILE" | cut -d '=' -f2- | tr -d '"' | tr -d "'")
    
    if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "your-secret-key-change-in-production" ] || [ "$JWT_SECRET" = "CHANGE_THIS_TO_A_SECURE_RANDOM_STRING" ]; then
        error "JWT_SECRET is not set or using default value!"
        warning "Generate new secret with:"
        echo "  JWT_SECRET=\$(node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\")"
        echo "  echo \"JWT_SECRET=\$JWT_SECRET\" >> $ENV_FILE"
    else
        log "✅ JWT_SECRET is set (length: ${#JWT_SECRET})"
    fi
    
    if [ -z "$JWT_REFRESH_SECRET" ] || [ "$JWT_REFRESH_SECRET" = "your-refresh-secret-key-change-in-production" ] || [ "$JWT_REFRESH_SECRET" = "CHANGE_THIS_TO_A_SECURE_RANDOM_STRING" ]; then
        error "JWT_REFRESH_SECRET is not set or using default value!"
        warning "Generate new secret with:"
        echo "  JWT_REFRESH_SECRET=\$(node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\")"
        echo "  echo \"JWT_REFRESH_SECRET=\$JWT_REFRESH_SECRET\" >> $ENV_FILE"
    else
        log "✅ JWT_REFRESH_SECRET is set (length: ${#JWT_REFRESH_SECRET})"
    fi
else
    error ".env file not found: $ENV_FILE"
fi

echo ""

# 2. Check Environment Variables
info "2. Checking Environment Variables..."
if [ -f "$ENV_FILE" ]; then
    NODE_ENV=$(grep "^NODE_ENV=" "$ENV_FILE" | cut -d '=' -f2- | tr -d '"' | tr -d "'")
    CLIENT_URL=$(grep "^CLIENT_URL=" "$ENV_FILE" | cut -d '=' -f2- | tr -d '"' | tr -d "'")
    
    if [ -z "$NODE_ENV" ]; then
        warning "NODE_ENV is not set (defaulting to development)"
    else
        log "✅ NODE_ENV=$NODE_ENV"
    fi
    
    if [ -z "$CLIENT_URL" ]; then
        warning "CLIENT_URL is not set"
    else
        log "✅ CLIENT_URL=$CLIENT_URL"
    fi
fi

echo ""

# 3. Check Server Status
info "3. Checking Server Status..."
if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "christina-sings4you-api"; then
        STATUS=$(pm2 jlist | jq -r '.[] | select(.name=="christina-sings4you-api") | .pm2_env.status' 2>/dev/null || echo "unknown")
        if [ "$STATUS" = "online" ]; then
            log "✅ PM2 process is running"
        else
            error "PM2 process status: $STATUS"
            warning "Restart with: pm2 restart christina-sings4you-api"
        fi
    else
        error "PM2 process 'christina-sings4you-api' not found!"
        warning "Start with: pm2 start deployment/pm2/ecosystem.config.cjs"
    fi
else
    warning "PM2 not found, checking systemd..."
    if systemctl is-active --quiet christina-sings4you; then
        log "✅ Systemd service is running"
    else
        error "Systemd service is not running"
    fi
fi

echo ""

# 4. Check Port 3001
info "4. Checking if port 3001 is listening..."
if netstat -tuln 2>/dev/null | grep -q ":3001 " || ss -tuln 2>/dev/null | grep -q ":3001 "; then
    log "✅ Port 3001 is listening"
else
    error "Port 3001 is not listening!"
    warning "Server may not be running or not listening on port 3001"
fi

echo ""

# 5. Test Health Endpoint
info "5. Testing health endpoint..."
if curl -f -s http://localhost:3001/api/health > /dev/null 2>&1; then
    log "✅ Health endpoint is accessible"
    HEALTH_RESPONSE=$(curl -s http://localhost:3001/api/health)
    echo "   Response: $HEALTH_RESPONSE"
else
    error "Health endpoint is not accessible!"
    warning "Check server logs: pm2 logs christina-sings4you-api"
fi

echo ""

# 6. Check Nginx Configuration
info "6. Checking Nginx configuration..."
if [ -f "/etc/nginx/sites-enabled/christina-sings4you.com.au" ]; then
    log "✅ Nginx site is enabled"
    
    # Check if nginx config is valid
    if nginx -t 2>&1 | grep -q "successful"; then
        log "✅ Nginx configuration is valid"
    else
        error "Nginx configuration has errors!"
        nginx -t
    fi
else
    warning "Nginx site not enabled"
    warning "Enable with: sudo ./deployment/scripts/setup-nginx.sh"
fi

echo ""

# 7. Check Recent Logs for 401 errors
info "7. Checking recent logs for 401 errors..."
if command -v pm2 &> /dev/null && pm2 list | grep -q "christina-sings4you-api"; then
    LOG_OUTPUT=$(pm2 logs christina-sings4you-api --lines 50 --nostream 2>&1 | grep -i "401\|unauthorized\|token" | tail -5)
    if [ -n "$LOG_OUTPUT" ]; then
        warning "Found recent 401/token related errors:"
        echo "$LOG_OUTPUT" | sed 's/^/   /'
    else
        log "✅ No recent 401 errors in logs"
    fi
fi

echo ""

# 8. Check Database Connection
info "8. Checking database connection..."
if [ -f "$ENV_FILE" ]; then
    MONGODB_URI=$(grep "^MONGODB_URI=" "$ENV_FILE" | cut -d '=' -f2- | tr -d '"' | tr -d "'")
    if [ -n "$MONGODB_URI" ]; then
        log "✅ MONGODB_URI is set"
        # Try to check if connection string is valid format
        if echo "$MONGODB_URI" | grep -q "mongodb"; then
            log "   MongoDB URI format looks valid"
        else
            warning "MongoDB URI format may be invalid"
        fi
    else
        error "MONGODB_URI is not set!"
    fi
fi

echo ""

# Summary
log "=== Debug Summary ==="
echo ""
log "Common fixes for 401 errors:"
echo "  1. Generate JWT secrets if missing:"
echo "     JWT_SECRET=\$(node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\")"
echo "     JWT_REFRESH_SECRET=\$(node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\")"
echo "     echo \"JWT_SECRET=\$JWT_SECRET\" >> $ENV_FILE"
echo "     echo \"JWT_REFRESH_SECRET=\$JWT_REFRESH_SECRET\" >> $ENV_FILE"
echo ""
echo "  2. Restart server:"
echo "     pm2 restart christina-sings4you-api"
echo ""
echo "  3. Check browser console for token issues"
echo "  4. Clear localStorage and login again"
echo ""
log "For detailed troubleshooting, see: deployment/TROUBLESHOOTING_401.md"
