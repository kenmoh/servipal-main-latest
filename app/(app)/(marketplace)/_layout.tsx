import { Stack } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { useTheme } from 'tamagui'


const MarketplaceLayout = () => {
    const theme = useTheme()
    return (
        <Stack screenOptions={{
            headerStyle: {
                backgroundColor: theme.background.val
            }
        }}>
            <Stack.Screen name='index' options={{
                title: 'Marketplace'
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