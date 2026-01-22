#!/bin/bash

# =============================================================================
# PM2 Setup Script
# Setup dan konfigurasi PM2 untuk production
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
LOG_DIR="/var/log/pm2"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  PM2 Setup untuk ${APP_NAME}${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if running as root (optional, but recommended for log directory)
if [ "$EUID" -ne 0 ]; then 
    echo -e "${YELLOW}⚠️  Warning: Tidak running sebagai root${NC}"
    echo -e "${YELLOW}   Log directory mungkin perlu permission manual${NC}\n"
fi

# 1. Install Node.js (if not installed)
echo -e "${YELLOW}📦 Step 1: Check Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    echo -e "${GREEN}✅ Node.js installed${NC}\n"
else
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js sudah terinstall: ${NODE_VERSION}${NC}\n"
fi

# 2. Install PM2 globally
echo -e "${YELLOW}📦 Step 2: Install PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    echo -e "${GREEN}✅ PM2 installed${NC}\n"
else
    PM2_VERSION=$(pm2 -v)
    echo -e "${GREEN}✅ PM2 sudah terinstall: v${PM2_VERSION}${NC}\n"
fi

# 3. Create log directory
echo -e "${YELLOW}📦 Step 3: Create log directory...${NC}"
mkdir -p "$LOG_DIR"
if [ "$EUID" -eq 0 ]; then
    chown -R $SUDO_USER:$SUDO_USER "$LOG_DIR" 2>/dev/null || true
fi
chmod -R 755 "$LOG_DIR"
echo -e "${GREEN}✅ Log directory created: ${LOG_DIR}${NC}\n"

# 4. Check if project directory exists
echo -e "${YELLOW}📦 Step 4: Check project directory...${NC}"
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}❌ Error: Project directory tidak ditemukan: ${PROJECT_DIR}${NC}"
    echo -e "${YELLOW}   Membuat directory...${NC}"
    mkdir -p "$PROJECT_DIR"
    if [ "$EUID" -eq 0 ] && [ -n "$SUDO_USER" ]; then
        chown -R $SUDO_USER:$SUDO_USER "$PROJECT_DIR"
    fi
fi
echo -e "${GREEN}✅ Project directory ready${NC}\n"

# 5. Copy PM2 ecosystem config
echo -e "${YELLOW}📦 Step 5: Setup PM2 ecosystem config...${NC}"
if [ -f "${PROJECT_DIR}/deployment/pm2/ecosystem.config.cjs" ]; then
    # Copy and convert to .js if needed
    cp "${PROJECT_DIR}/deployment/pm2/ecosystem.config.cjs" "$PM2_CONFIG"
    # Convert to ES module format if needed (remove module.exports, use export default)
    echo -e "${GREEN}✅ PM2 config copied${NC}\n"
elif [ -f "${PROJECT_DIR}/ecosystem.config.js" ]; then
    echo -e "${GREEN}✅ PM2 config sudah ada${NC}\n"
else
    echo -e "${YELLOW}⚠️  PM2 config tidak ditemukan, akan dibuat default config${NC}"
    # Will be created by deploy script or manually
fi

# 6. Setup PM2 startup script
echo -e "${YELLOW}📦 Step 6: Setup PM2 startup script...${NC}"
pm2 startup systemd -u $USER --hp /home/$USER 2>/dev/null || {
    if [ "$EUID" -eq 0 ]; then
        pm2 startup systemd
        echo -e "${YELLOW}📝 Jalankan command yang ditampilkan di atas untuk enable PM2 startup${NC}\n"
    else
        echo -e "${YELLOW}⚠️  Perlu root untuk setup startup script${NC}"
        echo -e "${YELLOW}   Jalankan: sudo pm2 startup systemd${NC}\n"
    fi
}

# 7. Stop existing PM2 processes (if any)
echo -e "${YELLOW}📦 Step 7: Stop existing PM2 processes...${NC}"
if pm2 list | grep -q "$APP_NAME"; then
    pm2 stop "$APP_NAME" || true
    pm2 delete "$APP_NAME" || true
    echo -e "${GREEN}✅ Existing process stopped${NC}\n"
else
    echo -e "${GREEN}✅ No existing process found${NC}\n"
fi

# 8. Create PM2 ecosystem config if not exists
echo -e "${YELLOW}📦 Step 8: Create/Update PM2 ecosystem config...${NC}"
if [ ! -f "$PM2_CONFIG" ]; then
    cat > "$PM2_CONFIG" << 'EOF'
module.exports = {
  apps: [
    {
      name: 'sing4you-api',
      script: './dist/server/server.js',
      cwd: '/var/www/christina-sings4you',
      instances: 1,
      exec_mode: 'fork',
      env_file: 'server/.env',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads'],
    },
  ],
};
EOF
    echo -e "${GREEN}✅ PM2 config created${NC}\n"
else
    echo -e "${GREEN}✅ PM2 config sudah ada${NC}\n"
fi

# 9. Create logs directory in project
echo -e "${YELLOW}📦 Step 9: Create logs directory in project...${NC}"
mkdir -p "${PROJECT_DIR}/logs"
if [ "$EUID" -eq 0 ] && [ -n "$SUDO_USER" ]; then
    chown -R $SUDO_USER:$SUDO_USER "${PROJECT_DIR}/logs" 2>/dev/null || true
fi
chmod -R 755 "${PROJECT_DIR}/logs"
echo -e "${GREEN}✅ Project logs directory created${NC}\n"

# 10. Setup PM2 log rotation
echo -e "${YELLOW}📦 Step 10: Setup PM2 log rotation...${NC}"
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
echo -e "${GREEN}✅ PM2 log rotation configured${NC}\n"

# Summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ PM2 Setup Selesai!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${BLUE}📋 Next Steps:${NC}"
echo -e "1. Build aplikasi:"
echo -e "   ${YELLOW}cd ${PROJECT_DIR}${NC}"
echo -e "   ${YELLOW}npm install${NC}"
echo -e "   ${YELLOW}npm run build:server${NC}\n"
echo -e "2. Setup .env file:"
echo -e "   ${YELLOW}cp ${PROJECT_DIR}/deployment/env.production.template ${PROJECT_DIR}/server/.env${NC}"
echo -e "   ${YELLOW}# Edit .env dengan konfigurasi yang benar${NC}\n"
echo -e "3. Start aplikasi dengan PM2:"
echo -e "   ${YELLOW}cd ${PROJECT_DIR}${NC}"
echo -e "   ${YELLOW}pm2 start ecosystem.config.js${NC}"
echo -e "   ${YELLOW}pm2 save${NC}\n"
echo -e "4. Check PM2 status:"
echo -e "   ${YELLOW}pm2 status${NC}"
echo -e "   ${YELLOW}pm2 logs ${APP_NAME}${NC}\n"
echo -e "5. Enable PM2 startup (jika belum):"
echo -e "   ${YELLOW}sudo pm2 startup systemd${NC}"
echo -e "   ${YELLOW}# Jalankan command yang ditampilkan${NC}\n"
