import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  useTheme,
  YStack,
  Button,
  XStack,
  ScrollView,
} from "tamagui";
import AppTextInput from "@/components/AppInput";
import { router } from "expo-router";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { useAuth } from "@/context/authContext";
import { jwtDecode } from "jwt-decode";

import { Login, Profile, User, UserDetails } from "@/types/user-types";
import authStorage from "@/storage/authStorage";
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "@/api/auth";
import { ActivityIndicator } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyboardAvoidingView, KeyboardAwareScrollView } from "react-native-keyboard-controller";

const signInSchema = z.object({
  username: z.string().email({ message: "Enter a valid email" }).nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignIn = () => {
  const theme = useTheme();
  const authContext = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ username, password }: Login) => loginApi(username, password),
    onError: (error) => {

      Notifier.showNotification({
        title: "Error",
        description: `${error.message}`,
        Component: NotifierComponents.Alert,
        componentProps: {
          alertType: "error",
        },
      });
      router.replace("/sign-in");
    },
    onSuccess: async (data) => {
      const user = jwtDecode(data?.access_token) as User;

      if (user?.account_status === "pending") {
        await authStorage.storeToken(data?.access_token);
        Notifier.showNotification({
          title: "Confirm Account",
          description: "Please confirm your account",
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: "info",
          },
        });
        router.replace("/(auth)/confirm-account");
        return;
      }

      if (user?.account_status === "confirmed") {

        try {
          await authStorage.storeToken(data?.access_token);
          authContext.setUser(user);
          Notifier.showNotification({
            title: "Success",
            description: "Login successful",
            Component: NotifierComponents.Alert,
            componentProps: {
              alertType: "success",
            },
          });

          router.replace("/(app)/delivery/(topTabs)");
        } catch (error) {
          console.error("Error storing token:", error);
        }
      }
    },
  });

  return (

    <KeyboardAwareScrollView
    // flex={1}
    // width={"100%"}
    // backgroundColor={"$background"}
    // showsVerticalScrollIndicator={false}
    // contentContainerStyle={{
    //   alignItems: "center",
    //   justifyContent: "center",
    // }}
    >
      <View
        flex={1}
        width={"100%"}
        height={"100%"}
        alignItems="center"
        alignContent="center"
        marginTop={70}
        justifyContent="center"
        backgroundColor={"$background"}
      >
        <YStack alignSelf="center" width={"90%"} marginBottom={10}>
          <Text
            alignSelf="flex-start"
            fontFamily={"$heading"}
            fontSize={20}
            fontWeight={"bold"}
          >
            Welcome back!
          </Text>
          <Text
            alignSelf="flex-start"
            fontFamily={"$heading"}
            fontSize={12}
            fontWeight={"400"}
          >
            Login to continue
          </Text>
        </YStack>
        <View width={"100%"}>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, value, onBlur } }) => (
              <AppTextInput
                autoCapitalize="none"
                keyboardType="email-address"
                label={"Email"}
                placeholder="email@example.com"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                errorMessage={errors.username?.message}
                editable={!isPending}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value, onBlur } }) => (
              <AppTextInput
                label={"Password"}
                placeholder="************"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                secureTextEntry
                showPasswordToggle
                errorMessage={errors.password?.message}
                editable={!isPending}
              />
            )}
          />

          <View marginTop={10} width={"90%"} alignSelf="center">
            <Text
              hitSlop={50}
              alignSelf="flex-end"
              onPress={() => router.push("./forgot-password")}
              fontFamily={"$body"}
              fontSize={14}
              color={"$btnPrimaryColor"}
              textDecorationLine="underline"
            >
              Forgot password
            </Text>
          </View>
          <Button
            backgroundColor={isPending ? "$cardDark" : "$btnPrimaryColor"}
            height={"$5"}
            width={"90%"}
            marginTop={40}
            color={"$text"}
            fontWeight={"bold"}
            fontSize={"$5"}
            fontFamily={"$heading"}
            textAlign="center"
            alignSelf="center"

            onPress={handleSubmit((values) => mutate(values))}
          >
            {isPending ? (
              <ActivityIndicator size={"large"} color={theme.text.val} />
            ) : (
              "Login"
            )}
          </Button>
        </View>
        <XStack
          alignSelf="center"
          marginTop={25}
          alignItems="center"
          justifyContent="center"
          width={"90%"}
          marginBottom={30}
        >
          <Text color={"$text"} fontFamily={"$body"} fontSize={14}>
            Don't have an account?{" "}
          </Text>
          <Text
            hitSlop={50}
            onPress={() => router.navigate("/sign-up")}
            fontFamily={"$body"}
            fontSize={14}
            color={"$btnPrimaryColor"}
            textDecorationLine="underline"
          >
            Register
          </Text>
        </XStack>
      </View>
    </KeyboardAwareScrollView>

  );
};

export default SignIn;
