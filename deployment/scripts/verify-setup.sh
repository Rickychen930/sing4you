#!/bin/bash

# Enhanced verification script - Check all components
# Usage: ./verify-setup.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASS=0
FAIL=0

check() {
    local name=$1
    local command=$2
    
    echo -n "Checking $name... "
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
        ((PASS++))
        return 0
    else
        echo -e "${RED}✗${NC}"
        ((FAIL++))
        return 1
    fi
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo "=== Setup Verification for christina-sings4you.com.au ==="
echo ""

# 1. Directory checks
info "1. Directory Structure"
check "Application directory exists" "[ -d /var/www/christina-sings4you ]"
check "Log directory exists" "[ -d /var/log/pm2 ]"
check "Backup directory exists" "[ -d /backup/christina-sings4you ]"

# 2. File checks
info ""
info "2. Required Files"
check ".env file exists" "[ -f /var/www/christina-sings4you/.env ]"
check "package.json exists" "[ -f /var/www/christina-sings4you/package.json ]"
check "Nginx config exists" "[ -f /var/www/christina-sings4you/deployment/nginx/christina-sings4you.com.au.conf ]"
check "PM2 config exists" "[ -f /var/www/christina-sings4you/deployment/pm2/ecosystem.config.cjs ]"

# 3. Software checks
info ""
info "3. Software Installation"
check "Node.js installed" "command -v node"
check "Nginx installed" "command -v nginx"
check "PM2 installed" "command -v pm2"
check "Git installed" "command -v git"
check "Certbot installed" "command -v certbot"

# 4. Service checks
info ""
info "4. Services"
if command -v pm2 &> /dev/null; then
    check "PM2 process running" "pm2 list | grep -q 'christina-sings4you-api.*online'"
else
    check "Systemd service running" "systemctl is-active --quiet christina-sings4you"
fi
check "Nginx running" "systemctl is-active --quiet nginx"

# 5. Configuration checks
info ""
info "5. Configuration"
check "Nginx config valid" "nginx -t"
check "Nginx site enabled" "[ -L /etc/nginx/sites-enabled/christina-sings4you.com.au ]"

# 6. Network checks
info ""
info "6. Network & Connectivity"
check "Backend API responding" "curl -f http://localhost:3001/api/hero > /dev/null 2>&1"
check "Port 3001 listening" "netstat -tuln | grep -q ':3001'"

# 7. SSL checks
info ""
info "7. SSL Certificate"
if certbot certificates 2>/dev/null | grep -q 'christina-sings4you.com.au'; then
    check "SSL certificate exists" "certbot certificates | grep -q 'christina-sings4you.com.au'"
    CERT_EXPIRY=$(certbot certificates 2>/dev/null | grep -A 3 'christina-sings4you.com.au' | grep 'Expiry Date' | awk '{print $3, $4, $5}')
    if [ ! -z "$CERT_EXPIRY" ]; then
        info "   Certificate expires: $CERT_EXPIRY"
    fi
else
    warning "   SSL certificate not found. Run: certbot --nginx -d christina-sings4you.com.au"
fi

# 8. Permissions checks
info ""
info "8. Permissions"
check "App directory owned by www-data" "[ \$(stat -c '%U:%G' /var/www/christina-sings4you) = 'www-data:www-data' ]"
check ".env file permissions (600)" "[ \$(stat -c '%a' /var/www/christina-sings4you/.env) = '600' ]"

# 9. Disk space
info ""
info "9. Disk Space"
DISK_USAGE=$(df -h /var/www/christina-sings4you | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 90 ]; then
    echo -e "Disk usage: ${GREEN}${DISK_USAGE}%${NC} ✓"
    ((PASS++))
else
    echo -e "Disk usage: ${RED}${DISK_USAGE}%${NC} ✗ (Warning: >90%)"
    ((FAIL++))
fi

# 10. Environment variables
info ""
info "10. Environment Variables"
if [ -f /var/www/christina-sings4you/.env ]; then
    source /var/www/christina-sings4you/.env
    [ ! -z "$MONGODB_URI" ] && ! [[ "$MONGODB_URI" == *"<db_password>"* ]] && echo "MONGODB_URI: ${GREEN}✓${NC}" || echo "MONGODB_URI: ${RED}✗${NC} (not configured)"
    [ ! -z "$JWT_SECRET" ] && [[ "$JWT_SECRET" != "CHANGE_THIS"* ]] && echo "JWT_SECRET: ${GREEN}✓${NC}" || echo "JWT_SECRET: ${RED}✗${NC} (not configured)"
    [ ! -z "$JWT_REFRESH_SECRET" ] && [[ "$JWT_REFRESH_SECRET" != "CHANGE_THIS"* ]] && echo "JWT_REFRESH_SECRET: ${GREEN}✓${NC}" || echo "JWT_REFRESH_SECRET: ${RED}✗${NC} (not configured)"
fi

# Summary
echo ""
echo "=== Summary ==="
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some checks failed. Please review above.${NC}"
    exit 1
fi
