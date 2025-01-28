import { StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { useTheme } from 'tamagui'

const FoodLayout = () => {
    const theme = useTheme()
    return (
        <Stack screenOptions={{
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: theme.background.val,

            }
        }}>
            <Stack.Screen name="index" options={{ title: 'Food', headerShown: false }} />
            <Stack.Screen name="[storeId]" options={{
                headerTransparent: true,
                title: '',

                headerStyle: {
                    backgroundColor: 'transparent',

                },
            }} />

        </Stack>
    )
}

export default FoodLayout

const styles = StyleSheet.create({})