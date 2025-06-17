import { StyleSheet } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { useTheme } from "tamagui";
import AddItemBtn from "@/components/AddItemBtn";

const LaundryDetailLayout = () => {
    const theme = useTheme();
    return (
        <Stack
            screenOptions={{
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: theme.background.val,
                },
            }}
        >
            <Stack.Screen
                name="[laundryId]"
                options={{
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: "transparent",

                    },
                }}
            />

              <Stack.Screen
                name="addLaundryItem"

                options={{
                    title: 'Add Item',
                    animation: 'slide_from_bottom'

                }}
            />


        </Stack>
    );
};

export default LaundryDetailLayout;

