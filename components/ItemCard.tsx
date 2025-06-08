import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Card, View, XStack, YStack, Image, useTheme, Text, Square } from 'tamagui'
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import { router } from 'expo-router'
import { DeliveryDetail, DeliveryStatus, OrderStatus } from '@/types/order-types'
import { Package, Shirt, Utensils } from 'lucide-react-native'
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
                return { bg: '$pendingTransparent', color: '$pending' };
            case 'in transit':
                return { bg: '$deliveredTransparent', color: '$delivered' };
            default:
                return { bg: '$successTransparent', color: '$success' };
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

Status.displayName = 'Status';

const ItemCard = React.memo(({ data, isHomeScreen = false }: CardProp) => {
    const theme = useTheme();
    const { setOrigin, setDestination } = useLocationStore();

    // Memoize navigation handler
    // const handlePress = React.useCallback(() => {
    //     router.push({
    //         pathname: '/delivery-detail/[id]',
    //         params: {
    //             id: data?.delivery?.id!,
    //             orderNumber: data?.order.id
    //         }
    //     });
    // }, [data?.delivery?.id, data?.order.id]);

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
                id: data?.delivery?.id!,
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

    // Memoize computed values
    const firstOrderItem = React.useMemo(() => data?.order.order_items[0], [data?.order.order_items]);
    const imageUrl = React.useMemo(() => firstOrderItem?.images[0]?.url, [firstOrderItem?.images]);
    const itemName = React.useMemo(() => firstOrderItem?.name, [firstOrderItem?.name]);

    return (
        <TouchableOpacity activeOpacity={0.6} onPress={handlePress}>
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
                                resizeMode="cover"
                            />
                        </Square>

                        {/* Content container */}
                        <YStack flex={1} gap={5}>
                            <XStack gap={5} alignItems="center">
                                <DeliveryTypeIcon
                                    type={data?.delivery?.delivery_type!}
                                    theme={theme}
                                />
                                <Text
                                    color="$text"
                                    fontFamily="$body"
                                    fontSize={11}
                                    numberOfLines={1}
                                    flex={1}
                                >
                                    {itemName}
                                </Text>
                            </XStack>

                            <XStack gap={5} alignItems="flex-start">
                                <MaterialCommunityIcons
                                    name="circle"
                                    color={theme.icon.val}
                                    size={10}
                                    style={styles.iconStyle}
                                />
                                <Text
                                    flex={1}
                                    color="$text"
                                    fontFamily="$body"
                                    fontSize={11}
                                    numberOfLines={2}
                                >
                                    {data?.delivery?.origin}
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
                                    color="$text"
                                    fontFamily="$body"
                                    fontSize={11}
                                    numberOfLines={2}
                                >
                                    {data?.delivery?.destination}
                                </Text>
                            </XStack>

                            <XStack gap={5} alignItems="center" flexWrap="wrap">
                                <XStack gap={5} alignItems="center" flexShrink={0}>
                                    <Feather name="clock" color={theme.icon.val} size={10} />
                                    <Text color="$text" fontFamily="$body" fontSize={11}>
                                        {data?.delivery?.duration}
                                    </Text>
                                </XStack>
                                {/* <XStack gap={2} alignItems="center" flexShrink={0}>
                                    <MaterialCommunityIcons name="road-variant" color={theme.icon.val} size={11} />
                                    <Text color="$text" fontFamily="$body" fontSize={11}>
                                        {data?.delivery?.distance} km
                                    </Text>
                                </XStack> */}
                            </XStack>
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
                        <Text color="$text" fontFamily="$heading" fontSize={12} fontWeight="700">
                            ₦ {Number(data?.delivery?.delivery_fee).toFixed(2)}
                        </Text>
                    </XStack>

                    {!isHomeScreen && <Status status={data?.delivery?.delivery_status} />}
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




// export const Status = ({ status }: { status?: OrderStatus }) => {
//     return (
//         <View
//             backgroundColor={status === 'pending' ? '$pendingTransparent' : status === 'in-transit' ? '$deliveredTransparent' : '$successTransparent'}
//             paddingVertical={6}
//             paddingHorizontal={10}
//             borderRadius={20}
//         >
//             <Text color={status === 'pending' ? '$pending' : status === 'in-transit' ? '$delivered' : '$success'}
//                 fontFamily={'$heading'} fontWeight={'800'}
//                 fontSize={11}
//                 textTransform='capitalize'
//             >{status}

//             </Text>
//         </View>
//     )
// }