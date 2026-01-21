#!/bin/bash

# Health check script for christina-sings4you.com.au
# Usage: ./health-check.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check() {
    local name=$1
    local command=$2
    
    echo -n "Checking $name... "
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
        return 0
    else
        echo -e "${RED}✗${NC}"
        return 1
    fi
}

echo "=== Health Check for christina-sings4you.com.au ==="
echo ""

# Check PM2
if command -v pm2 &> /dev/null; then
    check "PM2 process running" "pm2 list | grep -q 'christina-sings4you-api.*online'"
    check "PM2 process not errored" "pm2 list | grep -q 'christina-sings4you-api' | grep -v 'errored'"
else
    check "Systemd service running" "systemctl is-active --quiet christina-sings4you"
fi

# Check Nginx
check "Nginx running" "systemctl is-active --quiet nginx"
check "Nginx config valid" "nginx -t"

# Check backend API
check "Backend API responding" "curl -f http://localhost:3001/api/hero > /dev/null 2>&1"

# Check SSL certificate
check "SSL certificate valid" "certbot certificates | grep -q 'christina-sings4you.com.au'"

# Check disk space
DISK_USAGE=$(df -h /var/www/christina-sings4you | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 90 ]; then
    echo -e "Disk usage: ${GREEN}${DISK_USAGE}%${NC} ✓"
else
    echo -e "Disk usage: ${RED}${DISK_USAGE}%${NC} ✗ (Warning: >90%)"
fi

# Check memory
if command -v pm2 &> /dev/null; then
    echo ""
    echo "PM2 Process Status:"
    pm2 list | grep christina-sings4you-api
fi

echo ""
echo "=== Health Check Complete ==="
