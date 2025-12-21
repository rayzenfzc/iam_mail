#!/bin/bash

# I AM MAIL - Quick Deployment Script
# This script builds and deploys the application to Firebase

set -e  # Exit on error

echo "🚀 I AM MAIL - Production Deployment"
echo "===================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Check if logged in to Firebase
echo "📝 Checking Firebase authentication..."
firebase projects:list &> /dev/null || {
    echo "🔐 Please login to Firebase:"
    firebase login
}

# Build the application
echo ""
echo "🔨 Building production bundle..."
npm run build

# Verify build output
if [ ! -d "dist/public" ]; then
    echo "❌ Build failed: dist/public directory not found"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Ask for confirmation
read -p "🚀 Ready to deploy to Firebase? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📤 Deploying to Firebase Hosting..."
    firebase deploy --only hosting
    
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "🌐 Your app is now live!"
    echo "   Check the URL above to access your deployed application."
    echo ""
    echo "📱 Next steps:"
    echo "   1. Test PWA installation on mobile"
    echo "   2. Send test emails to verify classification"
    echo "   3. Enable push notifications"
    echo "   4. Share the URL with your team"
else
    echo "❌ Deployment cancelled"
    exit 0
fi
