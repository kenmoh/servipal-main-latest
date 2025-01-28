import { Stack } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'


const MarketplaceLayout = () => {
    return (
        <Stack>
            <Stack.Screen name='index' options={{
                headerShown: false
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