import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const DeliveryDetailLayout = () => {
    return (
        <Stack>

            <Stack.Screen name='[orderId]' options={{
                headerTransparent: true,
                title: '',
                headerShown: false,
                headerStyle: {
                    backgroundColor: 'trasparent',

                },
                // headerTintColor: theme.icon.val,



            }} />

        </Stack>
    )
}

export default DeliveryDetailLayout

const styles = StyleSheet.create({})