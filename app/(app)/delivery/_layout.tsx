import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'
import { Circle, useTheme, View } from 'tamagui'
import { Search, Settings, UserRound } from 'lucide-react-native'


const HeaderLeft = ({ onPress }: { onPress: () => void }) => {
    return (
        <Circle backgroundColor={'$cardDark'} width={'$4'} height={'$4'}>
            <TouchableOpacity
                hitSlop={50}
                onPressIn={onPress} >
                <Settings color={'#fff'} />
            </TouchableOpacity>
        </Circle>
    )
}

const DeliveryLayout = () => {
    const theme = useTheme()
    return (
        <Stack>
            <Stack.Screen name='[id]' options={{
                headerTransparent: true,
                title: '',
                headerStyle: {
                    backgroundColor: 'trasparent',

                },
                headerTintColor: theme.icon.val
            }} />

            <Stack.Screen name='(topTabs)' options={{
                title: '',
                headerStyle: { backgroundColor: theme.btnPrimaryColor.val },
                headerLeft: () => <HeaderLeft onPress={() => router.push({ pathname: '/sign-up' })} />,
                animation: 'ios_from_left'

            }} />
        </Stack>
    )
}

export default DeliveryLayout

const styles = StyleSheet.create({})
