import React, { useEffect, useState } from 'react'
import { Dimensions, ScrollView, StyleSheet } from 'react-native'
import { WebView } from "react-native-webview";
import { YStack, XStack, Text, Card, Button, View, useTheme } from 'tamagui'
import { router, useLocalSearchParams } from 'expo-router'
import { Package, Shirt, CreditCard, Utensils } from 'lucide-react-native'
import { OrderItemResponse } from '@/types/order-types';


const Payment = () => {
    const { orderNumber, deliveryType, paymentLink, deliveryFee, orderItems
    } = useLocalSearchParams()
    const theme = useTheme()
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

    // function to calculate total
    const calculateTotal = () => {
        const itemsTotal = parsedOrderItems.reduce((sum, item) => {
            return sum + (Number(item.price) * Number(item.quantity))
        }, 0);

        return Number(deliveryFee) + itemsTotal;
    };


    useEffect(() => {
        if (!status) return;

        // Add paymentStatus to the redirect
        if (status[0] === "status=successful") {
            router.replace({
                pathname: "/payment/payment-complete",
                params: { paymentStatus: 'success' }
            });
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
                        {parsedOrderItems.map((item) => (
                            <YStack
                                flex={1}
                                key={item.id}
                                justifyContent="space-between"
                                marginBottom="$3"
                            >
                                <XStack width={'100%'} alignItems='center' justifyContent='space-between'>
                                    <XStack gap={4} alignItems="center">
                                        <Text fontSize={12} color="$text">{item.quantity} X </Text>
                                        <Text fontSize={12} color="$text">{item.name}</Text>
                                    </XStack>
                                    <Text fontSize={12} fontWeight="500" color="$text">
                                        ₦{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                                    </Text>
                                </XStack>
                            </YStack>
                        ))}
                        <View
                            backgroundColor="$gray8"
                            height={1}
                            marginVertical="$3"
                        />
                        {/* Add subtotal */}
                        <XStack justifyContent="space-between" marginBottom="$2">
                            <Text fontSize={14} color="$gray11">Subtotal</Text>
                            <Text fontSize={14} color="$text">
                                ₦{parsedOrderItems.reduce((sum, item) =>
                                    sum + (Number(item.price) * Number(item.quantity)), 0).toFixed(2)}
                            </Text>
                        </XStack>
                        {/* Add delivery fee */}
                        <XStack justifyContent="space-between" marginBottom="$2">
                            <Text fontSize={14} color="$gray11">Delivery Fee</Text>
                            <Text fontSize={14} color="$text">
                                ₦{Number(deliveryFee).toFixed(2)}
                            </Text>
                        </XStack>
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
                        <Text fontSize={16} color="$gray11">ORD #: {orderNumber} </Text>
                        <Text fontSize={14} color="$gray11"> Order Type:
                            {" "} {`${deliveryType}`.toUpperCase()}
                        </Text>
                    </YStack>
                </Card>

                {/* Order Items or Package Amount */}
                {renderOrderItems()}

                {/* Payment Button */}
                <Button
                    backgroundColor="$btnPrimaryColor"
                    size="$5"
                    marginTop="$4"
                    pressStyle={{ opacity: 0.8 }}
                    onPress={handleOpenWebView}
                >
                    <CreditCard size={20} color={theme.text.val} />
                    Pay Now
                </Button>
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
