import {
    View,
    StyleSheet,
    Animated,
    Easing,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { Text, YStack, Button, XStack, useTheme, Square, Card } from "tamagui";
import { Check, X, Download, Home } from "lucide-react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";

const PaymentComplete = () => {
    const theme = useTheme();
    const { paymentStatus } = useLocalSearchParams();

    // Animation values
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Create infinite ripple animation
        const createRipple = () => {
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 2,
                        duration: 1500,
                        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(opacityAnim, {
                        toValue: 0,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 1,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start(() => createRipple());
        };

        createRipple();
    }, []);
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: `${paymentStatus ? "Payment Successful" : "Payment Failed"}`,
                    headerTintColor:
                        paymentStatus === "success" ? theme.green10.val : theme.red10.val,
                }}
            />
            <YStack
                flex={1}
                backgroundColor={theme.background}
                alignItems="center"
                justifyContent="center"
            >
                {/* Animated ripple effect */}

                <Animated.View
                    style={[
                        styles.circle,
                        {
                            backgroundColor:
                                paymentStatus === "success"
                                    ? theme.green10.val
                                    : theme.red10.val,
                            opacity: opacityAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                />

                {/* Status text */}
                <YStack gap={6} alignItems="center" marginTop="$10">
                    <Text color="$text" fontSize={24} fontWeight="600">
                        {paymentStatus ? "Payment Successful!" : "Payment Failed"}
                    </Text>
                    <Text
                        color="$gray11"
                        fontSize={16}
                        textAlign="center"
                        paddingHorizontal="$4"
                    >
                        {paymentStatus
                            ? "Your payment has been processed successfully."
                            : "There was an error processing your payment. Please try again."}
                    </Text>
                </YStack>

                {/* Action buttons */}
                <XStack gap={10} marginTop="$8" alignItems="center">
                    {paymentStatus && (
                        <TouchableOpacity>
                            <Card
                                bordered
                                padding="$2"
                                height={100}
                                width={100}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Download color={theme.icon.val} size={30} />
                                <Text color={theme.icon.val} fontSize={11} textAlign="center">
                                    Receipt
                                </Text>
                            </Card>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        onPress={() => router.push({ pathname: "/delivery" })}
                    >
                        <Card
                            bordered
                            padding="$2"
                            height={100}
                            width={100}
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Home color={theme.icon.val} size={30} />
                            <Text color={theme.icon.val} fontSize={11} textAlign="center">
                                Go Home
                            </Text>
                        </Card>
                    </TouchableOpacity>
                </XStack>
            </YStack>
        </>
    );
};

const styles = StyleSheet.create({

    circle: {
        width: 100,
        height: 100,
        borderRadius: 100,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
});

export default PaymentComplete;
