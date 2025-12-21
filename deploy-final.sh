#!/bin/bash

# I AM MAIL - Final Deployment Steps
# Run this script to deploy to Firebase

echo "🚀 I AM MAIL - Final Deployment"
echo "================================"
echo ""

# Step 1: Verify environment
echo "📋 Step 1: Verifying environment..."
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "   Please copy .env.example to .env and fill in your credentials"
    exit 1
fi
echo "✅ .env file found"
echo ""

# Step 2: Build production bundle
echo "🔨 Step 2: Building production bundle..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi
echo "✅ Build successful"
echo ""

# Step 3: Deploy to Firebase
echo "🚀 Step 3: Deploying to Firebase..."
echo ""
echo "📌 Deploying to project: rayzen-proposal-ai"
echo ""

firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ DEPLOYMENT SUCCESSFUL!"
    echo ""
    echo "🌐 Your app is now live!"
    echo ""
    echo "📱 Next steps:"
    echo "   1. Open the URL shown above"
    echo "   2. Install as PWA on your mobile device"
    echo "   3. Send test emails to verify classification"
    echo "   4. Enable push notifications (click 'Alerts' in sidebar)"
    echo "   5. Share the URL with your team"
    echo ""
    echo "🎯 Test emails to send:"
    echo "   • Personal email → Should go to Focus ⚡"
    echo "   • Newsletter → Should go to Other 📦"
    echo "   • Receipt → Should go to Other 📦"
    echo ""
else
    echo ""
    echo "❌ Deployment failed!"
    echo "   Check the error messages above"
    exit 1
fi
