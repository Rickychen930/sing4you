#!/bin/bash

# Script untuk check dan mendapatkan informasi SERVER_HOST dan SERVER_USER
# Usage: ./check-server-info.sh [server-ip-or-domain]

set -e

echo "🔍 Server Information Checker"
echo "=============================="
echo ""

if [ -z "$1" ]; then
    echo "Usage: $0 <server-ip-or-domain> [username]"
    echo ""
    echo "Examples:"
    echo "  $0 123.456.789.0"
    echo "  $0 server.example.com"
    echo "  $0 123.456.789.0 deploy"
    echo ""
    exit 1
fi

SERVER_HOST="$1"
SERVER_USER="${2:-root}"

echo "📋 Checking server: $SERVER_HOST"
echo "📋 Username: $SERVER_USER"
echo ""

# Check if host is reachable
echo "1️⃣  Checking host connectivity..."
if ping -c 1 -W 2 "$SERVER_HOST" > /dev/null 2>&1; then
    echo "✅ Host is reachable (ping successful)"
else
    echo "⚠️  Host ping failed (might be firewall, but SSH might still work)"
fi
echo ""

# Check SSH port (22)
echo "2️⃣  Checking SSH port (22)..."
if nc -z -w 2 "$SERVER_HOST" 22 2>/dev/null; then
    echo "✅ SSH port 22 is open"
else
    echo "❌ SSH port 22 is closed or filtered"
    echo "   Check firewall settings on server"
fi
echo ""

# Try to get server info via SSH (if key is available)
echo "3️⃣  Checking SSH connection..."
SSH_KEY="$HOME/.ssh/github_actions_deploy"

if [ -f "$SSH_KEY" ]; then
    echo "   Using SSH key: $SSH_KEY"
    
    # Test SSH connection
    if ssh -i "$SSH_KEY" -o ConnectTimeout=5 -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_HOST" "echo 'SSH connection successful'" 2>/dev/null; then
        echo "✅ SSH connection successful!"
        echo ""
        
        # Get server information
        echo "4️⃣  Getting server information..."
        echo "   Hostname:"
        ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_HOST" "hostname" 2>/dev/null || echo "   (could not get hostname)"
        
        echo "   OS Info:"
        ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_HOST" "uname -a" 2>/dev/null || echo "   (could not get OS info)"
        
        echo "   Current user:"
        ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_HOST" "whoami" 2>/dev/null || echo "   (could not get user)"
        
        echo "   Home directory:"
        ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_HOST" "echo \$HOME" 2>/dev/null || echo "   (could not get home dir)"
        
        echo "   SSH directory exists:"
        ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_HOST" "test -d ~/.ssh && echo 'Yes' || echo 'No'" 2>/dev/null || echo "   (could not check)"
        
        echo "   Authorized keys file:"
        ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_HOST" "test -f ~/.ssh/authorized_keys && echo 'Exists' || echo 'Not found'" 2>/dev/null || echo "   (could not check)"
        
    else
        echo "❌ SSH connection failed"
        echo ""
        echo "   Possible reasons:"
        echo "   - Public key not added to server"
        echo "   - Wrong username"
        echo "   - Wrong host/IP"
        echo "   - Firewall blocking"
        echo "   - SSH service not running"
    fi
else
    echo "⚠️  SSH key not found: $SSH_KEY"
    echo "   Generate key first: ssh-keygen -t ed25519 -C 'github-actions' -f ~/.ssh/github_actions_deploy -N \"\""
fi

echo ""
echo "📋 Summary:"
echo "=============================="
echo "SERVER_HOST: $SERVER_HOST"
echo "SERVER_USER: $SERVER_USER"
echo ""

# Check if values are valid
VALID=true

if [ -z "$SERVER_HOST" ]; then
    echo "❌ SERVER_HOST is empty"
    VALID=false
else
    echo "✅ SERVER_HOST: $SERVER_HOST"
fi

if [ -z "$SERVER_USER" ]; then
    echo "❌ SERVER_USER is empty"
    VALID=false
else
    echo "✅ SERVER_USER: $SERVER_USER"
fi

echo ""
if [ "$VALID" = true ]; then
    echo "✅ Values are ready for GitHub Secrets!"
    echo ""
    echo "📋 Add these to GitHub Secrets:"
    echo "   Name: SERVER_HOST"
    echo "   Value: $SERVER_HOST"
    echo ""
    echo "   Name: SERVER_USER"
    echo "   Value: $SERVER_USER"
else
    echo "❌ Please provide valid SERVER_HOST and SERVER_USER"
fi
