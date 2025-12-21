# 🚀 I AM MAIL - Quick Start Guide

## ⚡ FASTEST PATH TO DEPLOYMENT (15 minutes)

### 1. Setup Environment (2 minutes)
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your credentials:
# - iCloud email credentials (get app-specific password from appleid.apple.com)
# - Gemini API key (from ai.google.dev)
```

### 2. Test Locally (3 minutes)
```bash
# Start development server
PORT=5001 npm run dev

# Open http://localhost:5001
# Login with biometric screen
# Send yourself a test email
# Verify it appears in the correct tab
```

### 3. Deploy to Firebase (10 minutes)
```bash
# Run automated deployment script
./deploy.sh

# Or manually:
npm run build
firebase deploy --only hosting
```

**That's it!** Your app is now live at `https://your-project.web.app`

---

## 📧 TESTING EMAIL CLASSIFICATION

Send yourself these 3 test emails:

1. **Personal Email** (should go to Focus ⚡):
   - From: A friend or colleague
   - Subject: "Quick question about the project"
   - Should trigger push notification

2. **Newsletter** (should go to Other 📦):
   - From: Any newsletter service
   - Subject: "Weekly digest" or similar
   - Should NOT trigger notification

3. **Receipt** (should go to Other 📦):
   - From: Any e-commerce site
   - Subject: "Order confirmation" or "Receipt"
   - Should NOT trigger notification

---

## 🎯 FEATURE CHECKLIST

Test these features after deployment:

### PWA Installation
- [ ] Mobile: Tap "Add to Home Screen"
- [ ] Desktop: Click install icon in address bar
- [ ] App opens in standalone mode

### Email Classification
- [ ] Personal emails appear in Focus tab
- [ ] Newsletters appear in Other tab
- [ ] Tab counts update correctly
- [ ] Only Focus emails trigger notifications

### Snippet System
- [ ] Open composer (press `C`)
- [ ] Type `/meeting`
- [ ] Press Enter to insert template
- [ ] Variables expand correctly

### Keyboard Shortcuts
- [ ] `Cmd/Ctrl + 1`: Switch to Focus
- [ ] `Cmd/Ctrl + 2`: Switch to Other
- [ ] `C`: Open composer
- [ ] `Cmd/Ctrl + K`: Focus command bar

### Mobile Gestures
- [ ] Swipe left: Archive email
- [ ] Swipe right: Mark read/unread

---

## 🔧 TROUBLESHOOTING

### "No emails showing"
- Check IMAP credentials in `.env`
- Verify app-specific password is correct
- Check server logs for IMAP errors

### "Classification not working"
- Verify `API_KEY` is set in `.env`
- Check Gemini API quota
- Look for errors in browser console

### "Push notifications not working"
- Must be on HTTPS (required for Service Worker)
- Click "Alerts" button in sidebar to enable
- Grant permission when prompted
- Check VAPID keys are configured

### "Build fails"
```bash
# Clear and rebuild
rm -rf node_modules dist
npm install
npm run build
```

---

## 📱 MOBILE SETUP

### iOS (Safari)
1. Open deployed URL in Safari
2. Tap Share button
3. Tap "Add to Home Screen"
4. Name it "I AM MAIL"
5. Tap "Add"

### Android (Chrome)
1. Open deployed URL in Chrome
2. Tap menu (3 dots)
3. Tap "Add to Home screen"
4. Tap "Install"

---

## 🎨 CUSTOMIZATION

### Change App Name
Edit `client/public/manifest.json`:
```json
{
  "name": "Your Company Mail",
  "short_name": "YC Mail"
}
```

### Change Theme Color
Edit `client/public/manifest.json`:
```json
{
  "theme_color": "#your-color",
  "background_color": "#your-color"
}
```

### Add Custom Domain
1. Firebase Console → Hosting → Add custom domain
2. Enter: `mail.yourcompany.com`
3. Update DNS records as shown
4. Wait for SSL certificate (automatic)

---

## 📊 MONITORING

### Check Deployment Status
```bash
firebase hosting:channel:list
```

### View Logs
```bash
firebase functions:log
```

### Analytics (Optional)
Enable in Firebase Console → Analytics

---

## 🚀 PRODUCTION CHECKLIST

Before sharing with team:

- [ ] Test with 3+ different email types
- [ ] Verify classification accuracy
- [ ] Test on iOS and Android
- [ ] Confirm push notifications work
- [ ] Test offline functionality
- [ ] Verify all keyboard shortcuts
- [ ] Check mobile gestures
- [ ] Test snippet system
- [ ] Verify empty states display correctly

---

## 📞 SUPPORT

**Documentation:**
- Full deployment guide: `DEPLOYMENT.md`
- Implementation summary: `.agent/IMPLEMENTATION_SUMMARY.md`

**Issues?**
- Check browser console for errors
- Review Firebase logs
- Verify environment variables

---

**Deployment Time**: 15 minutes
**Status**: Production Ready ✅
**Next**: Share URL with team and start testing!
