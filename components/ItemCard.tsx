import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Card, View, XStack, YStack, Image, useTheme, Text, Square } from 'tamagui'
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import { router } from 'expo-router'
import { DeliveryDetail, OrderStatus } from '@/types/order-types'
import { Package, Shirt, Utensils, UtensilsCrossed } from 'lucide-react-native'

type CardProp = {
    data: DeliveryDetail
    isHomeScreen?: boolean
}

type DeliveryIconProps = {
    type: string;
    size?: number;
    theme: any;
}

const DeliveryTypeIcon = ({ type, size = 12, theme }: DeliveryIconProps) => {
    switch (type) {
        case 'food':
            return <Utensils size={size} color={theme.orange10.val} />;
        case 'laundry':
            return <Shirt size={size} color={theme.blue10.val} />;
        case 'package':
        default:
            return <Package size={size} color={theme.green10.val} />;
    }
};

const ItemCard = ({ data, isHomeScreen = false }: CardProp) => {

    const theme = useTheme()

    // const getImageUrl = (data: DeliveryDetail) => {
    //     switch (data.order_type) {
    //         case 'food':
    //             return data?.foods?.[0]?.image_url;
    //         case 'delivery':
    //             return data?.image_url;
    //         case 'laundry':
    //             return data?.laundries?.[0]?.image_url;
    //         default:
    //             return require('@/assets/images/mkt.png');
    //     }
    // };
    return (
        <TouchableOpacity activeOpacity={0.6} onPress={() => router.push({
            pathname: '/delivery-detail/[id]',
            params: {
                id: data?.delivery.id,
                orderNumber: data?.order.id

            }
        })}>

            <Card padding={10}>
                <XStack flex={1}>
                    {/* Left side container */}
                    <XStack flex={1} gap={10}>
                        {/* Image container with fixed dimensions */}
                        <Square
                            height={70}
                            width={70}
                            borderRadius={10}
                            flexShrink={0}  // Prevent shrinking
                            overflow="hidden"
                        >
                            <Image
                                src={data?.order.order_items[0].images[0].url}
                                height="100%"
                                width="100%"
                                alt={data?.order.order_items[0].name || 'Order item'}
                                resizeMode="cover"  // Maintain aspect ratio
                            />
                        </Square>

                        {/* Content container */}
                        <YStack flex={1} gap={5}>
                            <XStack gap={5} alignItems="center">
                                <DeliveryTypeIcon
                                    type={data?.delivery.delivery_type}
                                    theme={theme}
                                />
                                <Text
                                    color="$text"
                                    fontFamily="$body"
                                    fontSize={11}
                                    numberOfLines={1}
                                    flex={1}
                                >
                                    {data?.order.order_items[0].name}
                                </Text>
                            </XStack>

                            <XStack gap={5} alignItems="flex-start">
                                <MaterialCommunityIcons
                                    name="circle"
                                    color={theme.icon.val}
                                    size={10}
                                    style={{ marginTop: 4 }}  // Align with first line
                                />
                                <Text
                                    flex={1}
                                    color="$text"
                                    fontFamily="$body"
                                    fontSize={11}
                                    numberOfLines={2}
                                >
                                    {data?.delivery.origin}
                                </Text>
                            </XStack>

                            <XStack gap={5} alignItems="flex-start">
                                <Feather
                                    name="map-pin"
                                    color={theme.icon.val}
                                    size={10}
                                    style={{ marginTop: 4 }}
                                />
                                <Text
                                    flex={1}
                                    color="$text"
                                    fontFamily="$body"
                                    fontSize={11}
                                    numberOfLines={2}
                                >
                                    {data?.delivery.destination}
                                </Text>
                            </XStack>

                            <XStack gap={5} alignItems="center" flexWrap="wrap">
                                <XStack gap={5} alignItems="center" flexShrink={0}>
                                    <Feather name="clock" color={theme.icon.val} size={10} />
                                    <Text color="$text" fontFamily="$body" fontSize={11}>
                                        {data?.delivery.duration} mins
                                    </Text>
                                </XStack>
                                <XStack gap={2} alignItems="center" flexShrink={0}>
                                    <MaterialCommunityIcons name="road-variant" color={theme.icon.val} size={11} />
                                    <Text color="$text" fontFamily="$body" fontSize={11}>
                                        {data?.delivery.distance} km
                                    </Text>
                                </XStack>
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
                    paddingLeft={80}  // Align with content
                    paddingRight={10}
                >
                    <XStack gap={5} alignItems="center">
                        <AntDesign name="wallet" color={theme.icon.val} size={10} />
                        <Text color="$text" fontFamily="$heading" fontSize={12} fontWeight="700">
                            ₦ {data?.delivery.delivery_fee}
                        </Text>
                    </XStack>

                    {!isHomeScreen && <Status status={data?.order.order_status} />}
                </XStack>
            </Card>
        </TouchableOpacity>
    )
}

export default ItemCard


export const Status = ({ status }: { status?: OrderStatus }) => {
    return (
        <View
            backgroundColor={status === 'pending' ? '$pendingTransparent' : status === 'in-transit' ? '$deliveredTransparent' : '$successTransparent'}
            paddingVertical={6}
            paddingHorizontal={10}
            borderRadius={20}
        >
            <Text color={status === 'pending' ? '$pending' : status === 'in-transit' ? '$delivered' : '$success'}
                fontFamily={'$heading'} fontWeight={'800'}
                fontSize={11}
                textTransform='capitalize'
            >{status}

            </Text>
        </View>
    )
}