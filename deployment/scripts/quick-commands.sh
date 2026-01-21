#!/bin/bash

# Quick commands helper - copy this to server for easy access
# Usage: source this file or add to .bashrc

APP_DIR="/var/www/christina-sings4you"

# Aliases for common commands
alias cdapp="cd $APP_DIR"
alias pm2-update="cd $APP_DIR && sudo bash deployment/scripts/update-nginx-pm2-on-server.sh"
alias nginx-setup="cd $APP_DIR && sudo bash deployment/scripts/setup-nginx-config.sh"
alias pm2-status="pm2 list"
alias pm2-logs="pm2 logs"
alias nginx-test="nginx -t"
alias nginx-reload="systemctl reload nginx"
alias check-proxy="cd $APP_DIR && bash deployment/scripts/check-proxy.sh"
alias check-ssl="cd $APP_DIR && bash deployment/scripts/check-ssl-cert.sh"

echo "Quick commands loaded!"
echo ""
echo "Available commands:"
echo "  cdapp          - Go to application directory"
echo "  pm2-update     - Update Nginx and PM2"
echo "  nginx-setup    - Setup Nginx configuration"
echo "  pm2-status     - Show PM2 process list"
echo "  pm2-logs       - Show PM2 logs"
echo "  nginx-test     - Test Nginx configuration"
echo "  nginx-reload   - Reload Nginx"
echo "  check-proxy    - Check proxy configuration (development/production/both)"
echo "  check-ssl      - Check SSL certificate (from server or remote)"
