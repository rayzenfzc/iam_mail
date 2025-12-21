# Firebase Functions Deployment - Permission Fix Required

## 🔴 **ISSUE**

The deployment failed with this error:
```
Access to bucket gcf-sources-48508480376-us-central1 denied. 
You must grant Storage Object Viewer permission to 
48508480376-compute@developer.gserviceaccount.com
```

## 💡 **SOLUTION**

We need to grant the service account permission to access Cloud Storage.

### **Option 1: Via Google Cloud Console (Recommended)**

1. Go to: https://console.cloud.google.com/iam-admin/iam?project=iammail-a2c4d

2. Find the service account:
   ```
   48508480376-compute@developer.gserviceaccount.com
   ```

3. Click the **pencil icon** (Edit) next to it

4. Click **"ADD ANOTHER ROLE"**

5. Add these roles:
   - **Storage Object Viewer**
   - **Storage Object Admin** (for full access)

6. Click **"SAVE"**

7. Wait 1-2 minutes for permissions to propagate

8. Try deployment again:
   ```bash
   firebase deploy --only functions
   ```

---

### **Option 2: Via Command Line**

Run this command:

```bash
gcloud projects add-iam-policy-binding iammail-a2c4d \
  --member="serviceAccount:48508480376-compute@developer.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"
```

---

## 🎯 **QUICK STEPS**

1. **Open IAM page**: https://console.cloud.google.com/iam-admin/iam?project=iammail-a2c4d
2. **Find service account**: `48508480376-compute@developer.gserviceaccount.com`
3. **Edit** (pencil icon)
4. **Add role**: Storage Object Admin
5. **Save**
6. **Wait 2 minutes**
7. **Redeploy**: `firebase deploy --only functions`

---

## 📝 **NOTE**

This is a one-time setup. Once the permissions are granted, future deployments will work smoothly.

---

**Let me know when you've added the permission and I'll help you redeploy!**
