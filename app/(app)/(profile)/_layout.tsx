import { StyleSheet, Text } from 'react-native'
import { Link, router, Stack, withLayoutContext } from "expo-router";
import { useTheme, XStack } from 'tamagui';
import { Plus } from 'lucide-react-native';

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
                animation: 'ios_from_left',
                headerRight: () => (<Link
                    href={'/addRider'}
                    asChild
                    push
                >
                    <XStack backgroundColor={'$transparentBtnPrimaryColor'}
                        borderRadius={'$10'}
                        paddingVertical={'$1.5'} paddingHorizontal={'$3'}>
                        <Plus color={theme.text.val} />
                        <Text style={{ color: theme.text.val, fontFamily: 'Poppins-Medium' }}>Add Rider</Text>
                    </XStack>
                </Link>)

            }} />
        </Stack>
    )
}

export default ProfileLayout

const styles = StyleSheet.create({})