import { StyleSheet } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { useTheme } from "tamagui";

const StoreTabLayout = () => {
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
                name="(store-tab)"
                options={{
                    headerTransparent: true,
                    headerShown: false

                }}
            />
        </Stack>
    );
};

export default StoreTabLayout;

const styles = StyleSheet.create({});
