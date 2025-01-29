import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { useTheme } from 'tamagui'

const DeliveryLayout = () => {
    const theme = useTheme()
    return (
        <Stack>
            <Stack.Screen name='[id]' options={{
                headerTransparent: true,
                title: '',
                headerStyle: {
                    backgroundColor: 'transparent',

                },
                headerTintColor: theme.icon.val
            }} />
            <Stack.Screen name='(topTabs)' options={{

            }} />
        </Stack>
    )
}

export default DeliveryLayout

const styles = StyleSheet.create({})