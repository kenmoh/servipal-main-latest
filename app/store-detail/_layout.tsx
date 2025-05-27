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
                name="addMenu"
                options={{
                    title: "Add Item",
                }}
            />
            <Stack.Screen
                name="[storeId]"
                options={{
                    headerTransparent: true,
                    title: "",

                    headerStyle: {
                        backgroundColor: "transparent",
                    },
                }}
            />
        </Stack>
    );
};

export default StoreDetailLayout;

const styles = StyleSheet.create({});
