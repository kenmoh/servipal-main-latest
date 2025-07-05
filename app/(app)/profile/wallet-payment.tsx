import React from "react";
import { YStack, XStack, Text, Card, Button, useTheme } from "tamagui";
import { useLocalSearchParams, router } from "expo-router";
import { CreditCard, ArrowLeftRight } from "lucide-react-native";
import { FundWalletReturn } from "@/api/payment";

const WalletPayment = () => {
    const theme = useTheme();
    const { fundWalletData } = useLocalSearchParams();
    const fundWallet: FundWalletReturn = fundWalletData ? JSON.parse(fundWalletData as string) : null;


    const handleCardPayment = () => {
        // Placeholder: Implement card payment logic
        alert("Card payment pressed");
    };
    const handleTransfer = () => {
        // Placeholder: Implement transfer logic
        alert("Transfer pressed");
    };

    return (
        <YStack flex={1} backgroundColor={theme.background.val} padding="$4" gap={40} alignItems="center" justifyContent="center">
            <Card bordered borderRadius={15} backgroundColor="$cardDark" padding="$3" width="100%" maxWidth={400}>
                <YStack gap={10} alignItems="center">
                    <Text fontSize={18} color="$gray11">Amount to Pay</Text>
                    <Text fontSize={32} fontWeight="700" color="$text">₦{Number(fundWallet?.amount).toLocaleString()}</Text>
                </YStack>
            </Card>
            <YStack width="100%" maxWidth={400} gap={16}>
                <Button
                    backgroundColor="$btnPrimaryColor"
                    size="$5"
                    pressStyle={{ opacity: 0.8 }}
                    onPress={handleCardPayment}
                    fontSize={18}
                >
                    <CreditCard size={20} color={theme.text.val} />
                    Card
                </Button>
                <Button
                    backgroundColor="$cardDark"
                    size="$5"
                    pressStyle={{ opacity: 0.8 }}
                    onPress={handleTransfer}
                    borderWidth='$0.5'
                    borderColor={'$borderColor'}
                    fontSize={18}
                >
                    <ArrowLeftRight size={20} color={theme.text.val} />
                    Transfer
                </Button>
            </YStack>
        </YStack>
    );
};

export default WalletPayment; 