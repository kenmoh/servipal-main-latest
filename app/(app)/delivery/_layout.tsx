import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'
import { Circle, Input, useTheme, View, XStack } from 'tamagui'
import { BellIcon, Search, UserRound } from 'lucide-react-native'



const HeaderLeft = ({ onPress }: { onPress: () => void }) => {
    return (
        <Circle backgroundColor={'$cardDark'} width={'$4'} height={'$4'}>
            <TouchableOpacity
                hitSlop={50}
                onPressIn={onPress} >
                <UserRound color={'#fff'} />
            </TouchableOpacity>
        </Circle>
    )
}

const HeaderRight = ({ onPressSearch, onPressNotification }: { onPressSearch: () => void, onPressNotification: () => void }) => {
    return (
        <XStack gap={'$3'}>
            <Circle backgroundColor={'$cardDark'} width={'$4'} height={'$4'}>
                <TouchableOpacity

                    onPressIn={onPressSearch} >
                    <Search color={'#fff'} />
                </TouchableOpacity>
            </Circle>
            <Circle backgroundColor={'$cardDark'} width={'$4'} height={'$4'}>
                <TouchableOpacity

                    onPressIn={onPressNotification} >
                    <BellIcon color={'#fff'} />
                </TouchableOpacity>
            </Circle>

        </XStack>

    )
}

const DeliveryLayout = () => {
    const theme = useTheme()


    return (
        <Stack screenOptions={{
            headerStyle: {
                backgroundColor: theme.background.val,
            },
            contentStyle: {
                backgroundColor: theme.background.val
            }
        }}>
            <Stack.Screen name='[id]' options={{
                headerTransparent: true,
                title: '',
                headerStyle: {
                    backgroundColor: 'trasparent',

                },
                headerTintColor: theme.icon.val,


            }} />

            <Stack.Screen name='(topTabs)' options={{
                title: '',
                headerStyle: { backgroundColor: theme.background.val },
                headerLeft: () => <HeaderLeft onPress={() => router.push({ pathname: '/sign-up' })} />,
                headerRight: () => <HeaderRight onPressNotification={() => router.push({ pathname: '/(app)/delivery/notification' })} onPressSearch={() => router.push({ pathname: '/(app)/delivery/search' })} />,
                animation: 'ios_from_left'

            }} />
            <Stack.Screen name='search' options={{
                title: '',
                headerShown: false
            }} />
            <Stack.Screen name='notification' options={{
                title: 'Notifications'
            }} />
        </Stack>
    )
}

export default DeliveryLayout

const styles = StyleSheet.create({})
