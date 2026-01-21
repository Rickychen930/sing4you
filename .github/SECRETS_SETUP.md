# GitHub Secrets Setup Guide

Workflow GitHub Actions memerlukan beberapa secrets yang harus dikonfigurasi di repository settings.

## 🔐 Secrets yang Diperlukan

### 1. SSH_PRIVATE_KEY (Wajib untuk Deploy)

SSH private key untuk mengakses server deployment.

#### Cara Setup:

**Step 1: Generate SSH Key Pair (jika belum ada)**

```bash
# Generate SSH key pair (jika belum ada)
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy

# Atau jika ed25519 tidak didukung, gunakan RSA:
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

**Step 2: Copy Private Key**

```bash
# Tampilkan private key (akan digunakan di GitHub Secrets)
cat ~/.ssh/github_actions_deploy

# Copy seluruh output termasuk:
# -----BEGIN OPENSSH PRIVATE KEY-----
# ... (semua baris)
# -----END OPENSSH PRIVATE KEY-----
```

**Step 3: Copy Public Key ke Server**

```bash
# Tampilkan public key
cat ~/.ssh/github_actions_deploy.pub

# Copy public key ke server
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub user@your-server.com

# Atau manual:
# 1. SSH ke server
ssh user@your-server.com

# 2. Edit authorized_keys
nano ~/.ssh/authorized_keys

# 3. Paste public key (satu baris)
# 4. Set permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

**Step 4: Tambahkan ke GitHub Secrets**

1. Buka repository di GitHub
2. Pergi ke **Settings** → **Secrets and variables** → **Actions**
3. Klik **New repository secret**
4. Name: `SSH_PRIVATE_KEY`
5. Value: Paste seluruh private key (termasuk `-----BEGIN` dan `-----END`)
6. Klik **Add secret**

### 2. SERVER_HOST

Hostname atau IP address server deployment.

**Contoh:**
- `your-domain.com`
- `123.456.789.0`
- `staging.your-domain.com`

### 3. SERVER_USER

Username untuk SSH ke server.

**Contoh:**
- `deploy`
- `www-data`
- `ubuntu`
- `root`

### 4. MONGODB_URI

MongoDB connection string.

**Format:**
```
mongodb://username:password@host:port/database?authSource=admin
```

**Contoh:**
```
mongodb://admin:password123@localhost:27017/christina_sings4you?authSource=admin
```

### 5. JWT_SECRET

Secret key untuk JWT token signing (minimal 32 karakter, random string).

**Generate:**
```bash
# Generate random secret
openssl rand -base64 32
```

### 6. JWT_REFRESH_SECRET

Secret key untuk JWT refresh token (minimal 32 karakter, berbeda dari JWT_SECRET).

**Generate:**
```bash
# Generate random secret
openssl rand -base64 32
```

### 7. SITE_URL

URL website production (tanpa https://).

**Contoh:**
- `christina-sings4you.com.au`
- `www.christina-sings4you.com.au`

### 8. CLIENT_URL

URL frontend/client (dengan https://).

**Contoh:**
- `https://christina-sings4you.com.au`
- `https://www.christina-sings4you.com.au`

### 9. CLOUDINARY_CLOUD_NAME (Opsional)

Cloudinary cloud name untuk media storage.

### 10. CLOUDINARY_API_KEY (Opsional)

Cloudinary API key.

### 11. CLOUDINARY_API_SECRET (Opsional)

Cloudinary API secret.

### 12. SMTP_HOST (Opsional)

SMTP server untuk email.

**Contoh:**
- `smtp.gmail.com`
- `smtp.sendgrid.net`
- `mail.your-domain.com`

### 13. SMTP_PORT (Opsional)

SMTP port (default: 587).

**Contoh:**
- `587` (TLS)
- `465` (SSL)
- `25` (unencrypted, tidak disarankan)

### 14. SMTP_USER (Opsional)

SMTP username/email.

### 15. SMTP_PASS (Opsional)

SMTP password.

### 16. SMTP_FROM (Opsional)

Email address untuk "From" field.

**Contoh:**
- `noreply@christina-sings4you.com.au`
- `christina@sings4you.com.au`

## 📝 Cara Menambahkan Secrets di GitHub

1. Buka repository di GitHub
2. Klik **Settings** (di bagian atas repository)
3. Di sidebar kiri, klik **Secrets and variables** → **Actions**
4. Klik **New repository secret**
5. Isi:
   - **Name**: Nama secret (contoh: `SSH_PRIVATE_KEY`)
   - **Value**: Nilai secret
6. Klik **Add secret**
7. Ulangi untuk semua secrets yang diperlukan

## ✅ Checklist Secrets

Gunakan checklist ini untuk memastikan semua secrets sudah ditambahkan:

### Wajib (Required)
- [ ] `SSH_PRIVATE_KEY` - SSH private key untuk deployment
- [ ] `SERVER_HOST` - Hostname/IP server
- [ ] `SERVER_USER` - Username SSH
- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - JWT signing secret
- [ ] `JWT_REFRESH_SECRET` - JWT refresh secret
- [ ] `SITE_URL` - Domain website (tanpa https://)
- [ ] `CLIENT_URL` - URL frontend (dengan https://)

### Opsional (Optional)
- [ ] `CLOUDINARY_CLOUD_NAME` - Untuk media storage
- [ ] `CLOUDINARY_API_KEY` - Cloudinary API key
- [ ] `CLOUDINARY_API_SECRET` - Cloudinary API secret
- [ ] `SMTP_HOST` - SMTP server
- [ ] `SMTP_PORT` - SMTP port
- [ ] `SMTP_USER` - SMTP username
- [ ] `SMTP_PASS` - SMTP password
- [ ] `SMTP_FROM` - Email sender address

## 🔒 Security Best Practices

1. **Jangan commit secrets ke repository**
   - Jangan pernah commit `.env` files
   - Jangan hardcode secrets di code
   - Gunakan GitHub Secrets untuk semua sensitive data

2. **Rotate secrets secara berkala**
   - Ganti JWT secrets setiap 3-6 bulan
   - Ganti SSH keys jika dicurigai compromised
   - Update passwords secara berkala

3. **Gunakan SSH key dengan passphrase**
   - Saat generate SSH key, gunakan passphrase yang kuat
   - Simpan passphrase di password manager

4. **Limit SSH key access**
   - Gunakan dedicated SSH key untuk GitHub Actions
   - Jangan gunakan personal SSH key
   - Set proper permissions di server

5. **Monitor secret usage**
   - Review GitHub Actions logs secara berkala
   - Set up alerts untuk failed deployments
   - Audit secret access

## 🧪 Testing SSH Connection

Setelah setup SSH key, test koneksi:

```bash
# Test SSH connection
ssh -i ~/.ssh/github_actions_deploy user@your-server.com

# Test dengan verbose untuk debugging
ssh -v -i ~/.ssh/github_actions_deploy user@your-server.com
```

## 🐛 Troubleshooting

### Error: "The ssh-private-key argument is empty"

**Penyebab:**
- Secret `SSH_PRIVATE_KEY` belum ditambahkan di GitHub
- Nama secret salah (harus tepat `SSH_PRIVATE_KEY`)

**Solusi:**
1. Pastikan secret sudah ditambahkan di GitHub Settings → Secrets
2. Pastikan nama secret tepat: `SSH_PRIVATE_KEY` (case-sensitive)
3. Pastikan value tidak kosong dan termasuk `-----BEGIN` dan `-----END`

### Error: "Permission denied (publickey)"

**Penyebab:**
- Public key belum ditambahkan ke server
- Permissions salah di server
- Wrong user atau host

**Solusi:**
1. Pastikan public key sudah di `~/.ssh/authorized_keys` di server
2. Check permissions:
   ```bash
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```
3. Pastikan `SERVER_USER` dan `SERVER_HOST` benar

### Error: "Host key verification failed"

**Penyebab:**
- Server host key belum di known_hosts

**Solusi:**
- Workflow sudah include step untuk add server ke known_hosts
- Jika masih error, tambahkan manual:
  ```bash
  ssh-keyscan -H your-server.com >> ~/.ssh/known_hosts
  ```

## 📚 Referensi

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [SSH Key Generation](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
- [webfactory/ssh-agent Action](https://github.com/webfactory/ssh-agent)
