#!/bin/bash

# Script untuk check SSL certificate secara otomatis
# Usage: ./check-ssl-cert.sh [domain]
# Example: ./check-ssl-cert.sh christina-sings4you.com.au

set -e

DOMAIN=${1:-christina-sings4you.com.au}
CERT_PATH="/etc/letsencrypt/live/$DOMAIN"

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

# Check if running on server (has certbot)
is_server() {
    command -v certbot &> /dev/null && [ -d "/etc/letsencrypt" ]
}

# Check certificate from server
check_from_server() {
    section "Certificate Check (Server)"
    
    # Check certbot
    if ! command -v certbot &> /dev/null; then
        error "Certbot not installed"
        info "Install with: sudo apt-get install certbot python3-certbot-nginx"
        return 1
    fi
    
    # List certificates
    info "Checking installed certificates..."
    if sudo certbot certificates 2>/dev/null | grep -q "$DOMAIN"; then
        log "Certificate found for $DOMAIN"
        echo ""
        sudo certbot certificates 2>/dev/null | grep -A 10 "$DOMAIN"
    else
        error "Certificate not found for $DOMAIN"
        warning "Install with: sudo certbot --nginx -d $DOMAIN"
        return 1
    fi
    
    # Check certificate files
    echo ""
    info "Checking certificate files..."
    if [ -f "$CERT_PATH/fullchain.pem" ]; then
        log "Certificate file exists: $CERT_PATH/fullchain.pem"
    else
        error "Certificate file not found: $CERT_PATH/fullchain.pem"
        return 1
    fi
    
    if [ -f "$CERT_PATH/privkey.pem" ]; then
        log "Private key file exists: $CERT_PATH/privkey.pem"
    else
        error "Private key file not found: $CERT_PATH/privkey.pem"
        return 1
    fi
    
    # Check certificate details
    echo ""
    info "Certificate details:"
    echo ""
    echo "Subject & Issuer:"
    sudo openssl x509 -in "$CERT_PATH/fullchain.pem" -noout -subject -issuer 2>/dev/null || error "Failed to read certificate"
    
    echo ""
    echo "Validity period:"
    sudo openssl x509 -in "$CERT_PATH/fullchain.pem" -noout -dates 2>/dev/null || error "Failed to read dates"
    
    # Check expiration
    echo ""
    info "Checking expiration..."
    END_DATE=$(sudo openssl x509 -in "$CERT_PATH/fullchain.pem" -noout -enddate 2>/dev/null | cut -d= -f2)
    if [ -n "$END_DATE" ]; then
        END_EPOCH=$(date -d "$END_DATE" +%s 2>/dev/null || date -j -f "%b %d %H:%M:%S %Y %Z" "$END_DATE" +%s 2>/dev/null)
        NOW_EPOCH=$(date +%s)
        DAYS_LEFT=$(( ($END_EPOCH - $NOW_EPOCH) / 86400 ))
        
        if [ $DAYS_LEFT -lt 0 ]; then
            error "Certificate EXPIRED! ($DAYS_LEFT days ago)"
            warning "Renew with: sudo certbot renew"
        elif [ $DAYS_LEFT -lt 30 ]; then
            warning "Certificate expires in $DAYS_LEFT days"
            warning "Renew soon with: sudo certbot renew"
        else
            log "Certificate valid for $DAYS_LEFT more days"
        fi
    fi
    
    # Check Nginx config
    echo ""
    info "Checking Nginx configuration..."
    NGINX_CONFIG="/etc/nginx/sites-available/$DOMAIN.conf"
    if [ -f "$NGINX_CONFIG" ]; then
        if sudo grep -q "ssl_certificate.*$DOMAIN" "$NGINX_CONFIG"; then
            log "Nginx config uses correct certificate path"
            echo ""
            echo "SSL certificate paths in Nginx:"
            sudo grep "ssl_certificate" "$NGINX_CONFIG" | grep -v "^#" || true
        else
            warning "Nginx config may not use correct certificate path"
        fi
    else
        warning "Nginx config not found: $NGINX_CONFIG"
    fi
    
    # Test SSL connection from server
    echo ""
    info "Testing SSL connection from server..."
    if echo | openssl s_client -connect localhost:443 -servername "$DOMAIN" 2>/dev/null | grep -q "Verify return code: 0"; then
        log "SSL connection successful"
    else
        warning "SSL connection test failed (may be normal if Nginx not running or not configured)"
    fi
}

# Check certificate from remote
check_from_remote() {
    section "Certificate Check (Remote)"
    
    info "Checking certificate for: $DOMAIN"
    echo ""
    
    # Test HTTPS connection
    info "Testing HTTPS connection..."
    if curl -s -f -I "https://$DOMAIN" > /dev/null 2>&1; then
        log "HTTPS connection successful"
    else
        error "HTTPS connection failed"
        return 1
    fi
    
    # Get certificate info
    echo ""
    info "Certificate information:"
    echo ""
    
    CERT_INFO=$(echo | openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" 2>/dev/null)
    
    if [ -z "$CERT_INFO" ]; then
        error "Failed to retrieve certificate information"
        return 1
    fi
    
    # Subject and Issuer
    echo "Subject & Issuer:"
    echo "$CERT_INFO" | openssl x509 -noout -subject -issuer 2>/dev/null || error "Failed to parse certificate"
    
    # Validity period
    echo ""
    echo "Validity period:"
    echo "$CERT_INFO" | openssl x509 -noout -dates 2>/dev/null || error "Failed to parse dates"
    
    # Check expiration
    echo ""
    info "Checking expiration..."
    END_DATE=$(echo "$CERT_INFO" | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
    if [ -n "$END_DATE" ]; then
        # Try different date parsing methods
        if date -d "$END_DATE" +%s > /dev/null 2>&1; then
            END_EPOCH=$(date -d "$END_DATE" +%s)
        elif date -j -f "%b %d %H:%M:%S %Y %Z" "$END_DATE" +%s > /dev/null 2>&1; then
            END_EPOCH=$(date -j -f "%b %d %H:%M:%S %Y %Z" "$END_DATE" +%s)
        else
            warning "Could not parse expiration date: $END_DATE"
            END_EPOCH=0
        fi
        
        if [ $END_EPOCH -gt 0 ]; then
            NOW_EPOCH=$(date +%s)
            DAYS_LEFT=$(( ($END_EPOCH - $NOW_EPOCH) / 86400 ))
            
            if [ $DAYS_LEFT -lt 0 ]; then
                error "Certificate EXPIRED! ($DAYS_LEFT days ago)"
            elif [ $DAYS_LEFT -lt 30 ]; then
                warning "Certificate expires in $DAYS_LEFT days"
            else
                log "Certificate valid for $DAYS_LEFT more days"
            fi
        fi
    fi
    
    # Certificate chain
    echo ""
    info "Certificate chain validation:"
    VERIFY_OUTPUT=$(echo | openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" 2>&1)
    if echo "$VERIFY_OUTPUT" | grep -q "Verify return code: 0"; then
        log "Certificate chain is valid"
    else
        error "Certificate chain validation failed"
        echo "$VERIFY_OUTPUT" | grep -A 5 "Verify return code" || true
    fi
    
    # SSL/TLS version
    echo ""
    info "SSL/TLS information:"
    echo "$VERIFY_OUTPUT" | grep -E "Protocol|Cipher" | head -5 || true
    
    # Certificate fingerprint
    echo ""
    info "Certificate fingerprint (SHA256):"
    echo "$CERT_INFO" | openssl x509 -noout -fingerprint -sha256 2>/dev/null || error "Failed to get fingerprint"
}

# Main
main() {
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════╗"
    echo "║   SSL Certificate Checker             ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"
    
    if is_server; then
        check_from_server
        echo ""
        section "Remote Check"
        check_from_remote
    else
        info "Running from local machine (remote check only)"
        check_from_remote
        echo ""
        info "For server-side checks, run this script on the server"
    fi
    
    echo ""
    section "Summary"
    log "Certificate check completed!"
    echo ""
    info "For detailed manual checks, see:"
    echo "  See script output above for manual check instructions"
    echo ""
    info "Online SSL test tools:"
    echo "  - SSL Labs: https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
    echo "  - SSL Checker: https://www.sslshopper.com/ssl-checker.html#hostname=$DOMAIN"
}

main
