import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import 'react-native-get-random-values';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { TamaguiProvider } from 'tamagui'
import { NotifierWrapper } from 'react-native-notifier'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import tamaguiConfig from '@/tamagui.config';
import AuthProvider from "@/components/AuthProvider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// SplashScreen.setOptions({
//   duration: 500,
//   fade: true
// })

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            {/* <ToastProvider native={false}> */}

            <NotifierWrapper>
              <AuthProvider>
                <Stack screenOptions={{
                  navigationBarColor: '#18191c',
                  contentStyle: {
                    backgroundColor: '#18191c'
                  }

                }}>


                  <Stack.Screen name="(app)" options={{ headerShown: false }} />
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                  <Stack.Screen name='(profile)' options={{
                    headerShown: false

                  }} />
                  <Stack.Screen name='delivery-detail' options={{
                    headerShown: false

                  }} />
                  <Stack.Screen name='payment' options={{
                    headerShown: false

                  }} />
                  <Stack.Screen name='cart' options={{
                    headerShown: false

                  }} />

                  <Stack.Screen name="user-details" options={{
                    presentation: 'transparentModal',
                    animation: 'slide_from_bottom',
                    headerShown: false,
                    contentStyle: {
                      backgroundColor: 'rgba(0,0,0,0.7)',
                    }


                  }} />



                </Stack>
                <StatusBar style="auto" />

              </AuthProvider>

            </NotifierWrapper>
          </ThemeProvider>
        </TamaguiProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
