import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { useTheme } from 'tamagui'

const AuthLayout = () => {
    const theme = useTheme()
    return (
        <Stack screenOptions={{
            headerShown: false,
            title: '',
            animation: 'fade_from_bottom',
            headerStyle: {
                backgroundColor: theme.background.val
            }
        }}>
            <Stack.Screen name='sign-in' />
            <Stack.Screen name='sign-up' />
        </Stack>
    )
}

export default AuthLayout

const styles = StyleSheet.create({})