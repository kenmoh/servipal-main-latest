import { ExpoConfig, ConfigContext } from "expo/config";

const PRODUCT_NAME = "ServiPal";

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: "ServiPal",
  slug: "servipal",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/android-icon.png",
  scheme: "servipal",
  userInterfaceStyle: "dark",
  newArchEnabled: true,
  ios: {
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY,
    },
    supportsTablet: true,
    bundleIdentifier: "com.kenmoh.servipal",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    associatedDomains: ["applinks:servi-pal.com"],
  },
  android: {
    googleServicesFile: "./google-services.json",
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY,
      },
    },
    adaptiveIcon: {
      foregroundImage: "./assets/images/android-icon.png",
      backgroundColor: "#18191c",
    },
    softwareKeyboardLayoutMode: "pan",
    package: "com.kenmoh.servipal",
    permissions: [
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.RECORD_AUDIO",
    ],
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: "https",
            host: "api.servi-pal.com",
            pathPrefix: "/api/payment/order-payment-callback",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: "servipal",
            host: "*",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  jsEngine: "hermes",
  plugins: [
    "expo-router",
    "expo-font",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/android-icon.png",
        imageWidth: 150,
        resizeMode: "contain",
        backgroundColor: "#18191c",
      },
    ],
    [
      "react-native-edge-to-edge",
      {
        android: {
          parentTheme: "Default",
          enforceNavigationBarContrast: false,
        },
      },
    ],
    [
      "expo-notifications",
      {
        icon: "./assets/images/notification-icon.png",
        color: "#000000",
        defaultChannel: "default",
        enableBackgroundRemoteNotifications: false,
      },
    ],
    "react-native-bottom-tabs",
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
        },
      },
    ],
    [
      "expo-secure-store",
      {
        configureAndroidBackup: true,
        faceIdPermission: `Allow ${PRODUCT_NAME} to access your Face ID biometric data.`,
      },
    ],

    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission: `Allow ${PRODUCT_NAME} to use your location.`,
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "The app accesses your photos to let you upload them.",
      },
    ],
    [
      "@react-native-community/datetimepicker",
      {
        android: {
          datePicker: {
            colorAccent: {
              light: "#FF5722",
            },
            textColorPrimary: {
              light: "#FF5722",
            },
          },
          timePicker: {
            background: {
              light: "#FF5722",
              dark: "#18191c",
            },
            numbersBackgroundColor: {
              light: "#FF5722",
              dark: "#FF5722",
            },
          },
        },
      },
    ],
    "expo-secure-store",
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: "97b0b6a5-6ac1-4bb1-aea7-17a10adcc2d6",
    },
  },
});
