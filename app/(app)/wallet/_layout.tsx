import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { useTheme } from 'tamagui'

const WalletLayout = () => {
    const theme = useTheme()
    return (
        <Stack screenOptions={{
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: theme.background.val
            }
        }}>
            <Stack.Screen name='index' options={{
                title: 'Wallet'
            }} />
        </Stack>
    )
}

export default WalletLayout

const styles = StyleSheet.create({})