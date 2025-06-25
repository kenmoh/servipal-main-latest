import { Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";
import { Circle, Input, useTheme, View, XStack } from "tamagui";
import { BellIcon, Search, UserRound } from "lucide-react-native";
import AppTextInput from "@/components/AppInput";



const HeaderRight = ({
    onPressSearch,
    onPressNotification,
}: {
    onPressSearch: () => void;
    onPressNotification: () => void;
}) => {
    const theme = useTheme()
    return (
        <XStack gap={"$3"}>

            <Circle backgroundColor={"$cardDark"} width={"$4"} height={"$4"}>
                <TouchableOpacity onPressIn={onPressNotification}>
                    <BellIcon color={"#fff"} />
                </TouchableOpacity>
            </Circle>
        </XStack>
    );
};
const HeaderLeft = () => {
    const theme = useTheme()
    return (
        <XStack gap={"$3"}>

            <Circle backgroundColor={"$cardDark"} width={"$4"} height={"$4"}>
                <Image source={require('@/assets/images/android-icon.png')}
                    style={{
                        width: 55,
                        height: 55,
                        resizeMode: 'contain'
                    }}
                />
            </Circle>
        </XStack>
    );
};

const DeliveryLayout = () => {
    const theme = useTheme();

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.background.val,
                },
                contentStyle: {
                    backgroundColor: theme.background.val,
                },
            }}
        >
            <Stack.Screen
                name="(topTabs)"
                options={{
                    title: "ServiPal",
                    headerTitleStyle: {color: theme.text.val, fontFamily: 'Poppins-Bold', fontSize: 22,},
                    headerStyle: { backgroundColor: theme.background.val },
                    headerLeft: () => <HeaderLeft />,
                    headerRight: () => (
                        <HeaderRight
                            onPressNotification={() =>
                                router.push({ pathname: "/(app)/delivery/notification" })
                            }
                            onPressSearch={() =>
                                router.push({ pathname: "/(app)/delivery/search" })
                            }
                        />
                    ),
                    animation: "ios_from_left",
                }}
            />
            <Stack.Screen
                name="search"
                options={{
                    title: "",
                    headerShown: false,

                }}
            />
            <Stack.Screen
                name="sendItem"
                options={{
                    title: "Enter Location",
                    presentation: "modal",
                }}
            />
            <Stack.Screen
                name="notification"
                options={{
                    title: "Notifications",
                }}
            />
            <Stack.Screen
                name="itemInfo"
                options={{
                    title: "",
                }}
            />
        </Stack>
    );
};

export default DeliveryLayout;

const styles = StyleSheet.create({});
