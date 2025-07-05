import { StyleSheet, Text } from 'react-native'
import { Link, router, Stack, withLayoutContext } from "expo-router";
import { Button, useTheme, XStack } from 'tamagui';
import { Plus, UserRoundPlus } from 'lucide-react-native';

const ProfileLayout = () => {
    const theme = useTheme()
    return (
        <Stack screenOptions={{
            headerTintColor: theme.text.val,
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: theme.background.val
            },
            contentStyle: {
                backgroundColor: theme.background.val
            }
        }}>
            <Stack.Screen name='index' options={{
                title: '',
                headerShown: true,
                headerTransparent: true,
                headerStyle: {
                    backgroundColor: 'transparent'
                }
            }} />
            <Stack.Screen name='addRider' options={{
                title: 'Add Rider',

            }} />
            <Stack.Screen name='changePassword'
                options={{
                    title: 'Change Password',

                }}
            />
            <Stack.Screen name='vendorProfile' options={{
                title: 'Update Profile',

            }} />
            <Stack.Screen name='customerProfile' options={{
                title: 'Update Profile',

            }} />

            <Stack.Screen name='wallet' options={{
                title: 'Wallet'
            }} />
            <Stack.Screen name='riders' options={{
                title: 'Riders',



            }} />
            <Stack.Screen name='fund-wallet' options={{
                title: 'Fund Wallet',
                animation: 'slide_from_bottom',
            }} />
            <Stack.Screen name='wallet-payment' options={{
                title: 'Wallet Top-up',
                animation: 'slide_from_bottom',
            }} />
            <Stack.Screen name='[transactionId]' options={{
                title: '',
                animation: 'slide_from_bottom',
            }} />
        </Stack>
    )
}

export default ProfileLayout

const styles = StyleSheet.create({})