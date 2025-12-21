# Railway Deployment Guide for I AM MAIL Backend

## 🚀 **STEP-BY-STEP DEPLOYMENT**

### **Step 1: Create Railway Account (2 minutes)**

1. Go to: https://railway.app
2. Click **"Start a New Project"** or **"Login with GitHub"**
3. Authorize Railway to access your GitHub account

---

### **Step 2: Prepare the Backend for Railway**

We need to create a few files for Railway deployment.

#### **Create `railway.json`** (Railway configuration)

Create this file in the project root:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node dist/index.cjs",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### **Create `Procfile`** (tells Railway how to start)

```
web: node dist/index.cjs
```

#### **Update `package.json`** (add start script)

Add this to the scripts section:

```json
{
  "scripts": {
    "start": "node dist/index.cjs",
    "build": "tsx script/build.ts",
    "dev": "tsx watch server/index.ts"
  }
}
```

---

### **Step 3: Push Code to GitHub (if not already)**

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Railway deployment"

# Create GitHub repo and push
# (Or push to existing repo)
git remote add origin https://github.com/YOUR_USERNAME/iam_mail.git
git push -u origin main
```

---

### **Step 4: Deploy on Railway**

1. **Go to Railway Dashboard**: https://railway.app/dashboard

2. **Click "New Project"**

3. **Select "Deploy from GitHub repo"**

4. **Choose your `iam_mail` repository**

5. **Railway will automatically**:
   - Detect it's a Node.js project
   - Run `npm install`
   - Run `npm run build`
   - Start the server

6. **Wait for deployment** (2-3 minutes)

---

### **Step 5: Configure Environment Variables**

In Railway dashboard:

1. **Click on your project**

2. **Go to "Variables" tab**

3. **Add these environment variables**:

```
# Email Configuration
IMAP_HOST=imap.mail.me.com
IMAP_PORT=993
IMAP_USER=sabique@rayzen.ae
IMAP_PASS=your-app-specific-password
IMAP_SECURE=true

SMTP_HOST=smtp.mail.me.com
SMTP_PORT=587
SMTP_USER=sabique@rayzen.ae
SMTP_PASS=your-app-specific-password
SMTP_SECURE=true

# Gemini API
API_KEY=your-gemini-api-key

# VAPID Keys
VAPID_PUBLIC_KEY=BEYOJh_eoWb6mSu_0Uzksggv8ZWcdwdDBwt5_o-iHkyf_aey4BrfCLicg4l0gL4BPSlM7PyVeltJDheJzBhecjE
VAPID_PRIVATE_KEY=IlI5hAJS_eekGmF_rUCMPO80I4jjhDbt6iCE9zLLAh8

# Server Configuration
NODE_ENV=production
PORT=5001
```

4. **Click "Deploy"** to restart with new variables

---

### **Step 6: Get Your Railway URL**

1. **In Railway dashboard**, click "Settings"

2. **Under "Domains"**, you'll see:
   - Default Railway URL: `https://your-app.up.railway.app`
   - Or add custom domain

3. **Copy this URL** - this is your backend API URL

---

### **Step 7: Update Frontend to Use Railway Backend**

Update the frontend to point to your Railway URL:

#### **Option A: Environment Variable (Recommended)**

Create `client/.env.production`:

```
VITE_API_URL=https://your-app.up.railway.app
```

Then update API calls to use:
```javascript
const API_URL = import.meta.env.VITE_API_URL || '';
fetch(`${API_URL}/api/email/test-connection`, ...)
```

#### **Option B: Direct Update**

Update `client/src/components/SettingsModal.tsx`:

Change:
```javascript
const response = await fetch('/api/email/test-connection', {
```

To:
```javascript
const response = await fetch('https://your-app.up.railway.app/api/email/test-connection', {
```

---

### **Step 8: Redeploy Frontend to Firebase**

```bash
# Build with new API URL
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

---

### **Step 9: Test Everything**

1. **Open**: https://iammail-a2c4d.web.app

2. **Click Settings**

3. **Configure email**:
   - Select provider
   - Enter credentials
   - Click "Test Connection" ✅
   - Should work now!

4. **Save & Connect** ✅

5. **Your emails will load!** 🎉

---

## 🎯 **QUICK CHECKLIST**

- [ ] Create Railway account
- [ ] Push code to GitHub
- [ ] Deploy on Railway
- [ ] Add environment variables
- [ ] Get Railway URL
- [ ] Update frontend API URL
- [ ] Rebuild frontend
- [ ] Deploy to Firebase Hosting
- [ ] Test Settings modal
- [ ] Verify email configuration works

---

## 💰 **COST**

- **Railway Free Tier**: $5 credit/month
- **Your usage**: ~$0-2/month (very light)
- **Plenty for development and testing**

---

## 🔧 **TROUBLESHOOTING**

### **Build Fails**
- Check Railway logs
- Ensure `package.json` has correct scripts
- Verify `dist/index.cjs` exists after build

### **Server Won't Start**
- Check environment variables are set
- Verify PORT is set to 5001
- Check Railway logs for errors

### **API Returns 404**
- Verify Railway URL is correct
- Check CORS settings
- Ensure routes are properly configured

---

## 📝 **NEXT STEPS**

1. **Create Railway account**: https://railway.app
2. **Let me know when ready** and I'll help with the configuration files
3. **Deploy and test**

---

**Ready to start?** Let me know and I'll create the necessary configuration files! 🚀
