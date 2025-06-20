import React from 'react';
import { Button, XStack, YStack } from 'tamagui';
import { ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

interface OrderActionsPanelProps {
    deliveryId: string;
    orderId: string;
    riderId?: string;
    showReview?: boolean;
    showReport?: boolean;
    showReceipt?: boolean;
    showConfirm?: boolean;
    confirmLabel?: string;
    onConfirm?: () => void;
    confirmLoading?: boolean;
}

const OrderActionsPanel: React.FC<OrderActionsPanelProps> = ({
    deliveryId,
    orderId,
    riderId,
    showReview = true,
    showReport = true,
    showReceipt = true,
    showConfirm = false,
    confirmLabel = 'Confirm',
    onConfirm,
    confirmLoading = false,
}) => {
    const router = useRouter();

    return (
        <XStack marginTop="$4" gap="$2" width="90%" alignSelf="center" justifyContent="space-between">
            {showReview && (
                <Button
                    size={"$4"}
                    backgroundColor={"$cardDark"}
                    width="32%"
                    textAlign="center"
                    fontSize={12}
                    fontFamily={"$body"}
                    color={"$text"}
                    fontWeight={"500"}
                    pressStyle={{ backgroundColor: "$cardDarkHover" }}
                    onPressIn={() => {
                        router.push({
                            pathname: "/review/[deliveryId]",
                            params: { deliveryId, riderId, orderId },
                        });
                    }}
                >
                    Review
                </Button>
            )}
            {showReport && (
                <Button
                    size={"$4"}
                    backgroundColor={"$cardDark"}
                    width="32%"
                    textAlign="center"
                    fontSize={12}
                    fontFamily={"$body"}
                    color={"$text"}
                    fontWeight={"500"}
                    pressStyle={{ backgroundColor: "$cardDarkHover" }}
                    onPressIn={() => {
                        router.push({
                            pathname: "/report/[deliveryId]",
                            params: { deliveryId },
                        });
                    }}
                >
                    Report
                </Button>
            )}
            {showReceipt && (
                <Button
                    size={"$4"}
                    backgroundColor={"$cardDark"}
                    width="32%"
                    textAlign="center"
                    fontSize={12}
                    fontFamily={"$body"}
                    color={"$text"}
                    fontWeight={"500"}
                    pressStyle={{ backgroundColor: "$cardDarkHover" }}
                    onPressIn={() => {
                        router.push({
                            pathname: "/receipt/[deliveryId]",
                            params: { deliveryId },
                        });
                    }}
                >
                    Receipt
                </Button>
            )}
            {showConfirm && (
                <Button
                    size={"$4"}
                    backgroundColor={"$btnPrimaryColor"}
                    width="100%"
                    textAlign="center"
                    fontSize={14}
                    fontFamily={"$body"}
                    color={"$text"}
                    fontWeight={"600"}
                    pressStyle={{ backgroundColor: "$transparentBtnPrimaryColor" }}
                    onPressIn={onConfirm}
                    disabled={confirmLoading}
                >
                    {confirmLoading ? <ActivityIndicator color="#ccc" /> : confirmLabel}
                </Button>
            )}
        </XStack>
    );
};

export default OrderActionsPanel; 