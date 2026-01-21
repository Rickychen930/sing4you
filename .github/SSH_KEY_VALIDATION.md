# SSH Key Validation Guide

Panduan untuk memvalidasi SSH private key dan public key sebelum digunakan di GitHub Actions.

## 🔍 Quick Check

### Method 1: Menggunakan Script (Recommended)

```bash
# Check SSH keys yang sudah ada
./.github/scripts/check-ssh-keys.sh

# Atau dengan path custom
./.github/scripts/check-ssh-keys.sh ~/.ssh/my_key
```

### Method 2: Manual Check

#### Check Private Key

```bash
# 1. Check file exists
ls -la ~/.ssh/github_actions_deploy

# 2. Check format (harus ada BEGIN dan END)
head -n 1 ~/.ssh/github_actions_deploy
# Output harus: -----BEGIN OPENSSH PRIVATE KEY----- atau -----BEGIN RSA PRIVATE KEY-----

tail -n 1 ~/.ssh/github_actions_deploy
# Output harus: -----END OPENSSH PRIVATE KEY----- atau -----END RSA PRIVATE KEY-----

# 3. Check permissions (harus 600)
stat -f "%A" ~/.ssh/github_actions_deploy
# Output harus: 600

# 4. Validate key (harus bisa generate public key)
ssh-keygen -y -f ~/.ssh/github_actions_deploy
# Harus output public key tanpa error
```

#### Check Public Key

```bash
# 1. Check file exists
ls -la ~/.ssh/github_actions_deploy.pub

# 2. Check format
cat ~/.ssh/github_actions_deploy.pub
# Output harus: ssh-ed25519 AAAA... comment atau ssh-rsa AAAA... comment

# 3. Check fingerprint
ssh-keygen -l -f ~/.ssh/github_actions_deploy.pub
# Output: 256 SHA256:xxxxx... comment (ED25519)
# atau: 2048 SHA256:xxxxx... comment (RSA)
```

#### Check Key Pair Match

```bash
# Generate public key dari private key
GENERATED=$(ssh-keygen -y -f ~/.ssh/github_actions_deploy)

# Compare dengan public key yang ada
STORED=$(cat ~/.ssh/github_actions_deploy.pub)

# Check if match
if [ "$GENERATED" = "$STORED" ]; then
    echo "✅ Keys match!"
else
    echo "❌ Keys don't match!"
fi
```

## ✅ Checklist Validasi

Gunakan checklist ini untuk memastikan SSH key siap digunakan:

### Private Key
- [ ] File exists dan readable
- [ ] Format: `-----BEGIN OPENSSH PRIVATE KEY-----` atau `-----BEGIN RSA PRIVATE KEY-----`
- [ ] Ada END marker: `-----END ... PRIVATE KEY-----`
- [ ] Permissions: 600 (rw-------)
- [ ] Bisa generate public key: `ssh-keygen -y -f key` works
- [ ] Tidak corrupted (tidak ada error saat validate)

### Public Key
- [ ] File exists dan readable
- [ ] Format: `ssh-ed25519 AAAA...` atau `ssh-rsa AAAA...`
- [ ] Bisa generate fingerprint: `ssh-keygen -l -f key.pub` works
- [ ] Match dengan private key (lihat check di atas)

### Untuk GitHub Actions
- [ ] Private key format valid (PEM dengan BEGIN/END)
- [ ] Private key bisa di-copy seluruhnya (termasuk BEGIN dan END)
- [ ] Public key sudah di server `~/.ssh/authorized_keys`
- [ ] Server permissions correct (700 untuk .ssh, 600 untuk authorized_keys)

## 🧪 Test SSH Connection

Setelah validasi, test koneksi:

```bash
# Test dengan private key
ssh -i ~/.ssh/github_actions_deploy user@your-server.com

# Test dengan verbose (untuk debugging)
ssh -v -i ~/.ssh/github_actions_deploy user@your-server.com

# Test tanpa interactive (untuk CI/CD)
ssh -i ~/.ssh/github_actions_deploy -o StrictHostKeyChecking=no user@your-server.com "echo 'Connection successful'"
```

## 🔧 Common Issues & Fixes

### Issue: "Invalid format" atau "Bad permissions"

**Fix:**
```bash
# Fix permissions
chmod 600 ~/.ssh/github_actions_deploy
chmod 644 ~/.ssh/github_actions_deploy.pub
```

### Issue: "Keys don't match"

**Fix:**
```bash
# Regenerate public key dari private key
ssh-keygen -y -f ~/.ssh/github_actions_deploy > ~/.ssh/github_actions_deploy.pub
```

### Issue: "Permission denied" saat test SSH

**Check:**
1. Public key sudah di server `~/.ssh/authorized_keys`
2. Server permissions:
   ```bash
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```
3. SELinux tidak block (jika enabled)
4. Firewall allow SSH port

### Issue: "Private key untuk GitHub Secrets tidak work"

**Check:**
1. Copy seluruh private key termasuk BEGIN dan END lines
2. Tidak ada extra spaces atau newlines
3. Format benar (OpenSSH atau RSA)
4. Secret name tepat: `SSH_PRIVATE_KEY` (case-sensitive)

## 📋 Format yang Benar

### Private Key (untuk GitHub Secrets)

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACD...
(many lines)
...
-----END OPENSSH PRIVATE KEY-----
```

**Penting:**
- Harus include `-----BEGIN` line
- Harus include `-----END` line
- Tidak ada extra spaces di awal/akhir
- Semua baris harus di-copy

### Public Key (untuk server)

```
ssh-ed25519 AAAAAC3NzaC1lZDI1NTE5AAAAI... comment
```

atau

```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC... comment
```

**Penting:**
- Satu baris saja
- Format: `type key comment`
- Tidak ada line breaks

## 🎯 Quick Validation Commands

```bash
# 1. Check private key format
head -n 1 ~/.ssh/github_actions_deploy | grep -q "BEGIN.*PRIVATE KEY" && echo "✅ Valid format" || echo "❌ Invalid"

# 2. Check permissions
[ "$(stat -f "%A" ~/.ssh/github_actions_deploy 2>/dev/null || stat -c "%a" ~/.ssh/github_actions_deploy 2>/dev/null)" = "600" ] && echo "✅ Permissions OK" || echo "❌ Fix permissions"

# 3. Validate key
ssh-keygen -y -f ~/.ssh/github_actions_deploy > /dev/null 2>&1 && echo "✅ Key valid" || echo "❌ Key invalid"

# 4. Check key pair match
[ "$(ssh-keygen -y -f ~/.ssh/github_actions_deploy)" = "$(cat ~/.ssh/github_actions_deploy.pub)" ] && echo "✅ Keys match" || echo "❌ Keys don't match"
```

## 📚 Referensi

- [OpenSSH Key Formats](https://www.openssh.com/manual.html)
- [GitHub SSH Key Guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [SSH Key Best Practices](https://www.ssh.com/academy/ssh/key)
