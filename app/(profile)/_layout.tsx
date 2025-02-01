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
            <Stack.Screen name='userProfile' options={{
                title: 'Update Profile',

            }} />
            <Stack.Screen name='riders' options={{
                title: 'Riders',
                headerRight: () => (
                    <Button
                        icon={<UserRoundPlus size={20} color={theme.text.val} />}
                        borderRadius={'$10'}

                        backgroundColor={'$transparentBtnPrimaryColor'}
                        onPressIn={() => router.push({ pathname: '/(profile)/addRider' })}
                    >
                        <Text style={{ color: theme.text.val, fontFamily: 'Poppins-Medium', marginLeft: 5 }}>Add Rider</Text>
                    </Button>
                )


            }} />
        </Stack>
    )
}

export default ProfileLayout

const styles = StyleSheet.create({})