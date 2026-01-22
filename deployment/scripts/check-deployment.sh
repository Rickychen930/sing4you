#!/bin/bash

# =============================================================================
# Deployment Diagnostic Script
# Script untuk mengecek status deployment dan menemukan masalah
# =============================================================================

# Colors untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_DIR="/var/www/christina-sings4you"
APP_NAME="sing4you-api"
BACKEND_PORT=4000

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Deployment Diagnostic Check${NC}"
echo -e "${BLUE}========================================${NC}\n"

# 1. Check project directory
echo -e "${YELLOW}[1] Checking project directory...${NC}"
if [ -d "$PROJECT_DIR" ]; then
    echo -e "${GREEN}✅ Project directory exists: ${PROJECT_DIR}${NC}"
    cd "$PROJECT_DIR"
else
    echo -e "${RED}❌ Project directory not found: ${PROJECT_DIR}${NC}"
    exit 1
fi

# 2. Check backend dist files
echo -e "\n${YELLOW}[2] Checking backend dist files...${NC}"
if [ -f "dist/server/index.js" ]; then
    echo -e "${GREEN}✅ dist/server/index.js exists${NC}"
    ls -lh dist/server/index.js
else
    echo -e "${RED}❌ dist/server/index.js NOT FOUND!${NC}"
    echo -e "${YELLOW}Available files in dist:${NC}"
    ls -la dist/ 2>/dev/null || echo "dist directory does not exist"
    if [ -d "dist/server" ]; then
        echo -e "${YELLOW}Files in dist/server:${NC}"
        ls -la dist/server/
    fi
fi

# 3. Check node_modules
echo -e "\n${YELLOW}[3] Checking node_modules...${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules exists${NC}"
    MODULE_COUNT=$(find node_modules -type d -maxdepth 1 | wc -l)
    echo -e "   Found $MODULE_COUNT modules"
else
    echo -e "${RED}❌ node_modules NOT FOUND!${NC}"
    echo -e "${YELLOW}💡 Run: npm install --production${NC}"
fi

# 4. Check package.json
echo -e "\n${YELLOW}[4] Checking package.json...${NC}"
if [ -f "package.json" ]; then
    echo -e "${GREEN}✅ package.json exists${NC}"
else
    echo -e "${RED}❌ package.json NOT FOUND!${NC}"
fi

# 5. Check .env files
echo -e "\n${YELLOW}[5] Checking .env files...${NC}"
if [ -f "server/.env" ]; then
    echo -e "${GREEN}✅ server/.env exists${NC}"
    ENV_SIZE=$(wc -l < server/.env)
    echo -e "   Contains $ENV_SIZE lines"
elif [ -f ".env.production" ]; then
    echo -e "${YELLOW}⚠️  server/.env not found, but .env.production exists${NC}"
else
    echo -e "${RED}❌ No .env file found!${NC}"
    echo -e "${YELLOW}💡 Create server/.env or .env.production${NC}"
fi

# 6. Check ecosystem.config.js
echo -e "\n${YELLOW}[6] Checking ecosystem.config.js...${NC}"
if [ -f "ecosystem.config.js" ]; then
    echo -e "${GREEN}✅ ecosystem.config.js exists${NC}"
    # Check if app name is correct
    if grep -q "sing4you-api" ecosystem.config.js; then
        echo -e "${GREEN}✅ App name is correct (sing4you-api)${NC}"
    else
        echo -e "${YELLOW}⚠️  App name might be incorrect in ecosystem.config.js${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  ecosystem.config.js not found (will use direct start)${NC}"
fi

# 7. Check PM2 status
echo -e "\n${YELLOW}[7] Checking PM2 status...${NC}"
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}✅ PM2 is installed${NC}"
    PM2_VERSION=$(pm2 -v)
    echo -e "   Version: $PM2_VERSION"
    echo -e "\n${BLUE}PM2 Process List:${NC}"
    pm2 list
    
    if pm2 list | grep -q "$APP_NAME"; then
        echo -e "\n${GREEN}✅ PM2 process '$APP_NAME' found${NC}"
        pm2 describe "$APP_NAME" | head -20
    else
        echo -e "\n${RED}❌ PM2 process '$APP_NAME' NOT RUNNING!${NC}"
        echo -e "${YELLOW}💡 Run: bash deployment/scripts/start-pm2.sh${NC}"
    fi
else
    echo -e "${RED}❌ PM2 is not installed!${NC}"
    echo -e "${YELLOW}💡 Install: npm install -g pm2${NC}"
fi

# 8. Check port 4000
echo -e "\n${YELLOW}[8] Checking port ${BACKEND_PORT}...${NC}"
PORT_PID=$(lsof -ti:${BACKEND_PORT} 2>/dev/null || true)
if [ ! -z "$PORT_PID" ]; then
    echo -e "${GREEN}✅ Port ${BACKEND_PORT} is in use by PID: $PORT_PID${NC}"
    ps -p $PORT_PID -o pid,cmd || true
else
    echo -e "${RED}❌ Port ${BACKEND_PORT} is not in use${NC}"
    echo -e "${YELLOW}💡 Backend server is not running${NC}"
fi

# 9. Check backend health
echo -e "\n${YELLOW}[9] Checking backend health...${NC}"
if curl -f -s http://localhost:${BACKEND_PORT}/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend health check passed${NC}"
    curl -s http://localhost:${BACKEND_PORT}/api/health | head -5
else
    echo -e "${RED}❌ Backend health check failed${NC}"
    echo -e "${YELLOW}💡 Backend might not be running or not responding${NC}"
fi

# 10. Check nginx
echo -e "\n${YELLOW}[10] Checking nginx...${NC}"
if command -v nginx &> /dev/null; then
    echo -e "${GREEN}✅ Nginx is installed${NC}"
    if systemctl is-active --quiet nginx; then
        echo -e "${GREEN}✅ Nginx is running${NC}"
    else
        echo -e "${RED}❌ Nginx is not running${NC}"
        echo -e "${YELLOW}💡 Start: sudo systemctl start nginx${NC}"
    fi
    
    if [ -f "/etc/nginx/sites-available/christina-sings4you.com.au.conf" ]; then
        echo -e "${GREEN}✅ Nginx config file exists${NC}"
        CONFIG_SIZE=$(wc -l < /etc/nginx/sites-available/christina-sings4you.com.au.conf)
        if [ "$CONFIG_SIZE" -lt 10 ]; then
            echo -e "${RED}❌ Nginx config file seems empty or too small ($CONFIG_SIZE lines)${NC}"
        else
            echo -e "   Config file has $CONFIG_SIZE lines"
        fi
    else
        echo -e "${RED}❌ Nginx config file not found${NC}"
    fi
else
    echo -e "${RED}❌ Nginx is not installed${NC}"
fi

# Summary
echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}  Diagnostic Summary${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${YELLOW}Next steps if issues found:${NC}"
echo -e "1. If dist/server/index.js missing: Run deployment workflow"
echo -e "2. If node_modules missing: Run ${GREEN}npm install --production${NC}"
echo -e "3. If .env missing: Create ${GREEN}server/.env${NC} from template"
echo -e "4. If PM2 not running: Run ${GREEN}bash deployment/scripts/start-pm2.sh${NC}"
echo -e "5. If nginx config empty: Run deployment workflow or copy manually"
echo -e "\n${GREEN}✅ Diagnostic check complete!${NC}\n"
