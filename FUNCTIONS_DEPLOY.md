# Firebase Functions Deployment Guide

## Set Environment Variables

Run these commands to configure your Firebase Functions:

```bash
# Set Gemini API Key
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"

# Set VAPID Keys for Push Notifications
firebase functions:config:set vapid.public="YOUR_VAPID_PUBLIC_KEY"
firebase functions:config:set vapid.private="YOUR_VAPID_PRIVATE_KEY"
```

Replace the values with your actual keys from `.env` file.

## Deploy Functions

```bash
firebase deploy --only functions
```

## Test the API

After deployment, your API will be available at:
```
https://us-central1-iammail-a2c4d.cloudfunctions.net/api
```

Test endpoints:
- POST `/api/email/test-connection`
- POST `/api/email/save-config`
- POST `/api/classify`
- GET `/api/notifications/vapid-public-key`
- POST `/api/notifications/subscribe`

## Update Frontend

The frontend is already configured to use `/api/*` paths, which Firebase Hosting will automatically route to your Cloud Functions.

No changes needed!
