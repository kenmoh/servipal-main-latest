import { StyleSheet } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'
import { Circle, useTheme, View } from 'tamagui'
import { Search, UserRound } from 'lucide-react-native'
import AppTextInput from '@/components/AppInput'
import AppHeader from '@/components/AppHeader'

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
            <Stack.Screen name='profile' options={{
                headerShown: false

            }} />
            <Stack.Screen name='(topTabs)' options={{
                title: '',
                header: () => <AppHeader icon={
                    <UserRound color={'white'} size={20} />
                } component={<AppTextInput
                    borderRadius={50} height='$3.5' />}
                    onPress={() => router.push({ pathname: '/(app)/delivery/profile' })} />,
                animation: 'ios_from_left'

            }} />
        </Stack>
    )
}

export default DeliveryLayout

const styles = StyleSheet.create({})