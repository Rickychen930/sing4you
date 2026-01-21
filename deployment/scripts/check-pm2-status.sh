#!/bin/bash

# Check PM2 status on remote server
# Usage: ./check-pm2-status.sh [server_ip] [server_user]

set -e

SERVER_IP=${1:-76.13.96.198}
SERVER_USER=${2:-root}

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Checking PM2 status on ${SERVER_USER}@${SERVER_IP}...${NC}"
echo ""

# Check PM2 status
ssh "$SERVER_USER@$SERVER_IP" << 'EOF'
    echo "=== PM2 Process List ==="
    pm2 list
    echo ""
    
    # Check if process exists
    if pm2 list | grep -q "christina-sings4you-api"; then
        echo "=== Process Details ==="
        pm2 describe christina-sings4you-api
        echo ""
        
        echo "=== Recent Logs (Last 20 lines) ==="
        pm2 logs christina-sings4you-api --lines 20 --nostream
        echo ""
        
        echo "=== Memory & CPU Usage ==="
        pm2 monit --no-interaction &
        MONIT_PID=$!
        sleep 2
        kill $MONIT_PID 2>/dev/null || true
    else
        echo -e "\033[1;33m⚠️  Process 'christina-sings4you-api' is not running\033[0m"
        echo ""
        echo "To start the process:"
        echo "  cd /var/www/christina-sings4you"
        echo "  pm2 start deployment/pm2/ecosystem.config.cjs --env production"
    fi
    
    echo ""
    echo "=== System Resources ==="
    echo "Memory:"
    free -h
    echo ""
    echo "Disk:"
    df -h / | tail -1
    echo ""
    echo "Port 3001:"
    netstat -tuln | grep 3001 || echo "Port 3001 is not listening"
EOF

echo ""
echo -e "${GREEN}Status check completed!${NC}"
