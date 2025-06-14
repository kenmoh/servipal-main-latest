import { StyleSheet } from "react-native";
import React from "react";
import { View, YStack, Text, XStack, Card, Paragraph } from "tamagui";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchDelivery } from "@/api/order";
import LoadingIndicator from "@/components/LoadingIndicator";
import { format } from "date-fns";

const ReceiptPage = () => {
    const { deliveryId } = useLocalSearchParams();

    const { data, isLoading } = useQuery({
        queryKey: ["delivery", deliveryId],
        queryFn: () => fetchDelivery(deliveryId as string),
    });

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <View backgroundColor={"$background"} flex={1} padding="$4">
            <YStack gap="$4">
                <Text fontSize={20} fontWeight="bold" textAlign="center">Receipt</Text>

                <Card padding="$4" backgroundColor={"$cardBackground"}>
                    <YStack gap="$3">
                        <XStack justifyContent="space-between">
                            <Text>Order Number</Text>
                            <Text fontWeight="bold">#{data?.order?.order_number}</Text>
                        </XStack>

                        <XStack justifyContent="space-between">
                            <Text>Date</Text>
                            <Text>{format(new Date(data?.delivery?.created_at || ""), "PPP")}</Text>
                        </XStack>

                        <XStack justifyContent="space-between">
                            <Text>Delivery Fee</Text>
                            <Text>₦{Number(data?.delivery?.delivery_fee).toFixed(2)}</Text>
                        </XStack>

                        <XStack justifyContent="space-between">
                            <Text>Total Amount</Text>
                            <Text fontWeight="bold">₦{Number(data?.order?.total_price).toFixed(2)}</Text>
                        </XStack>

                        <XStack justifyContent="space-between">
                            <Text>Payment Status</Text>
                            <Text color={data?.order?.order_payment_status === "paid" ? "green" : "red"}>
                                {data?.order?.order_payment_status?.toUpperCase()}
                            </Text>
                        </XStack>
                    </YStack>
                </Card>

                <Card padding="$4" backgroundColor={"$cardBackground"}>
                    <YStack gap="$3">
                        <Text fontWeight="bold">Delivery Details</Text>

                        <XStack justifyContent="space-between">
                            <Text>From</Text>
                            <Text>{data?.delivery?.origin}</Text>
                        </XStack>

                        <XStack justifyContent="space-between">
                            <Text>To</Text>
                            <Text>{data?.delivery?.destination}</Text>
                        </XStack>

                        <XStack justifyContent="space-between">
                            <Text>Status</Text>
                            <Text>{data?.delivery?.delivery_status?.toUpperCase()}</Text>
                        </XStack>
                    </YStack>
                </Card>
            </YStack>
        </View>
    );
};

export default ReceiptPage; 