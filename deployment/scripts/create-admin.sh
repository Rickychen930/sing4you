#!/bin/bash

# Script untuk create admin user
# Usage: ./create-admin.sh [email] [password] [name]

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

APP_DIR="/var/www/christina-sings4you"
EMAIL=${1:-"admin@christinasings4u.com.au"}
PASSWORD=${2:-"admin123"}
NAME=${3:-"Admin User"}

log "Creating admin user..."

# Check if .env exists
if [ ! -f "$APP_DIR/.env" ]; then
    error ".env file not found at $APP_DIR/.env"
fi

# Load environment variables
export $(cat "$APP_DIR/.env" | grep -v '^#' | xargs)

# Check if MongoDB URI is set
if [ -z "$MONGODB_URI" ] || [[ "$MONGODB_URI" == *"<db_password>"* ]]; then
    error "MONGODB_URI not configured in .env file!"
fi

cd "$APP_DIR" || error "Application directory not found: $APP_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    log "Installing dependencies..."
    npm install --production
fi

# Create admin using seed script or direct node script
log "Creating admin user: $EMAIL"

# Use node to create admin
node << EOF
require('dotenv').config({ path: '$APP_DIR/.env' });
const { Database } = require('./dist/server/config/database');
const { AdminUserModel } = require('./dist/server/models/AdminUserModel');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    const database = Database.getInstance();
    await database.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check if admin exists
    const existingAdmin = await AdminUserModel.getModel().findOne({ email: '$EMAIL' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with email: $EMAIL');
      process.exit(0);
    }
    
    // Create admin
    const hashedPassword = await bcrypt.hash('$PASSWORD', 10);
    await AdminUserModel.getModel().create({
      email: '$EMAIL',
      password: hashedPassword,
      name: '$NAME',
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('   Email: $EMAIL');
    console.log('   Password: $PASSWORD');
    console.log('   Name: $NAME');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
EOF

if [ $? -eq 0 ]; then
    log "Admin user created successfully!"
    warning "⚠️  Please change the default password after first login!"
else
    error "Failed to create admin user"
fi
