# Railway Environment Variables - Complete List

## 📋 **VARIABLES TO ADD IN RAILWAY**

Copy these values from your `.env` file and add them in Railway's Variables tab:

### **Email Configuration (iCloud)**
```
IMAP_HOST=imap.mail.me.com
IMAP_PORT=993
IMAP_USER=sabique@rayzen.ae
IMAP_PASS=<your-app-specific-password-from-.env>
IMAP_SECURE=true

SMTP_HOST=smtp.mail.me.com
SMTP_PORT=587
SMTP_USER=sabique@rayzen.ae
SMTP_PASS=<your-app-specific-password-from-.env>
SMTP_SECURE=true
```

### **Gemini API**
```
API_KEY=<your-gemini-api-key-from-.env>
```

### **VAPID Keys (for Push Notifications)**
```
VAPID_PUBLIC_KEY=<from-.env>
VAPID_PRIVATE_KEY=<from-.env>
```

### **Server Configuration**
```
NODE_ENV=production
PORT=5001
BASE_URL=<will-get-from-railway-after-deployment>
```

---

## 🎯 **HOW TO ADD IN RAILWAY:**

1. **You're already on the Variables tab** ✅

2. **Click "New Variable"** for each one

3. **Or use "Raw Editor"** to paste all at once:
   - Click "Raw Editor"
   - Paste all variables in KEY=VALUE format
   - Click "Save"

4. **After adding all variables**, Railway will automatically redeploy

---

## 📝 **GET VALUES FROM YOUR .ENV FILE:**

Run this command to see your current values:

```bash
cat /Users/sabiqahmed/Downloads/iam_mail/.env
```

Then copy the values for:
- `IMAP_PASS`
- `SMTP_PASS`
- `API_KEY`
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`

---

**Once you've added all variables, Railway will deploy automatically!**
