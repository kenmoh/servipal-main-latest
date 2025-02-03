import AddItemBtn from '@/components/AddItemBtn'
import { router, Stack } from 'expo-router'
import { StyleSheet } from 'react-native'
import { Text, useTheme } from 'tamagui'


const MarketplaceLayout = () => {
    const theme = useTheme()
    return (
        <Stack screenOptions={{
            headerStyle: {
                backgroundColor: theme.background.val
            }
        }}>
            <Stack.Screen name='index' options={{
                title: 'Marketplace',
                headerLeft: () => <AddItemBtn label='SELL' onPress={() => router.push({ pathname: '/(app)/(marketplace)/addProduct' })} />,
                headerRight: () => (<Text
                    fontWeight={'700'}
                    marginRight='$2'
                    textDecorationLine='underline'
                    textDecorationColor={'grey'}
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
        </Stack>
    )
}

export default MarketplaceLayout

const styles = StyleSheet.create({})