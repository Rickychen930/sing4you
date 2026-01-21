# Quick Setup Guide - GitHub Secrets

## 🚀 Quick Start

### 1. Generate SSH Key untuk GitHub Actions

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_deploy -N ""

# Tampilkan private key (copy semua untuk GitHub Secret)
cat ~/.ssh/github_actions_deploy

# Tampilkan public key (copy ke server)
cat ~/.ssh/github_actions_deploy.pub
```

### 2. Setup Public Key di Server

```bash
# Copy public key ke server
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub user@your-server.com

# Atau manual:
ssh user@your-server.com
echo "PASTE_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### 3. Tambahkan Secrets di GitHub

1. Buka: `https://github.com/YOUR_USERNAME/sing4you/settings/secrets/actions`
2. Klik **New repository secret**
3. Tambahkan secrets berikut:

#### Wajib (Minimal untuk deploy):

| Secret Name | Value | Contoh |
|------------|-------|--------|
| `SSH_PRIVATE_KEY` | Private key (dari step 1) | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `SERVER_HOST` | IP atau domain server | `123.456.789.0` atau `server.example.com` |
| `SERVER_USER` | Username SSH | `deploy` atau `ubuntu` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://user:pass@host:27017/db` |
| `JWT_SECRET` | Random 32+ char string | Generate dengan: `openssl rand -base64 32` |
| `JWT_REFRESH_SECRET` | Random 32+ char string | Generate dengan: `openssl rand -base64 32` |
| `SITE_URL` | Domain (tanpa https://) | `christina-sings4you.com.au` |
| `CLIENT_URL` | URL dengan https:// | `https://christina-sings4you.com.au` |

### 4. Generate JWT Secrets

```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate JWT_REFRESH_SECRET (harus berbeda)
openssl rand -base64 32
```

### 5. Test Workflow

1. Push ke branch `master` atau `main`
2. Atau trigger manual: **Actions** → **Deploy to Production** → **Run workflow**

## ✅ Verification

Setelah semua secrets ditambahkan, workflow akan:
1. ✅ Build frontend dan backend
2. ✅ Setup SSH connection
3. ✅ Deploy ke server
4. ✅ Run health check

## 📖 Detail Lengkap

Lihat [SECRETS_SETUP.md](./SECRETS_SETUP.md) untuk dokumentasi lengkap.
