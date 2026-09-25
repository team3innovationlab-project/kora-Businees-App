#!/usr/bin/env bash
# ==============================================================================
# Wing AI POS & Business Management — 1-Click Automated VPS Installer
# Supported: Ubuntu 22.04/24.04 LTS, Debian 11/12
# ==============================================================================

set -e

echo "🚀 Starting Wing AI POS & Business Management Server Installation..."

# 1. Update OS and install essential packages
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential ufw

# 2. Install Node.js 20 LTS
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# 3. Install global tools (pm2, tsx)
sudo npm install -g pm2 tsx

# 4. Install Docker & Docker Compose (optional for Docker deployment)
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker Engine..."
    curl -fsSL https://get.docker.com | sh
    sudo systemctl enable --now docker
fi

# 5. Build project
echo "⚙️ Installing dependencies and building production frontend assets..."
npm install
npm run build

# 6. Configure Firewall (allow port 22 for SSH, 80 for HTTP, 443 for HTTPS, 3000 for App)
echo "🔒 Configuring UFW Firewall..."
sudo ufw allow 22/tcp || true
sudo ufw allow 80/tcp || true
sudo ufw allow 443/tcp || true
sudo ufw allow 3000/tcp || true

# 7. Start application via PM2
echo "🚀 Starting application process..."
pm2 start ecosystem.config.cjs || pm2 restart wing-ai-pos
pm2 save
pm2 startup || true

echo "=============================================================================="
echo "✅ Wing AI POS is now RUNNING on http://$(curl -s ifconfig.me):3000"
echo "🔐 Default Login Credentials:"
echo "   - Owner: george.jabley@gmail.com / admin123 (PIN: 1234)"
echo "   - Manager: abena@techwokx.com / manager123 (PIN: 5678)"
echo "   - Cashier: kwame@techwokx.com / cashier123 (PIN: 9012)"
echo "=============================================================================="
