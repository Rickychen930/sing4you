#!/bin/bash

# =============================================================================
# Manual PM2 Start Script
# Script untuk start PM2 secara manual jika deployment belum berjalan
# =============================================================================

set -e

# Colors untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Konfigurasi
PROJECT_DIR="/var/www/christina-sings4you"
APP_NAME="sing4you-api"
PM2_CONFIG="${PROJECT_DIR}/ecosystem.config.js"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Manual PM2 Start untuk ${APP_NAME}${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}❌ Error: Project directory tidak ditemukan: ${PROJECT_DIR}${NC}"
    exit 1
fi

cd "$PROJECT_DIR"

# Check if dist/server/index.js exists
if [ ! -f "dist/server/index.js" ]; then
    echo -e "${RED}❌ Error: dist/server/index.js tidak ditemukan!${NC}"
    echo -e "${YELLOW}Available files in dist/server:${NC}"
    ls -la dist/server/ 2>/dev/null || echo "dist/server directory does not exist"
    echo -e "\n${YELLOW}💡 Tip: Pastikan deployment sudah berjalan atau build backend terlebih dahulu${NC}"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules tidak ditemukan, installing dependencies...${NC}"
    npm install --production || {
        echo -e "${RED}❌ Error: npm install failed!${NC}"
        exit 1
    }
fi

# Create logs directory
mkdir -p logs
chmod 755 logs

# Stop and delete existing PM2 process if running
echo -e "${YELLOW}📦 Checking existing PM2 processes...${NC}"
if pm2 list | grep -q "$APP_NAME"; then
    echo -e "${YELLOW}Stopping existing process...${NC}"
    pm2 stop "$APP_NAME" || true
    pm2 delete "$APP_NAME" || true
    sleep 2
fi

# Kill any process on port 4000 (safety measure)
echo -e "${YELLOW}📦 Checking port 4000...${NC}"
PORT_PID=$(lsof -ti:4000 2>/dev/null || true)
if [ ! -z "$PORT_PID" ]; then
    echo -e "${YELLOW}Killing process $PORT_PID on port 4000...${NC}"
    kill -9 $PORT_PID || true
    sleep 2
fi

# Start PM2
echo -e "${YELLOW}📦 Starting PM2 process...${NC}"

# Use ecosystem.config.js if exists
if [ -f "$PM2_CONFIG" ]; then
    echo -e "${GREEN}Using ecosystem.config.js...${NC}"
    pm2 start "$PM2_CONFIG" || {
        echo -e "${RED}❌ Error: Failed to start with ecosystem.config.js${NC}"
        echo -e "${YELLOW}Trying direct start...${NC}"
        
        if [ -f "server/.env" ]; then
            pm2 start dist/server/index.js \
                --name "$APP_NAME" \
                --env-file server/.env \
                --log-date-format "YYYY-MM-DD HH:mm:ss Z" \
                --merge-logs \
                --error ./logs/pm2-error.log \
                --output ./logs/pm2-out.log
        else
            pm2 start dist/server/index.js \
                --name "$APP_NAME" \
                --log-date-format "YYYY-MM-DD HH:mm:ss Z" \
                --merge-logs \
                --error ./logs/pm2-error.log \
                --output ./logs/pm2-out.log
        fi
    }
elif [ -f "server/.env" ]; then
    echo -e "${GREEN}Starting with server/.env...${NC}"
    pm2 start dist/server/index.js \
        --name "$APP_NAME" \
        --env-file server/.env \
        --log-date-format "YYYY-MM-DD HH:mm:ss Z" \
        --merge-logs \
        --error ./logs/pm2-error.log \
        --output ./logs/pm2-out.log
elif [ -f ".env.production" ]; then
    echo -e "${GREEN}Starting with .env.production...${NC}"
    pm2 start dist/server/index.js \
        --name "$APP_NAME" \
        --env-file .env.production \
        --log-date-format "YYYY-MM-DD HH:mm:ss Z" \
        --merge-logs \
        --error ./logs/pm2-error.log \
        --output ./logs/pm2-out.log
else
    echo -e "${YELLOW}⚠️  No .env file found, starting without env-file...${NC}"
    echo -e "${YELLOW}   Make sure environment variables are set in system${NC}"
    pm2 start dist/server/index.js \
        --name "$APP_NAME" \
        --log-date-format "YYYY-MM-DD HH:mm:ss Z" \
        --merge-logs \
        --error ./logs/pm2-error.log \
        --output ./logs/pm2-out.log
fi

# Wait and check status
sleep 3
echo -e "\n${BLUE}=== PM2 Status ===${NC}"
pm2 list

if pm2 list | grep -q "$APP_NAME.*online"; then
    echo -e "\n${GREEN}✅ PM2 process started successfully!${NC}"
    echo -e "\n${BLUE}📋 Useful commands:${NC}"
    echo -e "  ${YELLOW}pm2 logs ${APP_NAME}${NC}          # View logs"
    echo -e "  ${YELLOW}pm2 restart ${APP_NAME}${NC}        # Restart app"
    echo -e "  ${YELLOW}pm2 stop ${APP_NAME}${NC}          # Stop app"
    echo -e "  ${YELLOW}pm2 delete ${APP_NAME}${NC}         # Delete app"
    echo -e "  ${YELLOW}pm2 save${NC}                       # Save PM2 configuration"
else
    echo -e "\n${RED}❌ WARNING: PM2 process may not have started correctly${NC}"
    echo -e "${YELLOW}Checking logs...${NC}"
    pm2 logs "$APP_NAME" --lines 30 --nostream || true
    exit 1
fi

# Save PM2 configuration
pm2 save

echo -e "\n${GREEN}✅ Done!${NC}"
