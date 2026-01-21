# CI/CD Quick Start Guide

Panduan cepat untuk setup CI/CD dengan GitHub Actions.

## ⚡ Setup Cepat (5 Menit)

### 1. Generate SSH Key

```bash
# Di local machine
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_deploy
```

### 2. Copy Public Key ke Server

```bash
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@76.13.96.198
```

### 3. Setup GitHub Secrets

Buka: **GitHub Repository → Settings → Secrets and variables → Actions → New repository secret**

Tambahkan secrets berikut:

| Secret Name | Value | Contoh |
|------------|-------|--------|
| `SSH_PRIVATE_KEY` | Isi file `~/.ssh/github_actions_deploy` | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `SERVER_HOST` | IP server | `76.13.96.198` |
| `SERVER_USER` | Username SSH | `root` |
| `CLIENT_URL` | URL frontend | `https://christina-sings4you.com.au` |
| `SITE_URL` | Domain (tanpa https://) | `christina-sings4you.com.au` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Generate dengan: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` | Random string |
| `JWT_REFRESH_SECRET` | Generate (nilai berbeda) | Random string |

**Optional** (jika menggunakan):
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`

### 4. Setup Server

```bash
ssh root@76.13.96.198
cd /var/www/christina-sings4you
sudo ./deployment/scripts/setup-github-actions.sh
```

### 5. Test Deployment

```bash
# Push ke master branch
git add .
git commit -m "Setup CI/CD"
git push origin master
```

Buka tab **Actions** di GitHub untuk melihat deployment progress.

## ✅ Checklist

- [ ] SSH key sudah di-generate
- [ ] Public key sudah di-copy ke server
- [ ] Test SSH: `ssh -i ~/.ssh/github_actions_deploy root@76.13.96.198`
- [ ] Semua GitHub Secrets sudah di-setup
- [ ] Server sudah di-setup
- [ ] Push ke master untuk test

## 🚀 Cara Menggunakan

### Deploy Otomatis
```bash
git push origin master
```

### Deploy Manual
1. GitHub → Actions → Deploy to Production → Run workflow

## 🔍 Monitor Deployment

- **GitHub**: Tab **Actions** → Pilih workflow run
- **Server**: `ssh root@76.13.96.198 && pm2 logs`

## 🐛 Troubleshooting

### SSH Connection Failed
```bash
# Test SSH manual
ssh -i ~/.ssh/github_actions_deploy root@76.13.96.198

# Pastikan public key di server
cat ~/.ssh/authorized_keys | grep github-actions
```

### Deployment Failed
- Cek logs di GitHub Actions
- Cek server logs: `pm2 logs christina-sings4you-api`
- Cek environment: `cat /var/www/christina-sings4you/.env`

## 📚 Dokumentasi Lengkap

Lihat `CI_CD_SETUP.md` untuk dokumentasi lengkap.
