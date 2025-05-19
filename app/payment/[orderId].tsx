import React from 'react'
import { ScrollView } from 'react-native'
import { YStack, XStack, Text, Card, Button, View, useTheme } from 'tamagui'
import { router, useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { fetchDelivery } from '@/api/order'
import LoadingIndicator from '@/components/LoadingIndicator'
import { Package, Shirt, CreditCard, Utensils } from 'lucide-react-native'

const Payment = () => {
    const { orderId } = useLocalSearchParams()
    const theme = useTheme()

    const { data, isLoading } = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => fetchDelivery(orderId as string),
        enabled: !!orderId,
    })

    console.log(orderId, '====')

    if (isLoading) return <LoadingIndicator />

    const renderIcon = () => {
        switch (data?.delivery.delivery_type) {
            case 'food':
                return <Utensils size={24} color={theme.orange10.val} />
            case 'laundry':
                return <Shirt size={24} color={theme.blue10.val} />
            default:
                return <Package size={24} color={theme.green10.val} />
        }
    }

    const renderOrderItems = () => {
        if (data?.order.order_type === 'package') {
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
                            ₦{Number(data?.delivery.delivery_fee).toFixed(2)}
                        </Text>
                    </XStack>
                </Card>
            )
        }

        return (
            <Card
                bordered
                borderRadius={15}
                backgroundColor="$cardDark"
                padding="$4"
                marginTop="$4"
            >
                {data?.order.order_items.map((item, index) => (
                    <XStack
                        key={index}
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
                        ₦{Number(data?.delivery.delivery_fee).toFixed(2)}
                    </Text>
                </XStack>
            </Card>
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
                        <Text fontSize={16} color="$gray11">Order #{data?.order.id}</Text>
                        <Text fontSize={14} color="$gray11">
                            {data?.delivery.delivery_type.toUpperCase()}
                        </Text>
                    </YStack>
                </Card>

                {/* Order Items or Package Amount */}
                {renderOrderItems()}

                {/* Payment Button */}
                <Button
                    backgroundColor="$btnPrimaryColor"
                    color="$text"
                    size="$5"
                    marginTop="$4"
                    icon={CreditCard}
                    pressStyle={{ opacity: 0.8 }}
                    onPress={() => router.push({ pathname: '/payment/paymnt-complete', params: { paymentStatus: 'success' } })}
                >
                    Pay Now
                </Button>
            </YStack>
        </ScrollView>
    )
}

export default Payment