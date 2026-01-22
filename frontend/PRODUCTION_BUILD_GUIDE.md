# CrackerShop Frontend - Production Build & Deployment Guide

## Overview
CrackerShop Mobile App is a React Native/Expo application built with TypeScript. This guide covers production build and deployment for iOS and Android.

## Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0 or yarn >= 1.22.0
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- iOS: Xcode 14+ (macOS only)
- Android: Android Studio with SDK 31+
- Apple Developer Account (for iOS)
- Google Play Developer Account (for Android)

## Installation & Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
# or
yarn install
```

### 2. Configure Environment
```bash
# Update environment.js with your production API URL
nano environment.js
```

Update the production API endpoint:
```javascript
prod: {
    apiUrl: 'https://api.yourdomain.com/api/v1',
    uploadUrl: 'https://api.yourdomain.com/uploads',
    environment: 'production',
    logLevel: 'error',
    timeout: 15000
}
```

### 3. Configure EAS (Expo Application Services)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login with Expo account
eas login

# Initialize EAS project
eas init
```

## Building for Production

### Build Configuration (eas.json)
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "buildType": "simulator"
      }
    },
    "preview2": {
      "android": {
        "gradleCommand": ":app:assembleRelease"
      },
      "ios": {
        "buildType": "archive"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "buildType": "archive"
      }
    }
  }
}
```

### Build Commands

#### Android
```bash
# Build APK (for testing)
eas build --platform android --profile preview

# Build AAB (for Google Play Store)
eas build --platform android --profile production
```

#### iOS
```bash
# Build for testing (requires Apple Developer Account)
eas build --platform ios --profile preview

# Build for App Store
eas build --platform ios --profile production
```

## Deployment

### Google Play Store Deployment

#### Step 1: Set up Google Play Account
1. Create Google Play Developer Account ($25 one-time fee)
2. Create app entry in Google Play Console
3. Generate and upload signing keys

#### Step 2: Build Release APK/AAB
```bash
# Build for production
eas build --platform android --profile production

# Download the AAB file
eas build:list # Find your build ID
```

#### Step 3: Upload to Google Play Console
```bash
# Automated submission
eas submit --platform android --latest

# Manual upload
# Go to Google Play Console > Release > Production
# Upload the AAB file
# Fill in release notes and update description
```

### Apple App Store Deployment

#### Step 1: Set up Apple Developer Account
1. Create Apple Developer Account ($99/year)
2. Create App ID in Apple Developer Portal
3. Create iOS Distribution Certificate
4. Create Provisioning Profile

#### Step 2: Configure Apple Credentials
```bash
# Setup Apple credentials with EAS
eas credentials --platform ios
# Follow prompts to upload certificates

# Or use existing certificates
eas credentials --platform ios --interactive
```

#### Step 3: Build for App Store
```bash
# Build for production
eas build --platform ios --profile production
```

#### Step 4: Submit to App Store
```bash
# Automated submission
eas submit --platform ios --latest

# Or manual submission via App Store Connect
# Use Xcode Organizer to upload
```

## Performance Optimization

### Bundle Size Optimization
```bash
# Analyze bundle
expo export --platform android
# Check the bundle.apk size

# Reduce bundle size:
# - Remove unused dependencies
# - Use dynamic imports
# - Minify assets
# - Optimize images
```

### Performance Tips
1. **Image Optimization**: Use optimized image formats (WebP)
2. **Code Splitting**: Split large components into smaller chunks
3. **Lazy Loading**: Use React.lazy() for route components
4. **Memory Management**: Clean up subscriptions and listeners
5. **Network Optimization**: Implement request caching
6. **Asset Caching**: Cache static assets locally

### Monitoring & Analytics
```javascript
// Add analytics to track user behavior
import * as Analytics from 'expo-firebase-analytics';

// Track screen views
Analytics.logScreenView({
  screen_name: 'ProductView',
  screen_class: 'ProductViewScreen'
});
```

## Testing

### Pre-Release Testing
```bash
# Run linting
npm run lint

# Type check
npm run type-check

# Test on physical device
npm run android  # or ios
```

### Testing Checklist
- [ ] All screens load without errors
- [ ] Navigation works smoothly
- [ ] Forms submit correctly
- [ ] Authentication flow works
- [ ] Images load properly
- [ ] Offline functionality (if applicable)
- [ ] API calls handle errors
- [ ] Performance is acceptable

## Updates & Versioning

### Update App Version
```javascript
// app.json
{
  "expo": {
    "version": "1.0.1",  // Updated version
    "android": {
      "versionCode": 2
    },
    "ios": {
      "buildNumber": "2"
    }
  }
}
```

### Over-the-Air Updates (using Expo Updates)
```bash
# Publish an update
expo publish

# Users will get the update next time they restart the app
```

## Troubleshooting

### Common Build Issues

#### 1. Build Fails with Dependencies Error
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm run lint
```

#### 2. Android Build Issues
- Check Android SDK version
- Verify keystore configuration
- Clear Gradle cache: `cd android && ./gradlew clean`

#### 3. iOS Build Issues
- Update CocoaPods: `pod install`
- Check provisioning profiles
- Verify signing certificates

#### 4. Large Bundle Size
```bash
# Analyze bundle
webpack-bundle-analyzer

# Remove unused packages
npm prune --production
```

## Monitoring in Production

### Error Tracking (Sentry)
```bash
npm install @sentry/react-native

# Initialize in app
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: 'production'
});
```

### Crash Reporting
```javascript
// Implement custom error handler
ErrorHandler.setupGlobalHandler({
  onError: (error) => {
    reportError(error); // Send to server
  }
});
```

## Release Notes

### Version 1.0.0 (2026-01-21)
- Initial public release
- Complete product catalog
- User authentication
- Order management
- Payment integration
- Chit scheme support
- Push notifications
- Offline support

## Support

- **Documentation**: Check `/docs` folder
- **Bug Reports**: GitHub Issues
- **Feature Requests**: GitHub Discussions
- **Email Support**: support@yourdomain.com

## License
ISC

## Additional Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [EAS Build Documentation](https://docs.expo.dev/eas-update/introduction)
- [App Store Connect Help](https://help.apple.com/app-store-connect)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
