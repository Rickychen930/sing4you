#!/bin/bash

# Script untuk check dan validate SSH keys
# Usage: ./check-ssh-keys.sh [path-to-private-key]

set -e

PRIVATE_KEY_PATH="${1:-~/.ssh/github_actions_deploy}"
PUBLIC_KEY_PATH="${PRIVATE_KEY_PATH}.pub"

echo "🔍 Checking SSH Keys..."
echo "================================"
echo ""

# Check if private key exists
if [ ! -f "$PRIVATE_KEY_PATH" ]; then
    echo "❌ Private key not found: $PRIVATE_KEY_PATH"
    echo ""
    echo "💡 To generate a new key pair:"
    echo "   ssh-keygen -t ed25519 -C \"github-actions\" -f ~/.ssh/github_actions_deploy -N \"\""
    exit 1
fi

# Check if public key exists
if [ ! -f "$PUBLIC_KEY_PATH" ]; then
    echo "❌ Public key not found: $PUBLIC_KEY_PATH"
    echo ""
    echo "💡 To generate public key from private key:"
    echo "   ssh-keygen -y -f $PRIVATE_KEY_PATH > $PUBLIC_KEY_PATH"
    exit 1
fi

echo "✅ Private key found: $PRIVATE_KEY_PATH"
echo "✅ Public key found: $PUBLIC_KEY_PATH"
echo ""

# Check private key format
echo "📋 Private Key Information:"
echo "---------------------------"
PRIVATE_KEY_TYPE=$(head -n 1 "$PRIVATE_KEY_PATH" | cut -d' ' -f1)
PRIVATE_KEY_START=$(head -n 1 "$PRIVATE_KEY_PATH")
PRIVATE_KEY_END=$(tail -n 1 "$PRIVATE_KEY_PATH")

if [[ "$PRIVATE_KEY_START" == "-----BEGIN"* ]]; then
    echo "✅ Format: Valid (PEM format)"
else
    echo "❌ Format: Invalid (should start with -----BEGIN)"
fi

if [[ "$PRIVATE_KEY_END" == "-----END"* ]]; then
    echo "✅ End marker: Valid"
else
    echo "❌ End marker: Invalid (should end with -----END)"
fi

# Check key type
if [[ "$PRIVATE_KEY_START" == *"OPENSSH PRIVATE KEY"* ]]; then
    echo "✅ Type: OpenSSH format (recommended)"
elif [[ "$PRIVATE_KEY_START" == *"RSA PRIVATE KEY"* ]]; then
    echo "⚠️  Type: RSA (legacy format, consider using ed25519)"
elif [[ "$PRIVATE_KEY_START" == *"PRIVATE KEY"* ]]; then
    echo "✅ Type: Generic private key"
else
    echo "⚠️  Type: Unknown format"
fi

# Check permissions
PRIVATE_KEY_PERMS=$(stat -f "%A" "$PRIVATE_KEY_PATH" 2>/dev/null || stat -c "%a" "$PRIVATE_KEY_PATH" 2>/dev/null)
if [ "$PRIVATE_KEY_PERMS" = "600" ] || [ "$PRIVATE_KEY_PERMS" = "0600" ]; then
    echo "✅ Permissions: 600 (correct)"
else
    echo "⚠️  Permissions: $PRIVATE_KEY_PERMS (should be 600)"
    echo "   Fix with: chmod 600 $PRIVATE_KEY_PATH"
fi

echo ""

# Check public key format
echo "📋 Public Key Information:"
echo "---------------------------"
PUBLIC_KEY_CONTENT=$(cat "$PUBLIC_KEY_PATH")
PUBLIC_KEY_TYPE=$(echo "$PUBLIC_KEY_CONTENT" | cut -d' ' -f1)
PUBLIC_KEY_FINGERPRINT=$(ssh-keygen -l -f "$PUBLIC_KEY_PATH" 2>/dev/null | cut -d' ' -f2 || echo "N/A")

if [[ "$PUBLIC_KEY_TYPE" == "ssh-ed25519" ]]; then
    echo "✅ Type: ED25519 (recommended)"
elif [[ "$PUBLIC_KEY_TYPE" == "ssh-rsa" ]]; then
    echo "⚠️  Type: RSA (legacy, consider using ed25519)"
elif [[ "$PUBLIC_KEY_TYPE" == "ecdsa-sha2"* ]]; then
    echo "✅ Type: ECDSA"
else
    echo "⚠️  Type: $PUBLIC_KEY_TYPE (unknown)"
fi

if [ "$PUBLIC_KEY_FINGERPRINT" != "N/A" ]; then
    echo "✅ Fingerprint: $PUBLIC_KEY_FINGERPRINT"
else
    echo "❌ Fingerprint: Could not generate"
fi

# Check if keys match
echo ""
echo "🔗 Key Pair Validation:"
echo "---------------------------"
GENERATED_PUBLIC=$(ssh-keygen -y -f "$PRIVATE_KEY_PATH" 2>/dev/null)
STORED_PUBLIC=$(cat "$PUBLIC_KEY_PATH")

if [ "$GENERATED_PUBLIC" = "$STORED_PUBLIC" ]; then
    echo "✅ Keys match: Private and public keys are a valid pair"
else
    echo "❌ Keys don't match: Private and public keys are NOT a pair"
    echo ""
    echo "💡 Regenerate public key:"
    echo "   ssh-keygen -y -f $PRIVATE_KEY_PATH > $PUBLIC_KEY_PATH"
fi

echo ""

# Display keys (first/last lines only for security)
echo "📄 Private Key Preview (first 3 lines):"
echo "---------------------------"
head -n 3 "$PRIVATE_KEY_PATH"
echo "..."
echo ""

echo "📄 Public Key:"
echo "---------------------------"
cat "$PUBLIC_KEY_PATH"
echo ""

# Check if ready for GitHub
echo "🚀 GitHub Actions Readiness:"
echo "---------------------------"
READY=true

if [[ ! "$PRIVATE_KEY_START" == "-----BEGIN"* ]] || [[ ! "$PRIVATE_KEY_END" == "-----END"* ]]; then
    echo "❌ Private key format invalid for GitHub Secrets"
    READY=false
else
    echo "✅ Private key format valid for GitHub Secrets"
fi

if [ -z "$PUBLIC_KEY_CONTENT" ]; then
    echo "❌ Public key is empty"
    READY=false
else
    echo "✅ Public key is ready"
fi

if [ "$READY" = true ]; then
    echo ""
    echo "✅ SSH keys are ready for GitHub Actions!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Copy private key to GitHub Secrets (SSH_PRIVATE_KEY):"
    echo "   cat $PRIVATE_KEY_PATH"
    echo ""
    echo "2. Copy public key to server (~/.ssh/authorized_keys):"
    echo "   cat $PUBLIC_KEY_PATH"
    echo ""
    echo "3. Test SSH connection:"
    echo "   ssh -i $PRIVATE_KEY_PATH user@your-server.com"
else
    echo ""
    echo "❌ SSH keys need attention before using with GitHub Actions"
    exit 1
fi
