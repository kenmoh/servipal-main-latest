import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Card, View, XStack, YStack, Image, useTheme, Text, Square } from 'tamagui'
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import { router } from 'expo-router'
import { DeliveryDetail, DeliveryStatus, OrderStatus, PaymentStatus } from '@/types/order-types'
import { Package, Landmark, Shirt, Utensils } from 'lucide-react-native'
import { useLocationStore } from '@/store/locationStore'

type CardProp = {
    data: DeliveryDetail
    isHomeScreen?: boolean
}

type DeliveryIconProps = {
    type: string;
    size?: number;
    theme: any;
}



// Memoize the DeliveryTypeIcon component
const DeliveryTypeIcon = React.memo(({ type, size = 12, theme }: DeliveryIconProps) => {
    switch (type) {
        case 'food':
            return <Utensils size={size} color={theme.orange10.val} />;
        case 'laundry':
            return <Shirt size={size} color={theme.blue10.val} />;
        case 'package':
        default:
            return <Package size={size} color={theme.green10.val} />;
    }
});

DeliveryTypeIcon.displayName = 'DeliveryTypeIcon';

// Memoize the Status component
export const Status = React.memo(({ status }: { status?: DeliveryStatus }) => {
    const getStatusColors = (status?: DeliveryStatus) => {
        switch (status) {
            case 'pending':
                return { bg: 'rgba(255, 193, 7, 0.12)', color: 'gold' };
            case 'accepted':
                return { bg: 'rgba(33, 150, 243, 0.10)', color: '#0D47A1' };
            case 'delivered':
                return { bg: 'rgba(18, 2, 75, 0.49)', color: '#bbb' };
            case 'received':
                return { bg: 'rgba(5, 20, 105, 0.28)', color: 'rgb(44, 64, 179)' };
            case 'laundry_received':
                return { bg: 'rgba(255, 152, 0, 0.10)', color: '#E65100' };
            case 'canceled':
                return { bg: 'rgba(244, 67, 54, 0.10)', color: '#B71C1C' };
            default:
                return { bg: 'rgba(120, 144, 156, 0.10)', color: '#263238' };
        }
    };

    const colors = getStatusColors(status);

    return (
        <View
            backgroundColor={colors.bg}
            paddingVertical={6}
            paddingHorizontal={10}
            borderRadius={20}
        >
            <Text
                color={colors.color}
                fontFamily={'$heading'}
                fontWeight={'800'}
                fontSize={11}
                textTransform='capitalize'
            >
                {status}
            </Text>
        </View>
    );
});


// Memoize the Status component
export const PaymentStatusColor = React.memo(({ status }: { status?: PaymentStatus }) => {
    const getPaymentStatusColors = (status?: PaymentStatus) => {
        switch (status) {
            case 'pending':
                return { bg: 'rgba(255, 193, 7, 0.12)', color: 'gold' };
            case 'paid':
                return { bg: 'rgba(45, 243, 111, 0.10)', color: '#bbb' };
            case 'cancelled':
                return { bg: 'rgba(244, 67, 54, 0.10)', color: '#B71C1C' };
            case 'failed':
                return { bg: 'rgba(244, 67, 54, 0.10)', color: '#B71C1C' };
            default:
                return { bg: 'rgba(120, 144, 156, 0.10)', color: '#263238' };
        }
    };

    const colors = getPaymentStatusColors(status);

    return (
        <View
            backgroundColor={colors.bg}
            paddingVertical={6}
            paddingHorizontal={10}
            borderRadius={20}
        >
            <Text
                color={colors.color}
                fontFamily={'$heading'}
                fontWeight={'800'}
                fontSize={11}
                textTransform='capitalize'
            >
                {/* { status?.replace(/_/g, ' ')} */}
                {status}
            </Text>
        </View>
    );
});



Status.displayName = 'Status';

const ItemCard = React.memo(({ data, isHomeScreen = false }: CardProp) => {
    const theme = useTheme();
    const { setOrigin, setDestination } = useLocationStore();

    const handlePress = React.useCallback(() => {
        // Set origin and destination if available
        if (data?.delivery?.origin && data?.delivery?.pickup_coordinates) {
            setOrigin(
                data.delivery.origin,
                data.delivery.pickup_coordinates as [number, number]
            );
        }

        if (data?.delivery?.destination && data?.delivery?.dropoff_coordinates) {
            setDestination(
                data.delivery.destination,
                data.delivery.dropoff_coordinates as [number, number]
            );
        }

        // Navigate to detail screen
        router.push({
            pathname: '/delivery-detail/[id]',
            params: {
                id: data?.order?.id!,
                orderNumber: data?.order.id
            }
        });
    }, [
        data?.delivery?.id,
        data?.order.id,
        data?.delivery?.origin,
        data?.delivery?.destination,
        data?.delivery?.pickup_coordinates,
        data?.delivery?.dropoff_coordinates,
        setOrigin,
        setDestination
    ]);

    const handleGoToReceipt = (orderId: string) => {
        router.push({
            pathname: "/orderReceipt/[orderId]",
            params: { orderId: orderId as string }
        })
    }

    // Memoize computed values
    const firstOrderItem = React.useMemo(() => data?.order.order_items[0], [data?.order.order_items]);
    const imageUrl = React.useMemo(() => firstOrderItem?.images[0]?.url, [firstOrderItem?.images]);
    const itemName = React.useMemo(() => firstOrderItem?.name, [firstOrderItem?.name]);

    return (
        <TouchableOpacity activeOpacity={0.6} onPress={data?.order?.require_delivery === 'delivery' ? handlePress : () => handleGoToReceipt(data?.order?.id)}>
            <Card padding={10} >
                <XStack flex={1}>
                    {/* Left side container */}
                    <XStack flex={1} gap={10}>
                        {/* Image container with fixed dimensions */}
                        <Square
                            height={70}
                            width={70}
                            borderRadius={10}
                            flexShrink={0}
                            overflow="hidden"
                        >
                            <Image
                                src={imageUrl}
                                height="100%"
                                width="100%"
                                alt={itemName || 'Order item'}

                                objectFit="cover"
                            />
                        </Square>

                        {/* Content container */}
                        <YStack flex={1} gap={5}>
                            <XStack gap={5} alignItems="center">
                                <DeliveryTypeIcon
                                    type={data?.order?.require_delivery === 'delivery' ? data?.delivery?.delivery_type! : data?.order?.order_type!}
                                    theme={theme}
                                />
                                <Text
                                    color="$text"
                                    fontFamily="$body"
                                    fontSize={data?.order?.require_delivery === 'delivery' ? 11 : 16}
                                    numberOfLines={1}
                                    flex={1}
                                >
                                    {itemName}
                                </Text>

                            </XStack>

                            {data?.order?.require_delivery === 'pickup' &&
                                <XStack gap={5}>
                                    <Landmark size={15} color={theme.icon.val} />

                                    <Text
                                        flex={1}
                                        color="$text"
                                        fontFamily="$body"
                                        fontSize={11}
                                        numberOfLines={2}
                                    >
                                        {data?.order?.business_name}
                                    </Text>
                                </XStack>

                            }

                            {data?.order?.require_delivery === 'delivery' &&

                                <>
                                    <XStack gap={5} alignItems="flex-start">
                                        <MaterialCommunityIcons
                                            name="circle"
                                            color={theme.icon.val}
                                            size={10}
                                            style={styles.iconStyle}
                                        />
                                        <Text
                                            flex={1}
                                            color={theme.icon.val}
                                            fontFamily="$body"
                                            fontSize={11}
                                            numberOfLines={2}
                                        >
                                            {data?.delivery ? data?.delivery?.origin : ''}
                                        </Text>
                                    </XStack>

                                    <XStack gap={5} alignItems="flex-start">
                                        <Feather
                                            name="map-pin"
                                            color={theme.icon.val}
                                            size={10}
                                            style={styles.iconStyle}
                                        />
                                        <Text
                                            flex={1}
                                            color={theme.icon.val}
                                            fontFamily="$body"
                                            fontSize={11}
                                            numberOfLines={2}
                                        >
                                            {data?.delivery ? data?.delivery?.destination : ''}
                                        </Text>
                                    </XStack>
                                </>

                            }

                            {data?.order?.require_delivery === 'delivery' && <XStack gap={5} alignItems="center" flexWrap="wrap">
                                <XStack gap={5} alignItems="center" flexShrink={0}>
                                    <Feather name="clock" color={theme.icon.val} size={10} />
                                    <Text color="$text" fontFamily="$body" fontSize={11}>
                                        {data?.delivery ? data?.delivery?.duration : ''}
                                    </Text>
                                </XStack>
                                {/* {'DISTANCE HERE IF NEEDED'} */}
                            </XStack>}
                        </YStack>
                    </XStack>

                    {/* Right chevron */}
                    <XStack width={20} justifyContent="center" flexShrink={0}>
                        <Feather name="chevron-right" size={20} color={theme.icon.val} />
                    </XStack>
                </XStack>

                {/* Bottom info */}
                <XStack
                    justifyContent="space-between"
                    marginTop={10}
                    paddingLeft={80}
                    paddingRight={10}
                >
                    <XStack gap={5} alignItems="center">
                        <AntDesign name="wallet" color={theme.icon.val} size={10} />
                        {data?.order?.require_delivery === 'delivery' ? (
                            <Text color="$text" fontFamily="$heading" fontSize={12} fontWeight="700">
                                ₦ {Number(data?.delivery?.delivery_fee).toFixed(2)}
                            </Text>
                        ) : (<Text color="$text" fontFamily="$heading" fontSize={12} fontWeight="700">
                            ₦ {Number(data?.order?.total_price).toFixed(2)}
                        </Text>)}
                    </XStack>

                    {!isHomeScreen && <XStack gap={5}>
                        <Status status={data?.order?.require_delivery === 'delivery' ? data?.delivery?.delivery_status : data?.order?.order_status} />
                        <PaymentStatusColor status={data?.order?.order_payment_status} />
                    </XStack>}


                </XStack>
            </Card>
        </TouchableOpacity>
    );
});

ItemCard.displayName = 'ItemCard';

// Move styles outside component to prevent recreation
const styles = StyleSheet.create({
    iconStyle: {
        marginTop: 4
    }
});

export default ItemCard;
