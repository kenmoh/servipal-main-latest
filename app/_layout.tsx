import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import "react-native-get-random-values";
import { useColorScheme } from "react-native";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { TamaguiProvider, useTheme } from "tamagui";
import { NotifierWrapper } from "react-native-notifier";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from 'expo-notifications';
import * as Device from "expo-device";
import Constants from "expo-constants";
import { registerForNotifications } from '@/api/user';
import { useAuth } from '@/context/authContext';
import { Notifier, NotifierComponents } from 'react-native-notifier';

import tamaguiConfig from "@/tamagui.config";
import AuthProvider from "@/components/AuthProvider";
import AddItemBtn from "@/components/AddItemBtn";
import { useCartStore } from "@/store/cartStore";
import { useLocationStore } from "@/store/locationStore";
import { Trash } from "lucide-react-native";

const BACKGORUND_COLOR = "#18191c"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 1000 * 60 * 5,
      // gcTime: 1000 * 60 * 30,
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { clearCart } = useCartStore();
  const { reset } = useLocationStore();
  const { user } = useAuth();

  const handleClearCart = () => {
    clearCart();
    reset();
  };

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

  // useEffect(() => {
  //   const registerPushNotifications = async () => {
  //     try {
  //       const { status: existingStatus } = await Notifications.getPermissionsAsync();
  //       let finalStatus = existingStatus;

  //       if (existingStatus !== 'granted') {
  //         const { status } = await Notifications.requestPermissionsAsync();
  //         finalStatus = status;
  //       }

  //       if (finalStatus !== 'granted') {
  //         Notifier.showNotification({
  //           title: "Permission Required",
  //           description: "Please enable notifications in your device settings",
  //           Component: NotifierComponents.Alert,
  //           componentProps: { alertType: "warn" },
  //         });
  //         return;
  //       }

  //       const token = (await Notifications.getExpoPushTokenAsync()).data;

  //       if (user?.sub) {
  //         await registerForNotifications({ notification_token: token });
  //       }
  //     } catch (error) {
  //       console.error('Error registering for notifications:', error);
  //     }
  //   };

  //   registerPushNotifications();
  // }, [user?.sub]);

  const registerForPushNotification = async () => {
    if (Device.isDevice) {
      try {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();

        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }
        const token = await Notifications.getExpoPushTokenAsync({
          projectId:
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.easConfig?.projectId,
        });

        console.log(token.data)

        if (token.data) {
          registerForNotifications({ notification_token: token.data });
        }
      } catch (error) {
        throw new Error(`Error getting notification token. \n ERROR: ${error}`);
      }
    }
  };

  useEffect(() => {
    registerForPushNotification();
    Notifications.addNotificationResponseReceivedListener((notification) =>
      router.replace("/(apps)/delivery")
    );
  }, [user?.sub]);


  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            {/* <ToastProvider native={false}> */}

            <NotifierWrapper>
              <AuthProvider>
                <Stack
                  screenOptions={{
                    navigationBarColor: BACKGORUND_COLOR,
                    contentStyle: {
                      backgroundColor: BACKGORUND_COLOR,
                    },
                  }}
                >
                  <Stack.Screen name="(app)" options={{ headerShown: false }} />
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="(auth)"
                    options={{ headerShown: false }}
                  />
                  {/* <Stack.Screen name='(profile)' options={{
                    headerShown: false

                  }} /> */}
                  <Stack.Screen
                    name="delivery-detail"
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="store-detail"
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="payment"
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="receipt/[deliveryId]"
                    options={{
                      title: 'Download Receipt',
                      headerStyle: {
                        backgroundColor: BACKGORUND_COLOR,
                      },
                    }}
                  />
                  <Stack.Screen name='report/[deliveryId]' options={{
                    title: 'Report an Issue',
                    headerStyle: {
                      backgroundColor: BACKGORUND_COLOR,
                    },
                  }} />
                  <Stack.Screen
                    name="review/[deliveryId]"
                    options={{
                      title: 'Leave a Review',
                      headerStyle: {
                        backgroundColor: BACKGORUND_COLOR,
                      },
                    }}
                  />
                  <Stack.Screen
                    name="cart/index"
                    options={{
                      title: "Cart",
                      headerStyle: {
                        backgroundColor: BACKGORUND_COLOR,
                      },
                      headerRight: () => (
                        <AddItemBtn
                          icon={<Trash size={18} color={"white"} />}
                          label="Clear Cart"
                          onPress={handleClearCart}
                        />
                      ),
                    }}
                  />

                  <Stack.Screen
                    name="user-details"
                    options={{
                      presentation: "transparentModal",
                      animation: "slide_from_bottom",
                      headerShown: false,
                      contentStyle: {
                        backgroundColor: "rgba(0,0,0,0.7)",
                      },
                    }}
                  />
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
