import { Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";
import { Circle, Input, useTheme, View, XStack } from "tamagui";
import { BellIcon, Search, UserRound } from "lucide-react-native";
import AppTextInput from "@/components/AppInput";
import { useQuery } from "@tanstack/react-query";
import { fetchNotificationBadgeCount, fetchUnreadBadgeCount } from "@/api/report";
import { useAuth } from "@/context/authContext";



const HeaderRight = ({
    onPressSearch,
    onPressNotification,
}: {
    onPressSearch: () => void;
    onPressNotification: () => void;
}) => {
    const theme = useTheme()
    const { user } = useAuth()
    const {
        data: badges,
    } = useQuery({
        queryKey: ["notification-badge"],
        queryFn: () => fetchUnreadBadgeCount(user?.sub as string),
        // refetchInterval: 5000),
        enabled: !!user?.sub,
    });

    console.log(badges)

    return (
        <XStack gap={"$3"}>
            <Circle backgroundColor={"$cardDark"} width={"$4"} height={"$4"} position="relative">
                <TouchableOpacity onPressIn={onPressNotification}>
                    <BellIcon color={"#fff"} />
                </TouchableOpacity>
                {/* Badge for unread notifications */}
                {badges && badges.unread_count > 0 && (
                    <View
                        style={{
                            position: 'absolute',
                            top: -5,
                            right: -5,
                            backgroundColor: theme.btnPrimaryColor.val,
                            borderRadius: 10,
                            minWidth: 20,
                            height: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 2,
                            borderColor: theme.background.val,
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 10,
                                fontWeight: 'bold',
                                fontFamily: 'Poppins-Bold',
                            }}
                        >
                            {badges.unread_count > 99 ? '99+' : badges.unread_count}
                        </Text>
                    </View>
                )}
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
                    // flex: 1
                },
            }}
        >
            <Stack.Screen
                name="(topTabs)"
                options={{
                    title: "ServiPal",
                    headerTitleStyle: { color: theme.text.val, fontFamily: 'Poppins-Bold', fontSize: 22, },
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
