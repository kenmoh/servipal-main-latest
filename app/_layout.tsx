import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import "react-native-get-random-values";
import { useColorScheme } from "react-native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from 'expo-notifications'
import * as TaskManager from 'expo-task-manager'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { TamaguiProvider } from "tamagui";
import { NotifierWrapper } from "react-native-notifier";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useAuth } from '@/context/authContext';


import tamaguiConfig from "@/tamagui.config";
import AuthProvider from "@/components/AuthProvider";
import AddItemBtn from "@/components/AddItemBtn";
import { useCartStore } from "@/store/cartStore";
import { useLocationStore } from "@/store/locationStore";
import { Trash } from "lucide-react-native";
import { NotificationProvider } from "@/components/NotificationProvider";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


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


  if (!loaded) {
    return null;
  }

  return (
<KeyboardProvider statusBarTranslucent={true} navigationBarTranslucent={true}>
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            {/* <ToastProvider native={false}> */}

            <NotifierWrapper>
              <AuthProvider>
                <NotificationProvider>

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
                      name="restaurant-detail"
                      options={{
                        headerShown: false,
                      }}
                    />

                    <Stack.Screen
                      name="laundry-detail"
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
                    <Stack.Screen
                      name="orderReceipt/[orderId]"
                      options={{
                        title: 'Download Receipt',
                        headerStyle: {
                          backgroundColor: BACKGORUND_COLOR,
                        },
                      }}
                    />
                    <Stack.Screen
                      name="notification-detail/[notificationId]"
                      options={{
                        title: 'Notification Details',
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
                </NotificationProvider>
                <StatusBar style="auto" />
              </AuthProvider>
            </NotifierWrapper>
          </ThemeProvider>
        </TamaguiProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
    </KeyboardProvider>

  );
}
