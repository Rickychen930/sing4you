# Server Information Guide

Panduan untuk mendapatkan dan memverifikasi informasi `SERVER_HOST` dan `SERVER_USER` untuk GitHub Actions.

## 🔍 Cara Mendapatkan SERVER_HOST

### Option 1: Jika Anda Punya Server

**IP Address:**
```bash
# Di server, check IP address
ip addr show
# atau
hostname -I
# atau
curl ifconfig.me  # Public IP
```

**Domain:**
- Jika sudah setup domain, gunakan domain name
- Contoh: `christina-sings4you.com.au`
- Contoh: `server.christina-sings4you.com.au`

### Option 2: Check dari Provider

**VPS Providers:**
- **DigitalOcean**: Dashboard → Droplets → IP Address
- **AWS EC2**: EC2 Dashboard → Instances → Public IPv4 address
- **Linode**: Linode Dashboard → IP Address
- **Vultr**: Server Details → IP Address
- **Hetzner**: Server → IP Address

### Option 3: Check dari Local Machine

```bash
# Jika sudah bisa SSH ke server
ssh user@your-server.com "hostname -I"

# Check public IP
curl ifconfig.me
```

## 👤 Cara Mendapatkan SERVER_USER

### Common SSH Users

**Linux Distributions:**
- **Ubuntu/Debian**: `ubuntu`, `debian`, atau `root`
- **CentOS/RHEL**: `centos`, `ec2-user`, atau `root`
- **Fedora**: `fedora` atau `root`
- **Arch**: `arch` atau `root`
- **Custom**: Bisa user apapun yang Anda buat

### Check Current User di Server

```bash
# SSH ke server dan check
whoami

# Check home directory
echo $HOME

# Check if user exists
id username
```

### Create New User (Recommended)

Untuk security, buat dedicated user untuk deployment:

```bash
# Di server, create new user
sudo adduser deploy

# Add to sudo group (optional, untuk deployment scripts)
sudo usermod -aG sudo deploy

# Switch to new user
su - deploy

# Check user
whoami  # Should output: deploy
```

## 🧪 Test dengan Script

Gunakan script untuk check server info:

```bash
# Check dengan IP
./.github/scripts/check-server-info.sh 123.456.789.0

# Check dengan domain
./.github/scripts/check-server-info.sh server.example.com

# Check dengan username custom
./.github/scripts/check-server-info.sh 123.456.789.0 deploy
```

Script akan:
- ✅ Check host connectivity
- ✅ Check SSH port (22)
- ✅ Test SSH connection
- ✅ Get server information
- ✅ Validate values

## 📋 Quick Check Commands

### Check SERVER_HOST

```bash
# Test ping
ping -c 3 your-server.com

# Test SSH port
nc -z -w 2 your-server.com 22 && echo "Port 22 open" || echo "Port 22 closed"

# Get public IP (jika di server)
curl ifconfig.me
```

### Check SERVER_USER

```bash
# Test SSH dengan user
ssh username@your-server.com "whoami"

# List users di server
ssh username@your-server.com "cat /etc/passwd | cut -d: -f1"
```

## ✅ Validation Checklist

Sebelum menambahkan ke GitHub Secrets, pastikan:

### SERVER_HOST
- [ ] IP address atau domain valid
- [ ] Server accessible dari internet
- [ ] SSH port (22) terbuka
- [ ] Bisa ping atau connect ke server

### SERVER_USER
- [ ] Username exists di server
- [ ] User punya home directory
- [ ] User bisa SSH (jika test manual)
- [ ] User punya permission untuk deployment (optional)

## 🔐 Setup SSH Access

Setelah dapat SERVER_HOST dan SERVER_USER:

### 1. Test SSH Connection

```bash
# Test dengan password (jika belum setup key)
ssh SERVER_USER@SERVER_HOST

# Test dengan SSH key
ssh -i ~/.ssh/github_actions_deploy SERVER_USER@SERVER_HOST
```

### 2. Setup Public Key di Server

```bash
# Copy public key ke server
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub SERVER_USER@SERVER_HOST

# Atau manual:
# 1. Copy public key
cat ~/.ssh/github_actions_deploy.pub

# 2. SSH ke server
ssh SERVER_USER@SERVER_HOST

# 3. Add to authorized_keys
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "PASTE_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 3. Test Connection

```bash
# Should work without password
ssh -i ~/.ssh/github_actions_deploy SERVER_USER@SERVER_HOST "echo 'Success!'"
```

## 📝 Contoh Values

### Production Server

```
SERVER_HOST: 123.456.789.0
SERVER_USER: deploy
```

atau

```
SERVER_HOST: christina-sings4you.com.au
SERVER_USER: www-data
```

### Staging Server

```
SERVER_HOST: staging.christina-sings4you.com.au
SERVER_USER: deploy
```

## 🚨 Common Issues

### Issue: "Connection refused"

**Penyebab:**
- SSH service tidak running
- Firewall block port 22
- Wrong IP/hostname

**Fix:**
```bash
# Di server, check SSH service
sudo systemctl status ssh
sudo systemctl start ssh

# Check firewall
sudo ufw status
sudo ufw allow 22/tcp
```

### Issue: "Permission denied"

**Penyebab:**
- Public key belum ditambahkan
- Wrong username
- Wrong permissions

**Fix:**
- Pastikan public key di `~/.ssh/authorized_keys`
- Check permissions: `chmod 700 ~/.ssh` dan `chmod 600 ~/.ssh/authorized_keys`
- Verify username benar

### Issue: "Host key verification failed"

**Fix:**
- Workflow sudah handle ini dengan `ssh-keyscan`
- Atau skip dengan: `ssh -o StrictHostKeyChecking=no`

## 🎯 Next Steps

Setelah dapat SERVER_HOST dan SERVER_USER:

1. ✅ Test SSH connection manual
2. ✅ Setup public key di server
3. ✅ Add ke GitHub Secrets:
   - `SERVER_HOST`: IP atau domain
   - `SERVER_USER`: Username SSH
4. ✅ Test workflow deployment

## 📚 Related

- [SECRETS_SETUP.md](./SECRETS_SETUP.md) - Setup semua secrets
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Troubleshooting guide
