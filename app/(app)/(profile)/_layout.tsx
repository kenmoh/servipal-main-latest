import { StyleSheet, Text, View } from 'react-native'
import { Stack, withLayoutContext } from "expo-router";

const ProfileLayout = () => {
    return (
        <Stack>
            <Stack.Screen name='index' options={{
                title: '',
                headerShown: false
            }} />
            <Stack.Screen name='addRider' />
            <Stack.Screen name='changePassword' />
            <Stack.Screen name='profile' />
            <Stack.Screen name='riders' />
        </Stack>
    )
}

export default ProfileLayout

const styles = StyleSheet.create({})