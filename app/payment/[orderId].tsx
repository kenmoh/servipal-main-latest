import React, { useEffect, useState } from 'react'
import { Dimensions, ScrollView, StyleSheet } from 'react-native'
import { WebView } from "react-native-webview";
import { Notifier, NotifierComponents } from 'react-native-notifier';
import { YStack, XStack, Text, Card, Button, View, useTheme } from 'tamagui'
import { router, useLocalSearchParams } from 'expo-router'
import { Package, Shirt, CreditCard, Utensils } from 'lucide-react-native'
import { OrderItemResponse } from '@/types/order-types';
import LoadingIndicator from '@/components/LoadingIndicator';

const Payment = () => {
    const { orderId, deliveryType, paymentLink, deliveryFee, orderItems } = useLocalSearchParams()
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

    // const renderWebView = () => (
    //     <View style={[styles.webviewContainer, { backgroundColor: theme.background.val }]}>
    //         <WebView
    //             style={styles.webview}
    //             source={{ uri: Array.isArray(paymentLink) ? paymentLink[0] : paymentLink as string }}
    //             onNavigationStateChange={setRedirectedUrl}
    //             onLoadStart={() => setIsLoading(true)}
    //             onLoadEnd={() => setIsLoading(false)}
    //         />
    //         {isLoading && <LoadingIndicator />}
    //     </View>
    // )

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
                    borderRadius={15}
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

                {/* <CustomActivityIndicator visible={isPending || isLoading} /> */}
                {/* <LoadingIndicator /> */}


                {showWebView ? renderWebView() : (
                    <Card
                        bordered
                        borderRadius={15}
                        backgroundColor="$cardDark"
                        padding="$4"
                        marginTop="$4"
                    >
                        {parsedOrderItems.map((item) => (
                            <XStack
                                key={item.id}
                                justifyContent="space-between"
                                marginBottom="$3"
                            >
                                <YStack flex={1} gap={4}>
                                    <Text fontSize={16} color="$text">{item.name}</Text>
                                    <Text fontSize={14} color="$gray11">Qty: {item.quantity}</Text>
                                </YStack>
                                <Text fontSize={16} fontWeight="500" color="$text">
                                    ₦{Number(item.price).toFixed(2)}
                                </Text>
                            </XStack>
                        ))}
                        <View
                            backgroundColor="$gray8"
                            height={1}
                            marginVertical="$3"
                        />
                        <XStack justifyContent="space-between">
                            <Text fontSize={16} color="$gray11">Total</Text>
                            <Text fontSize={18} fontWeight="600" color="$text">
                                ₦{Number(deliveryFee).toFixed(2)}
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
                        <Text fontSize={16} color="$gray11">ORD #: {orderId}</Text>
                        <Text fontSize={14} color="$gray11">
                            {`${deliveryType}`.toUpperCase()}
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
