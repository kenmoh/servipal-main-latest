import { TouchableOpacity } from 'react-native'
import { Text, XStack, useTheme } from 'tamagui'
import { useLocationStore } from '@/store/locationStore'
import { MapPin } from 'lucide-react-native'

interface CurrentLocationButtonProps {
    onLocationSet?: (address: string, coords: [number, number]) => void
}

const CurrentLocationButton = ({ onLocationSet }: CurrentLocationButtonProps) => {
    const theme = useTheme()
    const getCurrentLocation = useLocationStore(state => state.getCurrentLocation)

    const handlePress = async () => {
        const location = await getCurrentLocation()
        if (location && onLocationSet) {
            onLocationSet(location.address, location.coords)
        }
    }

    return (
        <TouchableOpacity onPress={handlePress}>
            <XStack
                backgroundColor="$cardBackground"
                padding="$3"
                borderRadius="$9"
                alignItems="center"
                gap="$2"
                maxWidth={'50%'}
                alignSelf='center'

            >
                <MapPin size={16} color={theme.btnPrimaryColor.val} />
                <Text fontSize={12} color="$text">
                    Use current location
                </Text>
            </XStack>
        </TouchableOpacity>
    )
}

export default CurrentLocationButton