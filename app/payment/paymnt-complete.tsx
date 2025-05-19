import { View, StyleSheet, Animated, Easing } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Text, YStack, Button, XStack, useTheme } from 'tamagui'
import { Check, X, Download, Home } from 'lucide-react-native'
import { router, useLocalSearchParams } from 'expo-router'

const PaymentComplete = () => {
    const theme = useTheme()
    const { status } = useLocalSearchParams()
    const isSuccess = status === 'success'

    // Animation values
    const scaleAnim = useRef(new Animated.Value(0)).current
    const opacityAnim = useRef(new Animated.Value(1)).current

    useEffect(() => {
        // Scale animation
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 400,
                easing: Easing.bezier(0.4, 0.0, 0.2, 1),
                useNativeDriver: true,
            }),
            // Ripple effect
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 2,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]),
        ]).start()
    }, [])

    return (
        <YStack flex={1} backgroundColor={theme.background} alignItems="center" justifyContent="center">
            {/* Animated ripple effect */}
            <View style={styles.animationContainer}>
                <Animated.View
                    style={[
                        styles.circle,
                        {
                            backgroundColor: isSuccess ? theme.green10.val : theme.red10.val,
                            opacity: opacityAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                />
            </View>

            {/* Icon */}
            <View
                style={[
                    styles.iconContainer,
                    {
                        backgroundColor: isSuccess ? theme.green10.val : theme.red10.val,
                    },
                ]}
            >
                {isSuccess ? (
                    <Check size={32} color={theme.text.val} />
                ) : (
                    <X size={32} color={theme.text.val} />
                )}
            </View>

            {/* Status text */}
            <YStack gap={6} alignItems="center" marginTop="$6">
                <Text
                    color="$text"
                    fontSize={24}
                    fontWeight="600"
                >
                    {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
                </Text>
                <Text
                    color="$gray11"
                    fontSize={16}
                    textAlign="center"
                    paddingHorizontal="$4"
                >
                    {isSuccess
                        ? 'Your payment has been processed successfully.'
                        : 'There was an error processing your payment. Please try again.'}
                </Text>
            </YStack>

            {/* Action buttons */}
            <YStack gap={10} marginTop="$8" width="90%">
                {isSuccess && (
                    <Button
                        icon={Download}
                        backgroundColor="$cardDark"
                        color="$text"
                        size="$5"
                        onPress={() => {/* Handle download */ }}
                    >
                        Download Receipt
                    </Button>
                )}

                <Button
                    icon={Home}
                    backgroundColor="$btnPrimaryColor"
                    color="$text"
                    size="$5"
                    onPress={() => router.replace('/(app)')}
                >
                    Back to Home
                </Button>
            </YStack>
        </YStack>
    )
}

const styles = StyleSheet.create({
    animationContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
})

export default PaymentComplete