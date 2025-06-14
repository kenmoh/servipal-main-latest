
import React from 'react'
import { Button, Text, useTheme, YStack } from 'tamagui';
import { RefreshCcw } from 'lucide-react-native';

const RefreshButton = ({ onPress, label }: { label: string, onPress: () => void }) => {
    const theme = useTheme()
    return (
        <YStack
            flex={1}
            backgroundColor={theme.background}
            alignItems="center"
            justifyContent="center"
            gap="$4"
        >
            <Text color="$red10" fontSize={16}>
                {label}
            </Text>
            <Button
                borderRadius={50}
                backgroundColor="$btnPrimaryColor"
                color="$text"
                size="$4"
                onPress={onPress}
                pressStyle={{ opacity: 0.8 }}
            >
                <RefreshCcw color={theme.text.val} size={20} />
                Try Again
            </Button>
        </YStack>
    );
}

export default RefreshButton
