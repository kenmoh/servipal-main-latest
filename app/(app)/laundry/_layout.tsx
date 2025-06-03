import { StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { useTheme } from 'tamagui'

const LaundryLayout = () => {
    const theme = useTheme()

    return (
        <Stack screenOptions={{
            headerStyle: {
                backgroundColor: theme.background.val
            }
        }}>
            <Stack.Screen name='index' options={{

                headerShown: false
            }} />
        </Stack>
    )
}

export default LaundryLayout

const styles = StyleSheet.create({})