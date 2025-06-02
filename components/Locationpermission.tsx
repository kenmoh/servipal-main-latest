import { YStack, Text, Button, useTheme } from 'tamagui'
import * as Linking from 'expo-linking'
import { MapPin } from 'lucide-react-native'
// import { Linking } from 'react-native'

interface LocationPermissionProps {
    onRetry: () => void
}

const LocationPermission = ({ onRetry }: LocationPermissionProps) => {
    const theme = useTheme()
    const handleOpenSettings = async () => {
        await Linking.openSettings()
    }


    return (
        <YStack
            flex={1}
            backgroundColor={theme.background}
            alignItems="center"
            justifyContent="center"
            padding="$4"
            gap="$4"
        >
            <MapPin size={50} color={theme.btnPrimaryColor.val} />
            <Text
                color="$text"
                fontSize={20}
                textAlign="center"
                style={{
                    fontFamily: "Poppins-Bold"
                }}
            >
                Location Access Required
            </Text>
            <Text
                color="$gray11"
                fontSize={14}
                textAlign="center"
                paddingHorizontal="$4"
            >
                Please enable location services to see available deliveries within 30km of your location
            </Text>
            <YStack gap="$2" width="100%" paddingHorizontal="$6">
                <Button
                    backgroundColor="$btnPrimaryColor"
                    onPress={handleOpenSettings}
                    pressStyle={{ opacity: 0.8 }}
                    borderRadius={50}
                >
                    Open Settings
                </Button>
                <Button
                    backgroundColor="$gray5"
                    onPress={onRetry}
                    pressStyle={{ opacity: 0.8 }}
                    borderRadius={50}
                >
                    Retry
                </Button>
            </YStack>
        </YStack>
    )
}

export default LocationPermission