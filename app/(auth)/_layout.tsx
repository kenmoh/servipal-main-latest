import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { useTheme } from 'tamagui'

const AuthLayout = () => {
    const theme = useTheme()
    return (
        <Stack screenOptions={{
            title: '',
            headerStyle: {
                backgroundColor: theme.background.val
            },
            contentStyle: {
                backgroundColor: theme.background.val
            }
        }}>
            <Stack.Screen name='sign-in' options={{ headerShown: false }} />
            <Stack.Screen name='sign-up' />
            <Stack.Screen name='confirm-account' />
            <Stack.Screen name='forgot-password' />
        </Stack>
    )
}

export default AuthLayout

const styles = StyleSheet.create({})