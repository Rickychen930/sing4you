# Fix: Script Not Found Issue

## 🔍 Problem

Directory has been created, but application files have not been uploaded to the server, so scripts are not found.

## ✅ Quick Solution

### Step 1: Upload Application to Server

**From Local Machine (open new terminal):**

```bash
# Make sure you're in the project directory
cd /Users/blackver69/sing4you

# Upload using rsync
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'dist' \
  --exclude '.env' \
  --exclude '*.log' \
  ./ root@72.61.214.25:/var/www/christina-sings4you/
```

**Or use the provided script:**
```bash
cd /Users/blackver69/sing4you
./deployment/QUICK_UPLOAD.sh
```

### Step 2: Set Permissions on Server

**Back to SSH session:**
```bash
# On server
cd /var/www/christina-sings4you
sudo chmod +x deployment/scripts/*.sh
sudo chown -R www-data:www-data .
```

### Step 3: Verify

```bash
# On server
cd /var/www/christina-sings4you
ls -la  # Application files should be present
ls -la deployment/scripts/  # Scripts should be present
```

### Step 4: Continue Setup

```bash
# On server
cd /var/www/christina-sings4you

# Complete server setup
sudo ./deployment/scripts/setup-server.sh

# Or if only need to setup GitHub Actions
sudo ./deployment/scripts/setup-github-actions.sh
```

## 🚀 Alternative: Using Git

If repository is already on GitHub:

```bash
# On server
cd /var/www
rm -rf christina-sings4you  # Remove empty directory
git clone <your-repo-url> christina-sings4you
cd christina-sings4you
sudo chmod +x deployment/scripts/*.sh
```

## 📋 Checklist

- [ ] Application files have been uploaded to server
- [ ] Scripts are executable: `chmod +x deployment/scripts/*.sh`
- [ ] Permissions are correct: `chown -R www-data:www-data .`
- [ ] Verify files exist: `ls -la deployment/scripts/`
- [ ] Script can be executed: `sudo ./deployment/scripts/setup-server.sh`

## 🆘 Still Error?

### Files don't appear after upload
```bash
# Check if upload was successful
ls -la /var/www/christina-sings4you

# If still empty, try uploading again with verbose
rsync -avz --progress -v ./ root@72.61.214.25:/var/www/christina-sings4you/
```

### Permission denied
```bash
# Make sure directory is writable
sudo chmod 755 /var/www/christina-sings4you
sudo chown root:root /var/www/christina-sings4you
```

### Script still not found
```bash
# Make sure path is correct
cd /var/www/christina-sings4you
pwd  # Should show /var/www/christina-sings4you
ls deployment/scripts/  # Should show .sh files
```
