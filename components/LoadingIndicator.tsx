
import { ActivityIndicator } from 'react-native'
import { useTheme, View } from 'tamagui'


function LoadingIndicator() {
    const theme = useTheme()
    return <View backgroundColor={'$background'} flex={1} justifyContent='center' alignItems='center'>
        <ActivityIndicator size="large" color={theme.icon.val} />
    </View>
}

export default LoadingIndicator