# Zoho OAuth Setup Guide

## Your Zoho Credentials (from project docs)
```
Client ID: <REDACTED_CLIENT_ID>
Client Secret: <REDACTED_CLIENT_SECRET>
Redirect URI: https://iammail.cloud/auth/zoho/callback
```

---

## Step 1: Get Authorization Code

Click this URL to authorize (opens Zoho login):

**[🔗 Click to Authorize Zoho](https://accounts.zoho.com/oauth/v2/auth?client_id=<REDACTED_CLIENT_ID>&response_type=code&access_type=offline&scope=ZohoMail.organization.accounts.ALL,ZohoMail.organization.ALL&redirect_uri=https://iammail.cloud/auth/zoho/callback&prompt=consent)**

After authorizing, you'll be redirected to a URL like:
```
https://iammail.cloud/auth/zoho/callback?code=1000.abc123xyz...
```

**Copy the `code` value** (everything after `code=`)

---

## Step 2: Exchange Code for Refresh Token

Run this curl command (replace `YOUR_AUTH_CODE` with the code from Step 1):

```bash
curl -X POST "https://accounts.zoho.com/oauth/v2/token" \
  -d "grant_type=authorization_code" \
  -d "client_id=<REDACTED_CLIENT_ID>" \
  -d "client_secret=<REDACTED_CLIENT_SECRET>" \
  -d "redirect_uri=https://iammail.cloud/auth/zoho/callback" \
  -d "code=YOUR_AUTH_CODE"
```

Response will include:
```json
{
  "access_token": "...",
  "refresh_token": "1000.xxxxxxx",  ← SAVE THIS
  "expires_in": 3600
}
```

---

## Step 3: Get Organization ID (ZOID)

Run this with your access token:

```bash
curl -X GET "https://mail.zoho.com/api/organization" \
  -H "Authorization: Zoho-oauthtoken YOUR_ACCESS_TOKEN"
```

Response will include:
```json
{
  "data": {
    "zoid": "12345678"  ← SAVE THIS
  }
}
```

---

## Step 4: Update .env File

Add to `/Users/sabiqahmed/Downloads/iam_mail/.env`:

```env
# Zoho Admin API
ZOHO_CLIENT_ID=<REDACTED_CLIENT_ID>
ZOHO_CLIENT_SECRET=<REDACTED_CLIENT_SECRET>
ZOHO_REFRESH_TOKEN=paste_refresh_token_here
ZOHO_ZOID=paste_organization_id_here
```

---

## Step 5: Test Mailbox Provisioning

Restart the server and test:

```bash
curl -X POST "http://localhost:5001/api/zoho/create-mailbox" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@iammail.cloud",
    "password": "SecurePass123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```
