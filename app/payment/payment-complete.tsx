import { View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { Text, YStack, XStack, useTheme, Card } from "tamagui";
import { Check, X, Download, Home } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";

const PaymentComplete = () => {
    const theme = useTheme();
    const params = useLocalSearchParams();

    useEffect(() => {
        console.log('Payment Complete - Received params:', params);
    }, [params]);

    const paymentStatus = params.paymentStatus as string;
    const txRef = params.txRef as string;
    const transactionId = params.transactionId as string;

    const isSuccess = paymentStatus === 'success';

    return (
        <YStack
            flex={1}
            backgroundColor={theme.background}
            alignItems="center"
            justifyContent="center"
        >
            {/* Status Icon */}
            <View style={styles.iconContainer}>
                {isSuccess ? (
                    <Check color="white" size={40} />
                ) : (
                    <X color="white" size={40} />
                )}
            </View>

            {/* Status text */}
            <YStack gap={6} alignItems="center" marginTop="$10">
                <Text
                    color="$text"
                    fontSize={28}
                    fontWeight="900"
                    style={{
                        fontFamily: 'Poppins-Bold'
                    }}
                >
                    {isSuccess ? "Payment Successful!" : "Payment Failed"}
                </Text>
                <Text
                    color="$gray11"
                    fontSize={16}
                    textAlign="center"
                    paddingHorizontal="$6"
                    lineHeight={24}
                >
                    {isSuccess
                        ? "Great! Your payment has been processed successfully."
                        : "Oops! There was an error processing your payment. Please try again."}
                </Text>
            </YStack>

            {/* Action buttons */}
            <XStack gap={16} marginTop="$10" alignItems="center">
                {isSuccess && (
                    <TouchableOpacity onPressIn={() => {

                        router.push({
                            pathname: "/receipt/[deliveryId]",
                            params: { deliveryId: txRef }
                        });
                    }}>
                        <Card
                            bordered
                            padding="$4"
                            height={120}
                            width={120}
                            alignItems="center"
                            justifyContent="center"
                            elevation={2}
                            shadowColor="$shadowColor"
                            shadowOffset={{ width: 0, height: 2 }}
                            shadowOpacity={0.25}
                            shadowRadius={3.84}
                            backgroundColor="$cardBackground"
                        >
                            <Download color={theme.btnPrimaryColor.val} size={35} />
                            <Text
                                color="$text"
                                fontSize={13}
                                textAlign="center"
                                marginTop="$2"
                                style={{ fontFamily: 'Poppins-Medium' }}
                            >
                                Download Receipt
                            </Text>
                        </Card>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    onPressIn={() => {

                        router.replace({ pathname: "/delivery" });
                    }}
                >
                    <Card
                        bordered
                        padding="$4"
                        height={120}
                        width={120}
                        alignItems="center"
                        justifyContent="center"
                        elevation={2}
                        shadowColor="$shadowColor"
                        shadowOffset={{ width: 0, height: 2 }}
                        shadowOpacity={0.25}
                        shadowRadius={3.84}
                        backgroundColor="$cardBackground"
                    >
                        <Home color={theme.btnPrimaryColor.val} size={35} />
                        <Text
                            color="$text"
                            fontSize={13}
                            textAlign="center"
                            marginTop="$2"
                            style={{ fontFamily: 'Poppins-Medium' }}
                        >
                            Back to Home
                        </Text>
                    </Card>
                </TouchableOpacity>
            </XStack>
        </YStack>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: "center",
        justifyContent: "center",
    },
});

export default PaymentComplete;