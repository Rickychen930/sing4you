#!/bin/bash

# Quick upload script - Upload aplikasi ke server
# Usage: ./QUICK_UPLOAD.sh

# Update IP server sesuai kebutuhan
SERVER_IP="${1:-72.61.214.25}"
SERVER_USER="root"
APP_DIR="/var/www/christina-sings4you"
LOCAL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🚀 Uploading application to server..."
echo "Server: $SERVER_USER@$SERVER_IP"
echo "Target: $APP_DIR"
echo ""

# Check if rsync is available
if ! command -v rsync &> /dev/null; then
    echo "❌ rsync not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        echo "Please install rsync or use scp instead"
    else
        sudo apt-get install -y rsync
    fi
fi

# Upload files
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'dist' \
  --exclude '.env' \
  --exclude '*.log' \
  --exclude '.DS_Store' \
  --exclude '*.swp' \
  --exclude '*.swo' \
  "$LOCAL_DIR/" "$SERVER_USER@$SERVER_IP:$APP_DIR/"

echo ""
echo "✅ Upload completed!"
echo ""
echo "Next steps (on server):"
echo "1. cd $APP_DIR"
echo "2. sudo chmod +x deployment/scripts/*.sh"
echo "3. sudo ./deployment/scripts/setup-server.sh"
echo "4. cp deployment/env.production.template .env"
echo "5. nano .env  # Update values"
echo "6. sudo ./deployment/scripts/deploy.sh production"
