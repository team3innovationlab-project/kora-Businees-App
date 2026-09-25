# Wing AI POS & Business Management — VPS Deployment Guide

This guide walks you through deploying the Wing AI POS & Business Management backend and frontend onto any Linux VPS (Ubuntu 22.04 / 24.04, Debian 12, or AlmaLinux).

---

## ⚡ Quick Start: 1-Step Automated Deployment (Recommended)

Run this single command on your fresh Ubuntu or Debian VPS:

```bash
curl -fsSL https://raw.githubusercontent.com/your-username/wing-ai-pos/main/deploy-vps.sh | bash
```

Or follow either **Option A (Docker)** or **Option B (PM2 + Nginx)** below.

---

## 🐳 Option A: Docker & Docker Compose (Fastest & Cleanest)

### Step 1: Install Docker on your VPS
```bash
curl -fsSL https://get.docker.com | sh
sudo systemctl enable --now docker
```

### Step 2: Clone or Copy Your Code
```bash
git clone <YOUR_GIT_REPO_URL> /var/www/wing-ai-pos
cd /var/www/wing-ai-pos
```

### Step 3: Launch with Docker Compose
```bash
docker compose up -d --build
```

Your app will be running at `http://YOUR_SERVER_IP:3000` with automatic persistence in `./data/pos_database.json`.

---

## 🚀 Option B: PM2 + Node.js + Nginx with Free SSL (Production Standard)

### Step 1: Install Node.js 20 & PM2
```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt update && sudo apt install -y nodejs nginx certbot python3-certbot-nginx

# Install PM2 and tsx globally
sudo npm install -g pm2 tsx
```

### Step 2: Deploy Project Code
```bash
sudo mkdir -p /var/www/wing-ai-pos
cd /var/www/wing-ai-pos
# Copy or git clone your project here
npm install
npm run build
```

### Step 3: Start Application with PM2
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### Step 4: Configure Nginx as Reverse Proxy
Create `/etc/nginx/sites-available/wing-ai`:
```nginx
server {
    server_name yourdomain.com www.yourdomain.com; # or your VPS IP

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/wing-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5: Enable Free HTTPS SSL Certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 📱 WhatsApp Business Automated Close Report
The system includes built-in automated WhatsApp daily close reports:

1. **Automatic Triggers**:
   - **On Daily Reconciliation**: As soon as the store manager or cashier balances the register and clicks *Save & Close Register*, the system automatically compiles and sends the full financial close report.
   - **Scheduled Daily Closing Time**: The background VPS service runs a 60-second cron runner that automatically dispatches the report every night at your configured closing time (e.g. `20:00 GMT`).
   - **Instant Auto-Send**: Click **Send Automatically Now** in the WhatsApp Close Report modal to fire an immediate background dispatch.

2. **Delivery Gateways**:
   - **VPS Gateway Service**: Pre-configured server-side dispatcher that requires zero external subscriptions.
   - **Custom Webhook / WhatsApp Cloud API**: Option to forward the JSON close payload to any external webhook (Zapier, Make, Green API, Twilio, or Meta WhatsApp Business API).

3. **API Endpoints**:
   - `GET /api/reports/whatsapp-summary?date=YYYY-MM-DD` — Formatted summary text & WhatsApp direct link
   - `GET /api/reports/whatsapp-auto-config` — Get automation settings & dispatch audit logs
   - `PUT /api/reports/whatsapp-auto-config` — Update auto-dispatch settings, time, and recipients
   - `POST /api/reports/whatsapp-send-auto` — Manually trigger background auto-dispatch for a date

---

## 🔐 Default Login Credentials
- **Business Owner:** `george.jabley@gmail.com` / `admin123` (PIN: `1234`)
- **Store Manager:** `abena@techwokx.com` / `manager123` (PIN: `5678`)
- **Sales Cashier:** `kwame@techwokx.com` / `cashier123` (PIN: `9012`)

You can create additional staff members or change passwords in the **Staff** and **User Settings** tabs.

---

## 💾 Database Persistence & Backups
The database is stored in JSON format at:
`/var/www/wing-ai-pos/data/pos_database.json`

To backup your database daily, set up a simple cronjob:
```bash
crontab -e
# Add this line to backup every night at 2:00 AM:
0 2 * * * cp /var/www/wing-ai-pos/data/pos_database.json /var/backups/pos_backup_$(date +\%F).json
```

