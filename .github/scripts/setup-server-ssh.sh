#!/bin/bash

# Script untuk setup SSH public key di server
# Usage: ./setup-server-ssh.sh <server-user>@<server-host> [public-key-file]

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <user@host> [public-key-file]"
    echo ""
    echo "Examples:"
    echo "  $0 deploy@123.456.789.0"
    echo "  $0 deploy@server.example.com ~/.ssh/github_actions_deploy.pub"
    exit 1
fi

SERVER="$1"
PUBLIC_KEY_FILE="${2:-$HOME/.ssh/github_actions_deploy.pub}"

if [ ! -f "$PUBLIC_KEY_FILE" ]; then
    echo "❌ Public key file not found: $PUBLIC_KEY_FILE"
    echo ""
    echo "Generate key first:"
    echo "  ssh-keygen -t ed25519 -C 'github-actions' -f ~/.ssh/github_actions_deploy -N \"\""
    exit 1
fi

echo "🔐 Setting up SSH public key on server..."
echo "Server: $SERVER"
echo "Public key: $PUBLIC_KEY_FILE"
echo ""

# Read public key
PUBLIC_KEY=$(cat "$PUBLIC_KEY_FILE")

echo "📋 Public key to add:"
echo "$PUBLIC_KEY"
echo ""

# Method 1: Try ssh-copy-id (easiest)
echo "Method 1: Trying ssh-copy-id..."
if ssh-copy-id -i "$PUBLIC_KEY_FILE" "$SERVER" 2>/dev/null; then
    echo "✅ Public key added successfully using ssh-copy-id!"
    exit 0
fi

echo "⚠️  ssh-copy-id failed, trying manual method..."
echo ""

# Method 2: Manual setup
echo "Method 2: Manual setup..."
echo ""
echo "Please run these commands on the server:"
echo "----------------------------------------"
echo ""
echo "1. SSH to server:"
echo "   ssh $SERVER"
echo ""
echo "2. Create .ssh directory (if not exists):"
echo "   mkdir -p ~/.ssh"
echo "   chmod 700 ~/.ssh"
echo ""
echo "3. Add public key to authorized_keys:"
echo "   echo '$PUBLIC_KEY' >> ~/.ssh/authorized_keys"
echo ""
echo "4. Set correct permissions:"
echo "   chmod 600 ~/.ssh/authorized_keys"
echo ""
echo "5. Test connection:"
echo "   exit"
echo "   ssh -i $PUBLIC_KEY_FILE $SERVER 'echo Success!'"
echo ""

# Try to do it automatically if password auth is available
echo "Attempting automatic setup (requires password authentication)..."
echo ""

ssh "$SERVER" << EOF
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "$PUBLIC_KEY" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
echo "✅ Public key added to ~/.ssh/authorized_keys"
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Public key setup completed!"
    echo ""
    echo "Testing connection..."
    ssh -i "$PUBLIC_KEY_FILE" -o StrictHostKeyChecking=no "$SERVER" "echo '✅ SSH connection successful!'" && {
        echo ""
        echo "✅ Setup complete! SSH connection works."
    } || {
        echo ""
        echo "⚠️  Setup completed but connection test failed."
        echo "Please verify manually:"
        echo "  ssh -i $PUBLIC_KEY_FILE $SERVER"
    }
else
    echo ""
    echo "❌ Automatic setup failed. Please use manual method above."
    exit 1
fi
