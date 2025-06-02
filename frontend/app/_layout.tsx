// import {
//   DarkTheme,
//   DefaultTheme,
//   ThemeProvider,
// } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

// import { useColorScheme } from "@/hooks/useColorScheme";

import { Amplify } from "aws-amplify";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useEffect } from "react";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-southeast-2_FC8yzI751",
      userPoolClientId: "3elcu0ag9rh0kbdgisgfbi0roi",
      identityPoolId: "",
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: "code",
      userAttributes: {
        email: {
          required: true,
        },
      },
      allowGuestAccess: true,
      passwordFormat: {
        minLength: 8,
        requireLowercase: false,
        requireUppercase: false,
        requireNumbers: false,
        requireSpecialCharacters: false,
      },
    },
  },
});

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  const isLoggedIn = useAuthStatus()
  useEffect(() => {
    if (isLoggedIn === true) {
      router.replace("/home")
    } else if (isLoggedIn === false) {
      router.replace("/");
    }
  }, [isLoggedIn])

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded || isLoggedIn === null) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
    </Stack>
  );
}
