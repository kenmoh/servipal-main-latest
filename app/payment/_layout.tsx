import { StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { useTheme } from 'tamagui'

const PaymentStatusLayout = () => {

    const theme = useTheme()
    return (
        <Stack>

            <Stack.Screen name='[orderId]' options={{

                title: '',
                animation: 'slide_from_bottom',
                headerStyle: {
                    backgroundColor: theme.background.val,

                },

            }} />

            <Stack.Screen name='payment-complete' options={{
                animation: 'slide_from_bottom',
                headerShown: false,
                headerStyle: {
                    backgroundColor: theme.background.val,

                },

            }} />

            <Stack.Screen name='deep-link-handler' options={{
                animation: 'none',
                headerShown: false,
                presentation: 'transparentModal',
            }} />

            <Stack.Screen name='transfer-detail' options={{
                title: 'Transfer Details',
                animation: 'slide_from_bottom',

                presentation: 'transparentModal',
                headerStyle: {
                    backgroundColor: theme.background.val,

                },
            }} />

        </Stack>
    )
}

export default PaymentStatusLayout

const styles = StyleSheet.create({})