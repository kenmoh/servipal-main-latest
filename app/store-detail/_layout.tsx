import { StyleSheet } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { useTheme } from "tamagui";
import AddItemBtn from "@/components/AddItemBtn";

const StoreDetailLayout = () => {
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
                name="[storeId]"
                options={{
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: "transparent",

                    },
                }}
            />
            <Stack.Screen
                name="addMenu"

                options={{
                    title: 'Add Menu',
                    animation: 'slide_from_bottom'

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

export default StoreDetailLayout;

const styles = StyleSheet.create({});
