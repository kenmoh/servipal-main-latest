import { StyleSheet, Text, View } from 'react-native'
import { Stack, withLayoutContext } from "expo-router";
import { useTheme } from 'tamagui';

const ProfileLayout = () => {
    const theme = useTheme()
    return (
        <Stack screenOptions={{
            headerTintColor: theme.text.val,
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: theme.background.val
            }
        }}>
            <Stack.Screen name='index' options={{
                title: '',
                headerShown: false
            }} />
            <Stack.Screen name='addRider' options={{
                title: 'Add Rider'
            }} />
            <Stack.Screen name='changePassword'
                options={{
                    title: 'Change Password'
                }}
            />
            <Stack.Screen name='profile' options={{
                title: 'Update Profile'
            }} />
            <Stack.Screen name='riders' options={{
                title: 'Riders',

            }} />
        </Stack>
    )
}

export default ProfileLayout

const styles = StyleSheet.create({})