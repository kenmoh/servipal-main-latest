import { StyleSheet, Dimensions, View, Pressable } from 'react-native'
import React from 'react'
import { Text, useTheme, YStack, XStack, Avatar, Button } from 'tamagui'
import { router, useLocalSearchParams } from 'expo-router'
import { Mail, Phone, MapPin, Bike } from 'lucide-react-native'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.70

const Modal = () => {
    const theme = useTheme()
    const { name, phone } = useLocalSearchParams()

    const handleContentPress = (e: any) => {
        e.stopPropagation();
    }
    return (
        <Pressable style={styles.pressable} onPress={() => router.back()}>
            <View style={[styles.container, { backgroundColor: theme.background.val }]}>
                <YStack gap={20} onPress={handleContentPress}>
                    {/* Profile Header */}
                    <YStack alignItems="center" gap={10}>
                        <Avatar circular size="$12">
                            <Avatar.Image src="https://placekitten.com/200/200" />
                            <Avatar.Fallback backgroundColor="$blue10" />
                        </Avatar>

                        <YStack alignItems="center" gap={4}>
                            <Text color="$text" fontSize={20} fontWeight="600">{name}</Text>
                            <Text color="$gray11" fontSize={14}>Customer</Text>
                        </YStack>
                    </YStack>

                    {/* Contact Info */}
                    <YStack backgroundColor="$cardDark" padding={15} borderRadius={5} gap={15}>
                        <XStack alignItems="center" gap={10}>
                            <Mail size={20} color={theme.gray11.val} />
                            <Text color="$text" fontSize={14}>johndoe@example.com</Text>
                        </XStack>
                        <XStack alignItems="center" gap={10}>
                            <Phone size={20} color={theme.gray11.val} />
                            <Text color="$text" fontSize={14}>+{phone}</Text>
                        </XStack>
                        <XStack alignItems="center" gap={10}>
                            <MapPin size={20} color={theme.gray11.val} />
                            <Text color="$text" fontSize={14}>Lagos, Nigeria</Text>
                        </XStack>
                        <XStack alignItems="center" gap={10}>
                            <Bike size={20} color={theme.gray11.val} />
                            <Text color="$text" fontSize={14}>LG123</Text>
                        </XStack>
                    </YStack>

                    {/* Call and Report Button */}
                    <XStack gap={5}>
                        <Button
                            backgroundColor="$btnPrimaryColor"
                            color="white"
                            icon={Phone}
                            size="$4"
                            width={'50%'}
                        >
                            Call
                        </Button>
                        <Button
                            // backgroundColor="$ghost1"
                            color="white"
                            bordered
                            borderColor={'$borderColor'}

                            size="$4"
                            width={'50%'}
                        >
                            Report
                        </Button>
                    </XStack>
                </YStack>
            </View>
        </Pressable>
    )
}

export default Modal

// ...existing styles...

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    pressable: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
    },
    container: {

        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: MODAL_HEIGHT,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
    }
})