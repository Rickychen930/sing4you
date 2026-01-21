# Troubleshooting GitHub Actions Workflow

## Common Errors & Solutions

### ❌ Error: "ssh-keyscan: usage: ssh-keyscan [-46cDHv]..."

**Penyebab:**
- Secret `SERVER_HOST` tidak terdefinisi atau kosong
- Workflow mencoba menjalankan `ssh-keyscan` tanpa hostname

**Solusi:**
1. Pastikan secret `SERVER_HOST` sudah ditambahkan di GitHub
   - Buka: Settings → Secrets and variables → Actions
   - Pastikan ada secret dengan nama: `SERVER_HOST`
   - Value harus berupa IP atau domain (contoh: `123.456.789.0` atau `server.example.com`)

2. Check secret name (case-sensitive):
   - ✅ Benar: `SERVER_HOST`
   - ❌ Salah: `server_host`, `Server_Host`, `SERVER-HOST`

3. Pastikan value tidak kosong

### ❌ Error: "The ssh-private-key argument is empty"

**Penyebab:**
- Secret `SSH_PRIVATE_KEY` tidak terdefinisi atau kosong

**Solusi:**
1. Generate SSH key (jika belum ada):
   ```bash
   ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_deploy -N ""
   ```

2. Copy private key ke GitHub Secrets:
   - Name: `SSH_PRIVATE_KEY`
   - Value: Seluruh private key (termasuk `-----BEGIN` dan `-----END`)

3. Pastikan format benar (lihat `.github/SSH_KEY_VALIDATION.md`)

### ❌ Error: "Permission denied (publickey)"

**Penyebab:**
- Public key belum ditambahkan ke server
- Wrong user atau host
- Permissions salah di server

**Solusi:**
1. Copy public key ke server:
   ```bash
   cat ~/.ssh/github_actions_deploy.pub
   # Paste ke ~/.ssh/authorized_keys di server
   ```

2. Set permissions di server:
   ```bash
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

3. Verify `SERVER_USER` dan `SERVER_HOST` benar

### ❌ Error: "Host key verification failed"

**Penyebab:**
- Server host key belum di known_hosts

**Solusi:**
- Workflow sudah include step untuk add host ke known_hosts
- Jika masih error, bisa skip dengan:
  ```yaml
  - name: Add server to known hosts
    run: |
      mkdir -p ~/.ssh
      ssh-keyscan -H ${{ secrets.SERVER_HOST }} >> ~/.ssh/known_hosts || true
  ```

### ❌ Error: "Connection refused" atau "Connection timed out"

**Penyebab:**
- Server tidak accessible
- Firewall block SSH port
- Wrong IP/hostname

**Solusi:**
1. Test koneksi manual:
   ```bash
   ssh -i ~/.ssh/github_actions_deploy user@your-server.com
   ```

2. Check firewall:
   ```bash
   # Di server, pastikan SSH port (22) terbuka
   sudo ufw allow 22/tcp
   ```

3. Verify `SERVER_HOST` benar

### ❌ Error: "MONGODB_URI secret is not set"

**Penyebab:**
- Secret `MONGODB_URI` belum ditambahkan

**Solusi:**
1. Tambahkan secret `MONGODB_URI` di GitHub
2. Format: `mongodb://user:password@host:port/database?authSource=admin`

### ❌ Error: "JWT_SECRET secret is not set"

**Penyebab:**
- Secret `JWT_SECRET` belum ditambahkan

**Solusi:**
1. Generate JWT secret:
   ```bash
   openssl rand -base64 32
   ```

2. Tambahkan sebagai secret `JWT_SECRET` di GitHub

## 🔍 Debugging Steps

### 1. Check Secrets di GitHub

1. Buka repository → Settings → Secrets and variables → Actions
2. Pastikan semua required secrets ada:
   - `SSH_PRIVATE_KEY`
   - `SERVER_HOST`
   - `SERVER_USER`
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `SITE_URL`
   - `CLIENT_URL`

### 2. Test SSH Connection Locally

```bash
# Test dengan private key
ssh -i ~/.ssh/github_actions_deploy user@your-server.com

# Test dengan verbose
ssh -v -i ~/.ssh/github_actions_deploy user@your-server.com
```

### 3. Check Workflow Logs

1. Buka Actions tab di GitHub
2. Klik pada failed workflow run
3. Expand setiap step untuk melihat error details
4. Check step yang gagal dan error message

### 4. Validate SSH Keys

```bash
# Run validation script
./.github/scripts/check-ssh-keys.sh
```

## ✅ Pre-Deployment Checklist

Sebelum deploy, pastikan:

- [ ] `SSH_PRIVATE_KEY` sudah di GitHub Secrets
- [ ] `SERVER_HOST` sudah di GitHub Secrets (IP atau domain)
- [ ] `SERVER_USER` sudah di GitHub Secrets (username SSH)
- [ ] Public key sudah di server `~/.ssh/authorized_keys`
- [ ] Server permissions correct (700 untuk .ssh, 600 untuk authorized_keys)
- [ ] `MONGODB_URI` sudah di GitHub Secrets
- [ ] `JWT_SECRET` sudah di GitHub Secrets
- [ ] `JWT_REFRESH_SECRET` sudah di GitHub Secrets
- [ ] `SITE_URL` sudah di GitHub Secrets
- [ ] `CLIENT_URL` sudah di GitHub Secrets
- [ ] SSH connection bisa di-test manual
- [ ] Server accessible dari internet

## 🛠️ Workflow Improvements

Workflow sudah di-update dengan:
- ✅ Validation step untuk check required secrets
- ✅ Better error messages
- ✅ Graceful handling untuk ssh-keyscan
- ✅ Clear error reporting

## 📚 Related Documentation

- [SECRETS_SETUP.md](./SECRETS_SETUP.md) - Setup secrets lengkap
- [QUICK_SETUP.md](./QUICK_SETUP.md) - Quick start guide
- [SSH_KEY_VALIDATION.md](./SSH_KEY_VALIDATION.md) - SSH key validation
