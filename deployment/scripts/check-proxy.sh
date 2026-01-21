#!/bin/bash

# Script untuk check proxy configuration secara manual
# Usage: ./check-proxy.sh [development|production|both]
# Example: ./check-proxy.sh development

set -e

MODE=${1:-both}

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[✓]${NC} $1"
}

error() {
    echo -e "${RED}[✗]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

info() {
    echo -e "${BLUE}[i]${NC} $1"
}

section() {
    echo ""
    echo -e "${CYAN}=== $1 ===${NC}"
}

# Check Development Proxy (Vite)
check_development() {
    section "Development Proxy Check (Vite)"
    
    # Check vite.config.ts
    info "Checking vite.config.ts..."
    if [ -f "vite.config.ts" ]; then
        log "vite.config.ts found"
        echo ""
        echo "Proxy configuration:"
        grep -A 10 "proxy:" vite.config.ts | head -15 || warning "Proxy config not found"
    else
        error "vite.config.ts not found"
        return 1
    fi
    
    echo ""
    info "Testing backend server (port 3001)..."
    if curl -s -f http://localhost:3001/api/health > /dev/null 2>&1; then
        log "Backend server is running on port 3001"
        BACKEND_RESPONSE=$(curl -s http://localhost:3001/api/health)
        echo "  Response: $BACKEND_RESPONSE"
    else
        error "Backend server is NOT running on port 3001"
        warning "Start backend with: npm run dev:server"
    fi
    
    echo ""
    info "Testing Vite dev server (port 5173)..."
    if curl -s -f http://localhost:5173 > /dev/null 2>&1; then
        log "Vite dev server is running on port 5173"
    else
        error "Vite dev server is NOT running on port 5173"
        warning "Start Vite with: npm run dev:client"
    fi
    
    echo ""
    info "Testing proxy /api endpoint..."
    if curl -s -f http://localhost:5173/api/health > /dev/null 2>&1; then
        log "Proxy /api is working"
        PROXY_RESPONSE=$(curl -s http://localhost:5173/api/health)
        echo "  Response: $PROXY_RESPONSE"
        
        # Compare responses
        if [ "$BACKEND_RESPONSE" = "$PROXY_RESPONSE" ]; then
            log "Proxy response matches backend response ✓"
        else
            warning "Proxy response differs from backend response"
        fi
    else
        error "Proxy /api is NOT working"
        warning "Check if both backend and Vite dev server are running"
    fi
    
    echo ""
    info "Testing proxy /sitemap.xml endpoint..."
    if curl -s -f http://localhost:5173/sitemap.xml > /dev/null 2>&1; then
        log "Proxy /sitemap.xml is working"
    else
        warning "Proxy /sitemap.xml returned error (may be normal if sitemap not generated)"
    fi
}

# Check Production Proxy (Nginx)
check_production() {
    section "Production Proxy Check (Nginx)"
    
    # Check if running on server
    if [ ! -f "/etc/nginx/sites-available/christina-sings4you.com.au.conf" ]; then
        warning "Not running on production server"
        warning "SSH to server first: ssh root@76.13.96.198"
        return 1
    fi
    
    info "Checking Nginx configuration..."
    if sudo nginx -t > /dev/null 2>&1; then
        log "Nginx configuration is valid"
    else
        error "Nginx configuration has errors"
        sudo nginx -t
        return 1
    fi
    
    echo ""
    info "Checking Nginx status..."
    if systemctl is-active --quiet nginx; then
        log "Nginx is running"
    else
        error "Nginx is NOT running"
        warning "Start with: sudo systemctl start nginx"
    fi
    
    echo ""
    info "Checking backend server (port 3001)..."
    if curl -s -f http://localhost:3001/api/health > /dev/null 2>&1; then
        log "Backend server is running on port 3001"
        BACKEND_RESPONSE=$(curl -s http://localhost:3001/api/health)
        echo "  Response: $BACKEND_RESPONSE"
    else
        error "Backend server is NOT running on port 3001"
        warning "Check PM2: pm2 list"
    fi
    
    echo ""
    info "Checking Nginx proxy configuration..."
    echo "Proxy settings:"
    sudo grep -A 15 "location /api" /etc/nginx/sites-available/christina-sings4you.com.au.conf | head -20 || warning "Proxy config not found"
    
    echo ""
    info "Testing proxy from localhost..."
    if curl -s -f -H "Host: christina-sings4you.com.au" http://localhost/api/health > /dev/null 2>&1; then
        log "Proxy /api is working (from localhost)"
        PROXY_RESPONSE=$(curl -s -H "Host: christina-sings4you.com.au" http://localhost/api/health)
        echo "  Response: $PROXY_RESPONSE"
    else
        error "Proxy /api is NOT working (from localhost)"
    fi
    
    echo ""
    info "Checking PM2 status..."
    if command -v pm2 &> /dev/null; then
        echo "PM2 processes:"
        pm2 list || warning "PM2 list failed"
    else
        warning "PM2 not found"
    fi
    
    echo ""
    info "Recent Nginx access logs (last 5 /api requests):"
    if [ -f "/var/log/nginx/christina-sings4you-access.log" ]; then
        sudo grep "/api" /var/log/nginx/christina-sings4you-access.log | tail -5 || info "No /api requests in log"
    else
        warning "Access log not found"
    fi
    
    echo ""
    info "Recent Nginx error logs (last 5 errors):"
    if [ -f "/var/log/nginx/christina-sings4you-error.log" ]; then
        sudo tail -5 /var/log/nginx/christina-sings4you-error.log || info "No errors in log"
    else
        warning "Error log not found"
    fi
}

# Check from remote (local machine checking production)
check_production_remote() {
    section "Production Proxy Check (Remote)"
    
    SERVER_IP="76.13.96.198"
    SERVER_USER="root"
    DOMAIN="christina-sings4you.com.au"
    
    info "Testing production domain: $DOMAIN"
    
    echo ""
    info "Testing HTTPS endpoint..."
    if curl -s -f https://$DOMAIN/api/health > /dev/null 2>&1; then
        log "HTTPS proxy is working"
        RESPONSE=$(curl -s https://$DOMAIN/api/health)
        echo "  Response: $RESPONSE"
        
        # Check headers
        echo ""
        info "Response headers:"
        curl -I -s https://$DOMAIN/api/health | grep -E "(HTTP|X-Real-IP|X-Forwarded)" || true
    else
        error "HTTPS proxy is NOT working"
        warning "Check SSL certificate and Nginx configuration"
    fi
    
    echo ""
    info "Testing HTTP endpoint (should redirect to HTTPS)..."
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN/api/health)
    if [ "$HTTP_STATUS" = "301" ] || [ "$HTTP_STATUS" = "302" ]; then
        log "HTTP redirect is working (status: $HTTP_STATUS)"
    elif [ "$HTTP_STATUS" = "200" ]; then
        warning "HTTP is working but should redirect to HTTPS"
    else
        error "HTTP endpoint returned status: $HTTP_STATUS"
    fi
    
    echo ""
    info "To check server details, SSH and run:"
    echo "  ssh $SERVER_USER@$SERVER_IP"
    echo "  sudo bash /var/www/christina-sings4you/deployment/scripts/check-proxy.sh production"
}

# Main
main() {
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════╗"
    echo "║   Proxy Configuration Checker         ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"
    
    case $MODE in
        development)
            check_development
            ;;
        production)
            # Check if we're on the server or local
            if [ -f "/etc/nginx/sites-available/christina-sings4you.com.au.conf" ]; then
                check_production
            else
                check_production_remote
            fi
            ;;
        both)
            check_development
            echo ""
            if [ -f "/etc/nginx/sites-available/christina-sings4you.com.au.conf" ]; then
                check_production
            else
                check_production_remote
            fi
            ;;
        *)
            error "Invalid mode: $MODE"
            echo "Usage: $0 [development|production|both]"
            exit 1
            ;;
    esac
    
    echo ""
    section "Summary"
    log "Check completed!"
    echo ""
    info "For detailed manual checks, see:"
    echo "  See script output above for manual check instructions"
}

main
