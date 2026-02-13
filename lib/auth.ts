import {
    GoogleSignin,
    statusCodes,
} from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";
import { supabase } from "./supabase";

// Google Sign-In 초기화
const initializeGoogleSignIn = () => {
  const webClientId =
    Constants.expoConfig?.extra?.googleWebClientId ||
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

  const iosClientId =
    Constants.expoConfig?.extra?.googleIosClientId ||
    process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

  if (!webClientId) {
    throw new Error(
      "Google Web Client ID is missing. Please set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in your environment variables."
    );
  }

  GoogleSignin.configure({
    webClientId: webClientId,
    iosClientId: iosClientId || undefined, // iOS Client ID가 있으면 사용, 없으면 undefined
    offlineAccess: true,
    forceCodeForRefreshToken: false, // nonce 문제 해결을 위해 false로 변경
  });
};

// 초기화 실행
initializeGoogleSignIn();

// isSuccessResponse 타입 가드 함수
const isSuccessResponse = (response: any): boolean => {
  return (
    response?.data?.idToken !== undefined && response?.data?.idToken !== null
  );
};

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();

    if (isSuccessResponse(response) && response.data?.idToken) {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.data.idToken,
      });

      if (error) throw error;
      return data.session;
    } else {

      throw new Error("Google sign in failed: Invalid response or no ID token");
    }
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      throw new Error("Sign in was cancelled");
    } else if (error.code === statusCodes.IN_PROGRESS) {
      throw new Error("Sign in is already in progress");
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error("Google Play Services not available");
    }
    throw error;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
