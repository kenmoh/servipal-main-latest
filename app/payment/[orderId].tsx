import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet } from 'react-native'
import { WebView } from "react-native-webview";
import { YStack, XStack, Text, Card, Button, View, useTheme } from 'tamagui'
import { router, useLocalSearchParams } from 'expo-router'
import { Notifier, NotifierComponents } from "react-native-notifier";
import { Package, Shirt, CreditCard, Utensils, Wallet, ArrowLeftRight } from 'lucide-react-native'
import { OrderItemResponse } from '@/types/order-types';
import { queryClient } from '../_layout';
import { useAuth } from '@/context/authContext';
import { useMutation } from '@tanstack/react-query';
import { FundWalletReturn, payWithBankTransfer, payWithWallet } from '@/api/payment';


const Payment = () => {
    const { orderNumber, deliveryType, orderId, deliveryId, paymentLink, deliveryFee, orderType, orderItems
    } = useLocalSearchParams()
    const theme = useTheme()
    const { user } = useAuth()
    const [showWebView, setShowWebView] = useState(false);
    const [redirectedUrl, setRedirectedUrl] = useState<{ url?: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const status = redirectedUrl?.url ? redirectedUrl?.url?.split("?")[1]?.split("&") : null;

    // Parse the stringified orderItems back to an array
    const parsedOrderItems: OrderItemResponse[] = orderItems ? JSON.parse(orderItems as string) : []

    const handleOpenWebView = () => {
        if (!paymentLink) {
            return;
        }
        setShowWebView(true);

    };


    const { mutate, data } = useMutation({
        mutationFn: () => payWithBankTransfer(orderId as string),
        onSuccess: (data) => {

            router.replace({
                pathname: "/payment/transfer-detail",
                params: { data: JSON.stringify(data) }
            });

            Notifier.showNotification({
                title: "Bank Details",
                description: "Please make a transfer to the account details provided.",
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "info" },
            });
        },
        onError: (error) => {
            Notifier.showNotification({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to initiate bank transfer.",
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "error" },
            });
        }
    })
    const { mutate: payWithWalletMutation, isPending } = useMutation({
        mutationFn: () => payWithWallet(orderId as string),
        onSuccess: () => {
            router.replace({
                pathname: "/payment/payment-complete",
                params: { paymentStatus: 'success' }
            });

            queryClient.invalidateQueries({
                queryKey: ["delivery", deliveryId],
            });
            queryClient.invalidateQueries({
                queryKey: ["delivery", orderId],
            });

            queryClient.invalidateQueries({
                queryKey: ["deliveries"],
            });

            queryClient.invalidateQueries({
                queryKey: ["deliveries", user?.sub],
            });

            queryClient.refetchQueries({ queryKey: ["deliveries"], exact: false });
            queryClient.refetchQueries({ queryKey: ["deliveries", user?.sub], exact: false });

            Notifier.showNotification({
                title: "Bank Details",
                description: "Payment successful! Your wallet has been charged.",
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "success" },
            });
        },
        onError: (error) => {
            router.replace({
                pathname: "/payment/payment-complete",
                params: { paymentStatus: 'failed' }
            });

            Notifier.showNotification({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to initiate bank transfer.",
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "error" },
            });
        }
    })


    // function to calculate total
    const calculateTotal = () => {
        const itemsTotal = parsedOrderItems.reduce((sum, item) => {
            return sum + (Number(item.price) * Number(item.quantity))
        }, 0);

        return deliveryFee ? Number(deliveryFee) + itemsTotal : itemsTotal;
    };


    useEffect(() => {
        if (!status) return;

        // Add paymentStatus to the redirect
        if (status[0] === "status=successful") {
            router.replace({
                pathname: "/payment/payment-complete",
                params: { paymentStatus: 'success' }
            });

            queryClient.invalidateQueries({
                queryKey: ["delivery", deliveryId],
            });
            queryClient.invalidateQueries({
                queryKey: ["delivery", orderId],
            });

            queryClient.invalidateQueries({
                queryKey: ["deliveries"],
            });

            queryClient.invalidateQueries({
                queryKey: ["deliveries", user?.sub],
            });

            queryClient.refetchQueries({ queryKey: ["deliveries"], exact: false });
            queryClient.refetchQueries({ queryKey: ["deliveries", user?.sub], exact: false });


        }
        if (status[0] === "status=failed" || status[0] === "status=cancelled") {
            router.replace({
                pathname: "/payment/payment-complete",
                params: { paymentStatus: 'failed' }
            });
        }
    }, [status]);

    const renderIcon = () => {
        switch (deliveryType) {
            case 'food':
                return <Utensils size={24} color={theme.orange10.val} />
            case 'laundry':
                return <Shirt size={24} color={theme.blue10.val} />
            default:
                return <Package size={24} color={theme.green10.val} />
        }
    }


    const renderWebView = () => (
        <View style={[styles.webviewContainer, { backgroundColor: theme.background.val }]}>
            <YStack padding="$4">
                <XStack alignItems="center" gap={10}>
                    {renderIcon()}
                    <Text fontSize={20} fontWeight="600" color="$text">
                        Processing Payment
                    </Text>
                </XStack>
            </YStack>


            <WebView
                style={styles.webview}
                source={{ uri: Array.isArray(paymentLink) ? paymentLink[0] : paymentLink as string }}
                onNavigationStateChange={setRedirectedUrl}
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={() => setIsLoading(false)}
            />

        </View>
    )



    if (showWebView) {
        return renderWebView()
    }
    const renderOrderItems = () => {
        if (deliveryType === 'package') {
            return (
                <Card
                    bordered
                    borderRadius={'$5'}
                    backgroundColor="$cardDark"
                    padding="$4"
                    marginTop="$4"
                >
                    <XStack justifyContent="space-between" alignItems="center">
                        <Text fontSize={16} color="$gray11">Total Amount</Text>
                        <Text fontSize={18} fontWeight="600" color="$text">
                            ₦{Number(deliveryFee).toFixed(2)}
                        </Text>
                    </XStack>
                </Card>
            )
        }


        return (

            <View flex={1} alignItems='center' justifyContent='center' backgroundColor={'$background'}>
                {showWebView ? renderWebView() : (
                    <Card
                        bordered
                        borderRadius={'$5'}
                        backgroundColor="$cardDark"
                        padding="$4"
                        marginTop="$4"
                        width={'100%'}
                    >

                        <View
                            backgroundColor="$gray8"
                            height={1}
                            marginVertical="$3"
                        />
                        {/* Add subtotal */}
                        {orderType !== 'package' && <XStack justifyContent="space-between" marginBottom="$2">
                            <Text fontSize={14} color="$gray11">Subtotal</Text>
                            <Text fontSize={14} color="$text">
                                ₦{parsedOrderItems.reduce((sum, item) =>
                                    sum + (Number(item.price) * Number(item.quantity)), 0).toFixed(2)}
                            </Text>
                        </XStack>}
                        {/* Add delivery fee */}
                        {deliveryFee && <XStack justifyContent="space-between" marginBottom="$2">
                            <Text fontSize={14} color="$gray11">Delivery Fee</Text>
                            <Text fontSize={14} color="$text">
                                ₦{Number(deliveryFee).toFixed(2)}
                            </Text>
                        </XStack>}
                        {/* Total */}
                        <View backgroundColor="$gray8" height={1} marginVertical="$3" />
                        <XStack justifyContent="space-between">
                            <Text fontSize={16} color="$text">Total</Text>
                            <Text fontSize={16} fontWeight="600" color="$text">
                                ₦{calculateTotal().toFixed(2)}
                            </Text>
                        </XStack>
                    </Card>
                )}
            </View>
        )
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: theme.background.val }}>
            <YStack padding="$4" gap={15}>
                {/* Header */}
                <XStack alignItems="center" gap={10}>
                    {renderIcon()}
                    <Text fontSize={20} fontWeight="600" color="$text">
                        Payment Details
                    </Text>
                </XStack>

                {/* Order Summary */}
                <Card
                    bordered
                    borderRadius={15}
                    backgroundColor="$cardDark"
                    padding="$4"
                >
                    <YStack gap={10}>
                        <Text fontSize={16} color="$gray11">ORDER #: {orderNumber} </Text>
                        <Text fontSize={14} color="$gray11"> Order Type:
                            {" "} {`${orderType}`.toUpperCase()}
                        </Text>
                    </YStack>
                </Card>

                {/* Order Items or Package Amount */}
                {renderOrderItems()}

                {/* Payment Button */}
                <YStack marginTop='$6'>
                    <Text color={'$text'} fontSize={'$3'}>Pay with:</Text>

                    <Button
                        backgroundColor="$btnPrimaryColor"
                        size="$5"
                        marginTop="$4"
                        pressStyle={{ opacity: 0.8 }}
                        onPress={handleOpenWebView}
                        fontSize={'$2'}

                    >
                        <CreditCard size={20} color={theme.text.val} />
                        Card
                    </Button>
                    <XStack gap='$2'>
                        <Button
                            backgroundColor="$cardDark"
                            size="$5"
                            marginTop="$4"
                            pressStyle={{ opacity: 0.8 }}
                            onPress={() => payWithWalletMutation()}
                            borderWidth='$0.5'
                            borderColor={'$borderColor'}
                            fontSize={'$2'}
                            width={'50%'}



                        >
                            {isPending ? <ActivityIndicator size="small" color={theme.text.val} /> : <Wallet size={20} color={theme.text.val} />}
                            {!isPending && 'Wallet'}
                        </Button>
                        <Button
                            backgroundColor="$cardDark"
                            size="$5"
                            marginTop="$4"
                            pressStyle={{ opacity: 0.8 }}
                            onPress={() => mutate()}
                            borderWidth='$0.5'
                            borderColor={'$borderColor'}
                            fontSize={'$2'}
                            width={'50%'}

                        >
                            <ArrowLeftRight size={20} color={theme.text.val} />
                            Transfer
                        </Button>
                    </XStack>
                </YStack>
            </YStack>
        </ScrollView>
    )
}

export default Payment

const styles = StyleSheet.create({
    webviewContainer: {
        flex: 1,
        backgroundColor: '$background',
    },
    webview: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,

    }
})
