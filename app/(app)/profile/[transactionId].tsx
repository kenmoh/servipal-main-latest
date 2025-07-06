import React, { useEffect, useState } from "react";
import { YStack, Text, Card, Button, useTheme, View, XStack } from "tamagui";
import { router, useLocalSearchParams } from "expo-router";
import { WebView } from "react-native-webview";
import { StyleSheet, Dimensions } from "react-native";
import { CreditCard } from "lucide-react-native";

const TransactionDetails = () => {
    const theme = useTheme();
    const {
        amount,
        date,
        status: paymentStatus,
        transactionId,
        paymentBy,
        id,
        transactionType,
        paymentLink,
        data
    } = useLocalSearchParams();
    const [showWebView, setShowWebView] = React.useState(false);
    const [redirectedUrl, setRedirectedUrl] = useState<{ url?: string } | null>(
        null
    );
    const status = redirectedUrl?.url
        ? redirectedUrl?.url?.split("?")[1]?.split("&")
        : null;

    const handleMakePayment = () => {
        if (!paymentLink) {
            alert("No payment link available");
            return;
        }
        setShowWebView(true);
    };

    const statusString = Array.isArray(paymentStatus) ? paymentStatus[0] : paymentStatus;

    useEffect(() => {
        if (!status) return;

        // Add status to the redirect
        if (status[0] === "status=successful") {
            router.replace({
                pathname: "/payment/payment-complete",
                params: { status: "success" },
            });
        }
        if (
            status[0] === "status=failed" ||
            status[0] === "status=cancelled"
        ) {
            router.replace({
                pathname: "/payment/payment-complete",
                params: { status: "failed" },
            });
        }
    }, [status]);

    if (showWebView && paymentLink) {
        return (
            <View flex={1}>
                <YStack padding="$4">
                    <Text fontSize={20} fontWeight="600" color="$text">
                        Complete Payment
                    </Text>
                    <Button
                        marginTop={10}
                        onPress={() => setShowWebView(false)}
                        backgroundColor="$cardDark"
                        color="$text"
                    >
                        Close
                    </Button>
                </YStack>
                <WebView
                    style={styles.webview}
                    onNavigationStateChange={setRedirectedUrl}
                    source={{
                        uri: Array.isArray(paymentLink)
                            ? paymentLink[0]
                            : (paymentLink as string),
                    }}
                />
            </View>
        );
    }

    return (
        <YStack
            flex={1}
            backgroundColor={theme.background.val}
            padding="$3"
            gap={50}
        >
            <Card
                bordered
                borderRadius={15}
                backgroundColor="$cardDark"
                padding="$3"
                width="100%"
                maxWidth={400}
            >
                <YStack gap={20}>
                    <Text fontSize={18} color="$gray11">
                        Transaction Details
                    </Text>
                    <XStack alignItems="center" justifyContent="space-between">
                        <Text fontSize={16} color="$gray11">
                            Amount:
                        </Text>
                        <Text fontSize={24} fontWeight="700" color="$text">
                            ₦{Number(amount).toLocaleString()}
                        </Text>
                    </XStack>
                    <XStack alignItems="center" justifyContent="space-between">
                        <Text fontSize={16} color="$gray11">
                            Date:
                        </Text>
                        <Text fontSize={16} color="$text">
                            {date}
                        </Text>
                    </XStack>
                    <XStack alignItems="center" justifyContent="space-between">
                        <Text fontSize={16} color="$gray11">
                            Status:
                        </Text>
                        <Text
                            fontSize={16}
                            color={statusString === "pending" ? "$red10" : "$green10"}
                        >
                            {statusString?.toUpperCase()}
                        </Text>
                    </XStack>
                </YStack>
                <YStack gap={20} marginTop={16}>
                    <Text fontSize={16} color="$gray11">
                        Transaction ID:
                    </Text>
                    <Text fontSize={16} color="$text">
                        {id || transactionId}
                    </Text>
                    {paymentBy && (
                        <XStack alignItems="center" justifyContent="space-between">
                            <Text fontSize={16} color="$gray11">
                                Payment By:
                            </Text>
                            <Text fontSize={16} color="$text">
                                {paymentBy}
                            </Text>
                        </XStack>
                    )}

                    <XStack alignItems="center" justifyContent="space-between">
                        <Text fontSize={16} color="$gray11">
                            Transaction Type:
                        </Text>
                        <Text fontSize={16} color="$text">
                            {transactionType}
                        </Text>
                    </XStack>
                </YStack>
            </Card>
            {paymentStatus === "pending" && (
                <Button
                    backgroundColor="$btnPrimaryColor"
                    size="$4"
                    pressStyle={{ opacity: 0.8 }}
                    onPress={handleMakePayment}
                    fontSize={18}
                    alignSelf="center"
                    width="97%"
                    maxWidth={400}
                >
                    <CreditCard color={"white"} />
                    Make Payment
                </Button>
            )}
        </YStack>
    );
};

const styles = StyleSheet.create({
    webviewContainer: {
        flex: 1,
        backgroundColor: "$background",
    },
    webview: {
        flex: 1,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
});

export default TransactionDetails;
