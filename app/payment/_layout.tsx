import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { useTheme } from 'tamagui'

const PaymentStatusLayout = () => {

    const theme = useTheme()
    return (
        <Stack>

            <Stack.Screen name='[orderId]' options={{

                title: '',

                headerStyle: {
                    backgroundColor: theme.background.val,

                },

            }} />

            <Stack.Screen name='payment-complete' options={{
                presentation: 'modal',
                headerShown: false,
                headerStyle: {
                    backgroundColor: theme.background.val,

                },

            }} />

        </Stack>
    )
}

export default PaymentStatusLayout

const styles = StyleSheet.create({})