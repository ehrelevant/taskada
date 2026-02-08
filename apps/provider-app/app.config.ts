import { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "provider-app",
  slug: "provider-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./lib/assets/icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  scheme: "provider-app",
  splash: {
    image: "./lib/assets/splash-icon-dark.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.taskada.provider',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './lib/assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: 'com.taskada.provider',
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      },
    },
    permissions: [
      'android.permission.RECORD_AUDIO',
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_BACKGROUND_LOCATION',
      'android.permission.FOREGROUND_SERVICE',
      'android.permission.FOREGROUND_SERVICE_LOCATION',
    ],
  },
  web: {
    favicon: './lib/assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    [
      'expo-image-picker',
      {
        photosPermission: 'The app accesses your photos to let you share them.',
      },
    ],
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission: 'Allow $(PRODUCT_NAME) to use your location.',
        isAndroidBackgroundLocationEnabled: true,
        isIosBackgroundLocationEnabled: true,
      },
    ],
  ],
});
