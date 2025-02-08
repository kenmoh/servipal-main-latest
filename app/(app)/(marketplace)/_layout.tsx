import AddItemBtn from '@/components/AddItemBtn'
import { router, Stack } from 'expo-router'
import { StyleSheet } from 'react-native'
import { Text, useTheme } from 'tamagui'


const MarketplaceLayout = () => {
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
            <Stack.Screen name='index' options={{
                title: 'Marketplace',
                headerTitleStyle: {
                    fontSize: 16,
                    fontFamily: 'Poppins-Medium'
                },

                headerLeft: () => <AddItemBtn label='SELL' onPress={() => router.push({ pathname: '/(app)/(marketplace)/addProduct' })} />,
                headerRight: () => (<Text
                    marginRight='$2'
                    textDecorationLine='underline'
                    textDecorationColor={'grey'}
                    color={'$gray12'}
                    style={{ fontFamily: 'Poppins-Medium' }}
                    onPressIn={() => router.push({ pathname: '/myItems' })}
                >
                    My Items
                </Text>)
            }} />
            <Stack.Screen name='[itemId]' options={{
                headerShown: true,
                headerTransparent: true,
                title: '',
                headerStyle: {
                    backgroundColor: 'transparent'
                }
            }} />
            <Stack.Screen name='addProduct' options={{

                title: 'Add Product',

            }} />
            <Stack.Screen name='myItems' options={{

                title: 'Items',
                headerStyle: {
                    backgroundColor: theme.background.val
                }

            }} />
        </Stack>
    )
}

export default MarketplaceLayout

const styles = StyleSheet.create({})