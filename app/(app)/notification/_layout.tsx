import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { useTheme } from 'tamagui'

const NotificationLayout = () => {
    const theme = useTheme()
    return (
        <Stack >
            <Stack.Screen name='index' options={{
                headerStyle: {
                    backgroundColor: theme.background.val
                }
            }} />
        </Stack>
    )
}

export default NotificationLayout

const styles = StyleSheet.create({})