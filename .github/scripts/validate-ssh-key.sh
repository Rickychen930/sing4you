#!/bin/bash

# Quick validation script untuk SSH key
# Usage: ./validate-ssh-key.sh [private-key-content]

set -e

echo "🔍 SSH Key Validator"
echo "===================="
echo ""

if [ -z "$1" ]; then
    echo "Usage: $0 <private-key-content>"
    echo ""
    echo "Or pipe from file:"
    echo "  cat ~/.ssh/github_actions_deploy | $0"
    exit 1
fi

PRIVATE_KEY="$1"

# Check if it's a valid private key format
if echo "$PRIVATE_KEY" | grep -q "-----BEGIN.*PRIVATE KEY-----"; then
    echo "✅ Format: Valid PEM format"
    
    # Check if it has BEGIN and END markers
    if echo "$PRIVATE_KEY" | grep -q "-----BEGIN" && echo "$PRIVATE_KEY" | grep -q "-----END"; then
        echo "✅ Structure: Has BEGIN and END markers"
    else
        echo "❌ Structure: Missing BEGIN or END markers"
        exit 1
    fi
    
    # Try to extract public key
    TEMP_KEY=$(mktemp)
    echo "$PRIVATE_KEY > "$TEMP_KEY"
    
    if echo "$PRIVATE_KEY" | ssh-keygen -y -f /dev/stdin > /dev/null 2>&1; then
        echo "✅ Validity: Private key is valid and can generate public key"
        
        # Generate and show public key
        echo ""
        echo "📄 Generated Public Key:"
        echo "------------------------"
        echo "$PRIVATE_KEY" | ssh-keygen -y -f /dev/stdin
        echo ""
    else
        echo "❌ Validity: Private key is invalid or corrupted"
        exit 1
    fi
    
    # Check key type
    if echo "$PRIVATE_KEY" | grep -q "OPENSSH"; then
        echo "✅ Type: OpenSSH format (recommended for GitHub Actions)"
    elif echo "$PRIVATE_KEY" | grep -q "RSA"; then
        echo "⚠️  Type: RSA format (works but ed25519 is recommended)"
    fi
    
    echo ""
    echo "✅ Private key is ready for GitHub Secrets!"
    
else
    echo "❌ Format: Not a valid private key format"
    echo ""
    echo "Expected format:"
    echo "  -----BEGIN OPENSSH PRIVATE KEY-----"
    echo "  ..."
    echo "  -----END OPENSSH PRIVATE KEY-----"
    exit 1
fi
