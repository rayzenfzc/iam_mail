# I AM MAIL - Deployment Summary

## Date: December 22, 2024

---

## 🎯 WHAT WE ACCOMPLISHED

### 1. Backend Deployment Attempts

#### ❌ Railway (Failed)
- **Reason**: iCloud/Gmail block IMAP connections from cloud providers like Railway
- **Cost**: $5 (monthly subscription)
- **Lesson**: Serverless/cloud platforms get IP-blocked by email providers

#### ✅ Google Compute Engine (Success)
- **VM Created**: `iammail-backend`
- **Region**: us-central1-c
- **Machine**: e2-micro (~$7/month)
- **OS**: Ubuntu 24.04 LTS Minimal (x86/64)
- **External IP**: `34.59.58.92`

---

## 🏗️ INFRASTRUCTURE SETUP

### Google Compute Engine VM
| Component | Value |
|-----------|-------|
| **Instance Name** | iammail-backend |
| **IP Address** | 34.59.58.92 |
| **Machine Type** | e2-micro |
| **OS** | Ubuntu 24.04 LTS |
| **Disk** | 10 GB Balanced Persistent |
| **Cost** | ~$7/month |

### Domain Configuration
| Type | Name | Value |
|------|------|-------|
| A Record | api | 34.59.58.92 |
| Domain | api.iammail.cloud | Points to GCE VM |

### SSL Certificate
- **Provider**: Let's Encrypt (Free)
- **Auto-Renewal**: Enabled via Certbot
- **Expires**: March 22, 2026

---

## 🔧 SOFTWARE INSTALLED ON VM

```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Git
sudo apt install -y git

# PM2 (Process Manager)
sudo npm install -g pm2

# Nginx (Reverse Proxy)
sudo apt install -y nginx

# Certbot (SSL Certificates)
sudo apt install -y certbot python3-certbot-nginx
```

---

## 📁 FILE LOCATIONS ON VM

| Path | Description |
|------|-------------|
| `/home/sabique/iam_mail` | Application code |
| `/home/sabique/iam_mail/.env` | Environment variables |
| `/etc/nginx/sites-available/iammail` | Nginx config |
| `/etc/letsencrypt/live/api.iammail.cloud/` | SSL certificates |

---

## 🔐 ENVIRONMENT VARIABLES (.env on VM)

```bash
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=sabiqahmed@gmail.com
IMAP_PASS=YOUR_APP_PASSWORD

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sabiqahmed@gmail.com
SMTP_PASS=YOUR_APP_PASSWORD

API_KEY=AIzaSyCIS2p5M4e1Vu1P7hyll7fEICJB96F0azE

NODE_ENV=production
PORT=5000
```

---

## 🌐 PRODUCTION URLS

| Component | URL | Status |
|-----------|-----|--------|
| **Frontend** | https://iammail-a2c4d.web.app | ✅ Live |
| **Backend** | https://api.iammail.cloud | ✅ Live |
| **Backend (Direct)** | http://34.59.58.92:5000 | ✅ Live |

---

## 🔄 PM2 COMMANDS (SSH Terminal)

```bash
# Check status
pm2 status

# View logs
pm2 logs iammail --lines 20

# Restart server
pm2 restart iammail --update-env

# Stop server
pm2 stop iammail

# Start server
pm2 start npm --name "iammail" -- start
```

---

## 🔧 NGINX CONFIGURATION

File: `/etc/nginx/sites-available/iammail`

```nginx
server {
    listen 80;
    server_name api.iammail.cloud;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name api.iammail.cloud;

    ssl_certificate /etc/letsencrypt/live/api.iammail.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.iammail.cloud/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔥 FIREWALL RULES (Google Cloud)

| Name | Type | Target | Source | Ports | Action |
|------|------|--------|--------|-------|--------|
| allow-port-5000 | Ingress | All | 0.0.0.0/0 | tcp:5000 | Allow |
| default-allow-http | Ingress | http-server | 0.0.0.0/0 | tcp:80 | Allow |
| default-allow-https | Ingress | https-server | 0.0.0.0/0 | tcp:443 | Allow |

---

## 📝 REMAINING STEPS TO COMPLETE

### 1. Update VM with Latest Code
```bash
cd ~/iam_mail && git pull && npm install && npm run build && pm2 restart iammail --update-env
```

### 2. Test Email Fetching
```bash
curl http://localhost:5000/api/emails/imap?limit=2
```

### 3. Test Frontend
Open: https://iammail-a2c4d.web.app

---

## ⚠️ KNOWN ISSUES

1. **dotenv not loading**: Fixed by adding `import 'dotenv/config'` to server/index.ts
2. **Mixed Content**: Fixed by setting up HTTPS on api.iammail.cloud
3. **IMAP Blocking**: Fixed by using GCE VM instead of Railway

---

## 💡 KEY LEARNINGS

1. **Email apps need VPS/VMs** - Cloud functions and serverless platforms get blocked by email providers
2. **HTTPS is required** - Browsers block HTTP API calls from HTTPS pages (Mixed Content)
3. **Gmail App Passwords** - Remove spaces when using (e.g., `oltfpbxepslksorw` not `oltf pbxe pslk sorw`)
4. **PM2 for persistence** - Keeps Node.js apps running after SSH disconnects

---

## 📞 QUICK REFERENCE

### SSH into VM
1. Go to: https://console.cloud.google.com/compute/instances?project=iammail-a2c4d
2. Click "SSH" next to iammail-backend

### Update & Restart Server
```bash
cd ~/iam_mail
git pull
npm run build
pm2 restart iammail --update-env
```

### Check Logs
```bash
pm2 logs iammail --lines 50
```

### Test API
```bash
curl https://api.iammail.cloud/api/notifications/vapid-public-key
```

---

## 📊 COST SUMMARY

| Service | Cost | Notes |
|---------|------|-------|
| Firebase Hosting | Free | Frontend |
| Google Compute Engine | ~$7/mo | Backend VM |
| Domain (iammail.cloud) | ~$12/yr | Already owned |
| SSL Certificate | Free | Let's Encrypt |
| **Total** | **~$7/month** | |

---

*Document created: December 22, 2024*
