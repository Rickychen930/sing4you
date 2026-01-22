#!/bin/bash

# =============================================================================
# Nginx Setup Script
# Setup dan konfigurasi Nginx untuk production
# =============================================================================

set -e

# Colors untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Konfigurasi
DOMAIN="christina-sings4you.com.au"
NGINX_SITES_AVAILABLE="/etc/nginx/sites-available"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"
NGINX_CONFIG_FILE="${NGINX_SITES_AVAILABLE}/${DOMAIN}.conf"
PROJECT_DIR="/var/www/christina-sings4you"
BACKEND_PORT=4000

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Nginx Setup untuk ${DOMAIN}${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Error: Script ini harus dijalankan sebagai root (gunakan sudo)${NC}"
    exit 1
fi

# 1. Install Nginx
echo -e "${YELLOW}📦 Step 1: Install Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    apt-get update
    apt-get install -y nginx
    echo -e "${GREEN}✅ Nginx installed${NC}\n"
else
    echo -e "${GREEN}✅ Nginx sudah terinstall${NC}\n"
fi

# 2. Backup existing config if exists
if [ -f "$NGINX_CONFIG_FILE" ]; then
    echo -e "${YELLOW}📦 Step 2: Backup existing config...${NC}"
    BACKUP_FILE="${NGINX_CONFIG_FILE}.backup.$(date +%Y%m%d-%H%M%S)"
    cp "$NGINX_CONFIG_FILE" "$BACKUP_FILE"
    echo -e "${GREEN}✅ Config di-backup ke: $BACKUP_FILE${NC}\n"
fi

# 3. Copy nginx config
echo -e "${YELLOW}📦 Step 3: Copy nginx configuration...${NC}"
if [ -f "${PROJECT_DIR}/deployment/nginx/${DOMAIN}.conf" ]; then
    cp "${PROJECT_DIR}/deployment/nginx/${DOMAIN}.conf" "$NGINX_CONFIG_FILE"
    echo -e "${GREEN}✅ Config file copied${NC}\n"
else
    echo -e "${RED}❌ Error: Config file tidak ditemukan di ${PROJECT_DIR}/deployment/nginx/${DOMAIN}.conf${NC}"
    exit 1
fi

# 4. Update backend port in config (if needed)
echo -e "${YELLOW}📦 Step 4: Update backend port in config...${NC}"
sed -i "s|proxy_pass http://localhost:3001|proxy_pass http://localhost:${BACKEND_PORT}|g" "$NGINX_CONFIG_FILE"
sed -i "s|proxy_pass http://localhost:3001|proxy_pass http://localhost:${BACKEND_PORT}|g" "$NGINX_CONFIG_FILE"
echo -e "${GREEN}✅ Backend port updated ke ${BACKEND_PORT}${NC}\n"

# 5. Update root directory in config
echo -e "${YELLOW}📦 Step 5: Update root directory...${NC}"
# Update root path based on deployment structure
if [ -d "${PROJECT_DIR}/build" ]; then
    sed -i "s|root /var/www/christina-sings4you/dist/client|root ${PROJECT_DIR}/build|g" "$NGINX_CONFIG_FILE"
elif [ -d "${PROJECT_DIR}/current" ]; then
    sed -i "s|root /var/www/christina-sings4you/dist/client|root ${PROJECT_DIR}/current|g" "$NGINX_CONFIG_FILE"
fi
echo -e "${GREEN}✅ Root directory updated${NC}\n"

# 6. Create symlink
echo -e "${YELLOW}📦 Step 6: Enable site...${NC}"
if [ -L "${NGINX_SITES_ENABLED}/${DOMAIN}.conf" ]; then
    rm "${NGINX_SITES_ENABLED}/${DOMAIN}.conf"
fi
ln -s "$NGINX_CONFIG_FILE" "${NGINX_SITES_ENABLED}/${DOMAIN}.conf"
echo -e "${GREEN}✅ Site enabled${NC}\n"

# 7. Remove default site
echo -e "${YELLOW}📦 Step 7: Remove default nginx site...${NC}"
if [ -L "${NGINX_SITES_ENABLED}/default" ]; then
    rm "${NGINX_SITES_ENABLED}/default"
    echo -e "${GREEN}✅ Default site removed${NC}\n"
else
    echo -e "${YELLOW}⚠️  Default site tidak ditemukan${NC}\n"
fi

# 8. Test nginx configuration
echo -e "${YELLOW}📦 Step 8: Test nginx configuration...${NC}"
if nginx -t; then
    echo -e "${GREEN}✅ Nginx configuration valid${NC}\n"
else
    echo -e "${RED}❌ Error: Nginx configuration invalid!${NC}"
    exit 1
fi

# 9. Create log directory
echo -e "${YELLOW}📦 Step 9: Create log directory...${NC}"
mkdir -p /var/log/nginx
echo -e "${GREEN}✅ Log directory ready${NC}\n"

# 10. Start/Reload Nginx
echo -e "${YELLOW}📦 Step 10: Start/Reload Nginx...${NC}"
if systemctl is-active --quiet nginx; then
    systemctl reload nginx
    echo -e "${GREEN}✅ Nginx reloaded${NC}\n"
else
    systemctl start nginx
    systemctl enable nginx
    echo -e "${GREEN}✅ Nginx started and enabled${NC}\n"
fi

# 11. Install Certbot for SSL (optional)
echo -e "${YELLOW}📦 Step 11: Install Certbot (untuk SSL)...${NC}"
read -p "Install Certbot untuk SSL? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if ! command -v certbot &> /dev/null; then
        apt-get install -y certbot python3-certbot-nginx
        echo -e "${GREEN}✅ Certbot installed${NC}\n"
        echo -e "${YELLOW}📝 Untuk setup SSL, jalankan:${NC}"
        echo -e "${BLUE}   certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}${NC}\n"
    else
        echo -e "${GREEN}✅ Certbot sudah terinstall${NC}\n"
    fi
else
    echo -e "${YELLOW}⚠️  Certbot installation skipped${NC}\n"
fi

# 12. Setup firewall (UFW)
echo -e "${YELLOW}📦 Step 12: Setup firewall...${NC}"
if command -v ufw &> /dev/null; then
    # Allow HTTP
    ufw allow 'Nginx Full' 2>/dev/null || ufw allow 80/tcp
    ufw allow 443/tcp
    echo -e "${GREEN}✅ Firewall configured${NC}\n"
else
    echo -e "${YELLOW}⚠️  UFW tidak terinstall, skip firewall setup${NC}\n"
fi

# Summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ Nginx Setup Selesai!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${BLUE}📋 Next Steps:${NC}"
echo -e "1. Setup SSL certificate (jika belum):"
echo -e "   ${YELLOW}certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}${NC}\n"
echo -e "2. Check nginx status:"
echo -e "   ${YELLOW}systemctl status nginx${NC}\n"
echo -e "3. Check nginx logs:"
echo -e "   ${YELLOW}tail -f /var/log/nginx/${DOMAIN}-error.log${NC}\n"
echo -e "4. Test configuration:"
echo -e "   ${YELLOW}nginx -t${NC}\n"
