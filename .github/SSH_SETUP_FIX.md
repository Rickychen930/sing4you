# Fix SSH Permission Denied Error

## ❌ Error: "Permission denied (publickey,password)"

Error ini terjadi karena public key belum ditambahkan ke server atau SSH key tidak match.

## 🔧 Solusi

### Step 1: Dapatkan Public Key

```bash
# Tampilkan public key
cat ~/.ssh/github_actions_deploy.pub
```

Output akan seperti:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFVCdE7VuXHb8dXbbPG0XphO/qVtJ/dPyGO8znoqLAbT github-actions-deploy
```

### Step 2: Tambahkan Public Key ke Server

#### Method 1: Menggunakan Script (Recommended)

```bash
# Setup public key di server (akan prompt password jika belum setup)
./.github/scripts/setup-server-ssh.sh deploy@your-server.com
```

#### Method 2: Manual Setup

**A. SSH ke server dengan password:**
```bash
ssh deploy@your-server.com
```

**B. Di server, setup SSH:**
```bash
# 1. Create .ssh directory
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 2. Add public key
nano ~/.ssh/authorized_keys
# Paste public key (satu baris)
# Save: Ctrl+X, Y, Enter

# 3. Set permissions
chmod 600 ~/.ssh/authorized_keys

# 4. Verify
cat ~/.ssh/authorized_keys
```

**C. Test connection:**
```bash
# Exit dari server
exit

# Test dari local
ssh -i ~/.ssh/github_actions_deploy deploy@your-server.com
# Should work without password!
```

#### Method 3: Menggunakan ssh-copy-id

```bash
# Copy public key ke server
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub deploy@your-server.com
```

### Step 3: Verify Setup

```bash
# Test SSH connection
ssh -i ~/.ssh/github_actions_deploy deploy@your-server.com "echo 'Success!'"

# Should output: Success!
```

## ✅ Checklist

Pastikan semua ini sudah dilakukan:

- [ ] Public key sudah di server `~/.ssh/authorized_keys`
- [ ] Permissions correct:
  - `~/.ssh`: 700 (drwx------)
  - `~/.ssh/authorized_keys`: 600 (-rw-------)
- [ ] Public key format benar (satu baris, tidak ada line breaks)
- [ ] Username benar (check dengan `whoami` di server)
- [ ] Host/IP benar (check dengan `hostname -I` di server)
- [ ] SSH connection bisa di-test manual

## 🔍 Troubleshooting

### Issue: "Permission denied" masih terjadi

**Check 1: Verify public key di server**
```bash
# Di server
cat ~/.ssh/authorized_keys
# Pastikan public key ada di sini
```

**Check 2: Verify permissions**
```bash
# Di server
ls -la ~/.ssh/
# Should show:
# drwx------ .ssh
# -rw------- authorized_keys
```

**Check 3: Check SSH logs di server**
```bash
# Di server
sudo tail -f /var/log/auth.log
# Atau
sudo journalctl -u ssh -f

# Try connection dari GitHub Actions
# Check error messages
```

**Check 4: Verify username**
```bash
# Di server
whoami
# Pastikan username sama dengan SERVER_USER di GitHub Secrets
```

**Check 5: Check SELinux (jika enabled)**
```bash
# Di server (CentOS/RHEL)
sudo getenforce
# Jika Enforcing, mungkin perlu:
sudo restorecon -R ~/.ssh
```

### Issue: "Public key format invalid"

**Fix:**
- Pastikan public key satu baris
- Tidak ada line breaks
- Format: `ssh-ed25519 AAAA... comment`

### Issue: "Wrong username"

**Fix:**
1. Check username di server: `whoami`
2. Update `SERVER_USER` di GitHub Secrets
3. Pastikan public key di home directory user yang benar

## 🧪 Test Connection dari Local

Sebelum deploy, test dulu dari local:

```bash
# Test dengan verbose (untuk debugging)
ssh -v -i ~/.ssh/github_actions_deploy deploy@your-server.com

# Test command execution
ssh -i ~/.ssh/github_actions_deploy deploy@your-server.com "whoami"

# Test file creation
ssh -i ~/.ssh/github_actions_deploy deploy@your-server.com "touch /tmp/test && echo 'Success'"
```

## 📋 Quick Setup Commands

```bash
# 1. Get public key
PUBLIC_KEY=$(cat ~/.ssh/github_actions_deploy.pub)
echo "$PUBLIC_KEY"

# 2. Copy ke clipboard (Mac)
cat ~/.ssh/github_actions_deploy.pub | pbcopy

# 3. SSH ke server dan paste
ssh deploy@your-server.com
mkdir -p ~/.ssh && chmod 700 ~/.ssh
echo "PASTE_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
exit

# 4. Test
ssh -i ~/.ssh/github_actions_deploy deploy@your-server.com "echo 'Success!'"
```

## 🎯 After Setup

Setelah public key ditambahkan:

1. ✅ Test connection manual (harus work tanpa password)
2. ✅ Verify di GitHub Secrets:
   - `SSH_PRIVATE_KEY` sudah ada
   - `SERVER_HOST` sudah ada
   - `SERVER_USER` sudah ada
3. ✅ Re-run GitHub Actions workflow
4. ✅ Check logs untuk confirm connection successful

## 📚 Related

- [SECRETS_SETUP.md](./SECRETS_SETUP.md) - Setup semua secrets
- [SSH_KEY_VALIDATION.md](./SSH_KEY_VALIDATION.md) - Validate SSH keys
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - General troubleshooting
