import React, { useEffect, useState } from "react";
import { YStack, XStack, Text, Card, Button, useTheme, View } from "tamagui";
import { useLocalSearchParams, router } from "expo-router";
import { CreditCard, ArrowLeftRight } from "lucide-react-native";
import { FundWalletReturn } from "@/api/payment";
import WebView from "react-native-webview";
import { Dimensions, StyleSheet } from "react-native";

const WalletPayment = () => {
    const theme = useTheme();
    const { fundWalletData } = useLocalSearchParams();
    const fundWallet: FundWalletReturn = fundWalletData ? JSON.parse(fundWalletData as string) : null;

    const [showWebView, setShowWebView] = React.useState(false);
    const [redirectedUrl, setRedirectedUrl] = useState<{ url?: string } | null>(
        null
    );
    const status = redirectedUrl?.url
        ? redirectedUrl?.url?.split("?")[1]?.split("&")
        : null;

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

    const handleMakePayment = () => {
        if (!fundWallet.payment_link) {
            alert("No payment link available");
            return;
        }
        setShowWebView(true);
    };

    if (showWebView && fundWallet.payment_link) {
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
                        {<CreditCard color={'white'} />}
                        P A Y {fundWallet.amount}
                    </Button>
                </YStack>
                <WebView
                    style={styles.webview}
                    onNavigationStateChange={setRedirectedUrl}
                    source={{
                        uri: Array.isArray(fundWallet.payment_link)
                            ? fundWallet.payment_link[0]
                            : (fundWallet.payment_link as string),
                    }}
                />
            </View>
        );
    }



    return (
        <YStack flex={1} backgroundColor={theme.background.val} padding="$6" gap={30} alignItems="center" justifyContent="center">
            <Card bordered borderRadius={15} backgroundColor="$cardDark" padding="$6" width="100%" maxWidth={400}>
                <YStack gap={10} alignItems="center">
                    <Text fontSize={18} color="$gray11">Amount to Pay </Text>
                    <Text fontSize={32} fontWeight="700" color="$text">₦{Number(fundWallet?.amount).toLocaleString()}</Text>
                </YStack>
            </Card>
            <YStack width="100%" maxWidth={400} gap={16}>
                <Button
                    backgroundColor="$btnPrimaryColor"
                    size="$5"
                    pressStyle={{ opacity: 0.8 }}
                    onPress={handleMakePayment}
                    fontSize={18}
                >
                    <CreditCard size={20} color={theme.text.val} />
                    Card
                </Button>

            </YStack>
        </YStack>
    );
};




const styles = StyleSheet.create({

    webview: {
        flex: 1,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
});


export default WalletPayment; 