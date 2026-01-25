#!/bin/bash
# =============================================================================
# Fix Nginx Redirect Loop Script
# =============================================================================
# This script fixes the "rewrite or internal redirection cycle" error
# by ensuring the correct root path and fixing try_files configuration
# =============================================================================

set -e

NGINX_CONFIG_FILE="/etc/nginx/sites-available/christina-sings4you.com.au.conf"
FRONTEND_BASE="/var/www/christina-sings4you/frontend"

echo "🔍 Checking for redirect loop issues..."

# Find the correct frontend path
echo "📁 Searching for frontend build directory..."
FRONTEND_ROOT=""

# Priority 1: Check for current symlink
if [ -L "$FRONTEND_BASE/current" ]; then
  CURRENT_PATH=$(readlink -f "$FRONTEND_BASE/current" 2>/dev/null || echo "$FRONTEND_BASE/current")
  if [ -f "$CURRENT_PATH/dist/client/index.html" ]; then
    FRONTEND_ROOT="$CURRENT_PATH/dist/client"
    echo "✅ Found current symlink -> dist/client: $FRONTEND_ROOT"
  elif [ -f "$CURRENT_PATH/index.html" ]; then
    FRONTEND_ROOT="$CURRENT_PATH"
    echo "✅ Found current symlink: $FRONTEND_ROOT"
  fi
fi

# Priority 2: Check for build/dist/client
if [ -z "$FRONTEND_ROOT" ] && [ -f "$FRONTEND_BASE/build/dist/client/index.html" ]; then
  FRONTEND_ROOT="$FRONTEND_BASE/build/dist/client"
  echo "✅ Found build/dist/client: $FRONTEND_ROOT"
fi

# Priority 3: Check for dist/client
if [ -z "$FRONTEND_ROOT" ] && [ -f "$FRONTEND_BASE/dist/client/index.html" ]; then
  FRONTEND_ROOT="$FRONTEND_BASE/dist/client"
  echo "✅ Found dist/client: $FRONTEND_ROOT"
fi

# Priority 4: Check for build directory
if [ -z "$FRONTEND_ROOT" ] && [ -f "$FRONTEND_BASE/build/index.html" ]; then
  FRONTEND_ROOT="$FRONTEND_BASE/build"
  echo "✅ Found build: $FRONTEND_ROOT"
fi

if [ -z "$FRONTEND_ROOT" ]; then
  echo "❌ ERROR: Could not find frontend build directory!"
  echo "   Searched in:"
  echo "   - $FRONTEND_BASE/current/dist/client"
  echo "   - $FRONTEND_BASE/build/dist/client"
  echo "   - $FRONTEND_BASE/dist/client"
  echo "   - $FRONTEND_BASE/build"
  exit 1
fi

# Fix duplicate dist/client (causes redirect loop)
FRONTEND_ROOT="${FRONTEND_ROOT//\/dist\/client\/dist\/client/\/dist\/client}"

# Verify index.html exists
if [ ! -f "$FRONTEND_ROOT/index.html" ]; then
  echo "❌ ERROR: index.html not found in $FRONTEND_ROOT"
  exit 1
fi

echo "✅ Verified index.html exists at: $FRONTEND_ROOT/index.html"

# Backup current config
echo "💾 Backing up current nginx config..."
sudo cp "$NGINX_CONFIG_FILE" "${NGINX_CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"

# Fix root path - remove any duplicate dist/client patterns
echo "🔧 Fixing root path in nginx config..."
sudo sed -i "s|root /var/www/christina-sings4you[^;]*;|root $FRONTEND_ROOT;|g" "$NGINX_CONFIG_FILE"
sudo sed -i 's|/dist/client/dist/client|/dist/client|g' "$NGINX_CONFIG_FILE"

# Verify root path was updated
CURRENT_ROOT=$(grep -E "^\s*root\s+" "$NGINX_CONFIG_FILE" | head -1 | sed 's/.*root\s\+\([^;]*\);.*/\1/')
echo "✅ Root path updated to: $CURRENT_ROOT"

# Fix try_files to use @spa fallback (avoids redirect loop) if @spa exists
echo "🔧 Checking try_files configuration..."
if grep -q "location @spa" "$NGINX_CONFIG_FILE" && grep -q "try_files.*index.html" "$NGINX_CONFIG_FILE"; then
  sudo sed -i 's|try_files \$uri \$uri/ /index.html;|try_files $uri $uri/ @spa;|g' "$NGINX_CONFIG_FILE"
  echo "✅ try_files updated to use @spa"
elif grep -q "try_files.*index.html" "$NGINX_CONFIG_FILE"; then
  echo "✅ try_files uses /index.html (ensure root path is correct)"
fi

# Check for duplicate location blocks that might cause conflicts
echo "🔍 Checking for potential location block conflicts..."
LOCATION_COUNT=$(grep -c "^\s*location\s\+/\s*{" "$NGINX_CONFIG_FILE" || echo "0")
if [ "$LOCATION_COUNT" -gt 1 ]; then
  echo "⚠️  WARNING: Found $LOCATION_COUNT location / blocks. This might cause conflicts."
fi

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
if sudo nginx -t; then
  echo "✅ Nginx configuration is valid"
else
  echo "❌ ERROR: Nginx configuration test failed!"
  echo "   Restoring backup..."
  sudo cp "${NGINX_CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)" "$NGINX_CONFIG_FILE"
  exit 1
fi

# Reload nginx
echo "🔄 Reloading nginx..."
if sudo systemctl reload nginx; then
  echo "✅ Nginx reloaded successfully"
else
  echo "❌ ERROR: Failed to reload nginx. Trying restart..."
  sudo systemctl restart nginx
fi

# Verify the fix
echo "🔍 Verifying fix..."
sleep 2
if curl -s -o /dev/null -w "%{http_code}" http://localhost/ | grep -q "200\|404"; then
  echo "✅ Fix verified - nginx is responding"
else
  echo "⚠️  WARNING: Nginx might still have issues. Check logs:"
  echo "   sudo tail -f /var/log/nginx/christina-sings4you-error.log"
fi

echo ""
echo "✅ Fix complete!"
echo "📝 Summary:"
echo "   - Root path: $CURRENT_ROOT"
echo "   - Config backup: ${NGINX_CONFIG_FILE}.backup.*"
echo "   - Check logs: sudo tail -f /var/log/nginx/christina-sings4you-error.log"
