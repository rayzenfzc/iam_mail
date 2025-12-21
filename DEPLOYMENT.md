# I AM MAIL - Production Deployment Guide

## 🚀 DEPLOYMENT CHECKLIST

### Step 1: Environment Setup (5 minutes)

1. **Create `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. **Fill in credentials**:
   - iCloud/IMAP credentials (get app-specific password from appleid.apple.com)
   - Gemini API key (from ai.google.dev)
   - VAPID keys (auto-generated on first run, or use `npx web-push generate-vapid-keys`)

3. **Test locally**:
   ```bash
   PORT=5001 npm run dev
   ```
   - Send test emails to verify IMAP connection
   - Check classification works
   - Test push notifications

---

### Step 2: Firebase Setup (10 minutes)

1. **Login to Firebase**:
   ```bash
   firebase login
   ```

2. **Initialize project** (if not already done):
   ```bash
   firebase init
   ```
   Select:
   - ✅ Hosting
   - ✅ Functions (if using serverless backend)
   - Public directory: `dist/public`
   - Single-page app: `Yes`
   - Automatic builds: `No`

3. **Link to Firebase project**:
   ```bash
   firebase use --add
   ```
   Select your Firebase project or create a new one.

---

### Step 3: Build Production Bundle (5 minutes)

```bash
# Install dependencies
npm install

# Build optimized production bundle
npm run build

# Verify build output
ls -la dist/public
```

Expected output:
- `index.html`
- `assets/` (JS, CSS bundles)
- `manifest.json`
- `sw.js`
- `icons/`

---

### Step 4: Deploy to Firebase (5 minutes)

```bash
# Deploy hosting only
firebase deploy --only hosting

# Or deploy everything (hosting + functions)
firebase deploy
```

**Deployment URL**: Will be shown in terminal output
- Default: `https://your-project.web.app`
- Custom domain: Configure in Firebase Console

---

### Step 5: Configure Production Environment (10 minutes)

#### Option A: Using Firebase Functions Config
```bash
firebase functions:config:set \
  email.imap_host="imap.mail.me.com" \
  email.imap_user="sabique@rayzen.ae" \
  email.imap_pass="your-app-password" \
  gemini.api_key="your-gemini-key" \
  vapid.public="your-public-key" \
  vapid.private="your-private-key"
```

#### Option B: Using Environment Variables (Recommended)
In Firebase Console:
1. Go to **Functions** → **Environment Variables**
2. Add:
   - `IMAP_HOST`, `IMAP_USER`, `IMAP_PASS`
   - `API_KEY` (Gemini)
   - `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`

---

### Step 6: Custom Domain (Optional, 15 minutes)

1. **Add domain in Firebase Console**:
   - Hosting → Add custom domain
   - Enter: `mail.rayzen.ae`

2. **Update DNS records**:
   Copy the provided DNS records to your domain registrar:
   ```
   Type: A
   Name: mail
   Value: [Firebase IP from console]
   
   Type: TXT
   Name: mail
   Value: [Verification code from console]
   ```

3. **Wait for verification** (can take up to 24 hours)

---

### Step 7: Post-Deployment Testing (10 minutes)

1. **Open deployed URL**
2. **Install as PWA**:
   - Mobile: "Add to Home Screen"
   - Desktop: Install icon in address bar
3. **Test email flow**:
   - Send test email
   - Verify it appears in correct tab (Focus/Other)
   - Check push notification arrives
4. **Test features**:
   - Snippet system (`/meeting`)
   - Swipe gestures (mobile)
   - Keyboard shortcuts (`Cmd+1`, `Cmd+2`)
   - AI classification

---

## 📊 MONITORING

### Firebase Console
- **Hosting**: View traffic, bandwidth usage
- **Functions**: Monitor API calls, errors
- **Analytics**: Track user engagement (if enabled)

### Error Monitoring
Check browser console for:
- Service Worker registration
- Push notification permission
- API errors

---

## 🔒 SECURITY CHECKLIST

- [ ] Environment variables secured (not in git)
- [ ] HTTPS enabled (automatic with Firebase)
- [ ] Service Worker only on HTTPS
- [ ] VAPID keys kept private
- [ ] Email credentials use app-specific passwords
- [ ] API keys restricted to domain

---

## 🎯 PRODUCTION READINESS

**Before Launch:**
- [ ] Test with real emails (3+ different types)
- [ ] Verify classification accuracy
- [ ] Test on iOS and Android
- [ ] Check PWA installation
- [ ] Confirm push notifications work
- [ ] Test offline functionality
- [ ] Verify snippet system
- [ ] Check mobile gestures

**After Launch:**
- [ ] Monitor error logs
- [ ] Track classification accuracy
- [ ] Gather user feedback
- [ ] Plan feature iterations

---

## 🆘 TROUBLESHOOTING

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Deployment Fails
```bash
# Check Firebase project
firebase projects:list

# Re-login if needed
firebase logout
firebase login
```

### Service Worker Not Registering
- Ensure HTTPS (required for SW)
- Check `sw.js` is in public root
- Verify `manifest.json` paths

### Push Notifications Not Working
- Check VAPID keys are set
- Verify user granted permission
- Test on HTTPS only (required)

---

## 📞 SUPPORT

- Firebase Docs: https://firebase.google.com/docs/hosting
- Gemini API: https://ai.google.dev
- Web Push: https://web.dev/push-notifications/

---

**Deployment Time**: ~45 minutes total
**Status**: Ready for production ✅
