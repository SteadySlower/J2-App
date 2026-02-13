// iOS Client ID에서 reversed client ID 생성
const getReversedClientId = (iosClientId) => {
  if (!iosClientId) return null;
  // iOS Client ID 형식: 123456789-abc.apps.googleusercontent.com
  // Reversed 형식: com.googleusercontent.apps.123456789-abc
  const match = iosClientId.match(/^(.+?)\.apps\.googleusercontent\.com$/);
  if (match) {
    return `com.googleusercontent.apps.${match[1]}`;
  }
  return null;
};

const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "";
const reversedClientId = getReversedClientId(iosClientId);

export default {
  expo: {
    name: "j2-app",
    slug: "j2-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "j2app",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      bundleIdentifier: "com.jwmoon.j2app",
      supportsTablet: true,
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [
              "j2app",
              ...(reversedClientId ? [reversedClientId] : []),
            ],
          },
        ],
      },
    },
    android: {
      package: "com.jwmoon.j2app",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-dev-client",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      "@react-native-google-signin/google-signin",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || "",
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
      apiUrl: process.env.API_URL || "http://localhost:3001",
      googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "",
      googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "",
    },
  },
};
