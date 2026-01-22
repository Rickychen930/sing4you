#!/bin/bash

# =============================================================================
# Master Setup Script - Nginx & PM2
# Setup lengkap nginx dan PM2 dari awal
# =============================================================================

set -e

# Colors untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_DIR="/var/www/christina-sings4you"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Setup Lengkap: Nginx & PM2${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Error: Script ini harus dijalankan sebagai root (gunakan sudo)${NC}"
    exit 1
fi

# Check if project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}⚠️  Project directory tidak ditemukan: ${PROJECT_DIR}${NC}"
    read -p "Buat directory sekarang? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        mkdir -p "$PROJECT_DIR"
        echo -e "${GREEN}✅ Directory created${NC}\n"
    else
        echo -e "${RED}❌ Setup dibatalkan${NC}"
        exit 1
    fi
fi

# Step 1: Setup PM2
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Step 1: Setup PM2${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

if [ -f "${PROJECT_DIR}/deployment/scripts/setup-pm2.sh" ]; then
    chmod +x "${PROJECT_DIR}/deployment/scripts/setup-pm2.sh"
    "${PROJECT_DIR}/deployment/scripts/setup-pm2.sh"
else
    echo -e "${RED}❌ Error: setup-pm2.sh tidak ditemukan${NC}"
    exit 1
fi

echo -e "\n"

# Step 2: Setup Nginx
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Step 2: Setup Nginx${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

if [ -f "${PROJECT_DIR}/deployment/scripts/setup-nginx.sh" ]; then
    chmod +x "${PROJECT_DIR}/deployment/scripts/setup-nginx.sh"
    "${PROJECT_DIR}/deployment/scripts/setup-nginx.sh"
else
    echo -e "${RED}❌ Error: setup-nginx.sh tidak ditemukan${NC}"
    exit 1
fi

# Final Summary
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ Setup Lengkap Selesai!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${BLUE}📋 Checklist Setup:${NC}\n"

echo -e "${YELLOW}☐${NC} PM2 installed dan configured"
echo -e "${YELLOW}☐${NC} Nginx installed dan configured"
echo -e "${YELLOW}☐${NC} Firewall configured\n"

echo -e "${BLUE}📋 Next Steps:${NC}\n"

echo -e "1. ${YELLOW}Setup Environment Variables:${NC}"
echo -e "   cd ${PROJECT_DIR}"
echo -e "   cp deployment/env.production.template server/.env"
echo -e "   nano server/.env  # Edit dengan konfigurasi yang benar\n"

echo -e "2. ${YELLOW}Install Dependencies & Build:${NC}"
echo -e "   cd ${PROJECT_DIR}"
echo -e "   npm install"
echo -e "   npm run build"
echo -e "   npm run build:server\n"

echo -e "3. ${YELLOW}Setup SSL Certificate (Let's Encrypt):${NC}"
echo -e "   certbot --nginx -d christina-sings4you.com.au -d www.christina-sings4you.com.au\n"

echo -e "4. ${YELLOW}Start Application dengan PM2:${NC}"
echo -e "   cd ${PROJECT_DIR}"
echo -e "   pm2 start ecosystem.config.js"
echo -e "   pm2 save\n"

echo -e "5. ${YELLOW}Verify Setup:${NC}"
echo -e "   pm2 status"
echo -e "   systemctl status nginx"
echo -e "   curl http://localhost:4000/api/health\n"

echo -e "${GREEN}✅ Setup selesai! Aplikasi siap di-deploy.${NC}\n"
