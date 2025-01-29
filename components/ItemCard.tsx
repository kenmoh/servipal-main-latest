import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Card, View, XStack, YStack, Image, useTheme, Text, Square } from 'tamagui'
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Order, OrderStatus } from '@/types/order-types'

type CardProp = {
    data: Order
    isHomeScreen?: boolean
}

const ItemCard = ({ data, isHomeScreen = false }: CardProp) => {

    const theme = useTheme()

    const getImageUrl = (data: Order) => {
        switch (data.order_type) {
            case 'food':
                return data?.foods?.[0]?.image_url;
            case 'delivery':
                return data?.image_url;
            case 'laundry':
                return data?.laundries?.[0]?.image_url;
            default:
                return require('@/assets/images/mkt.png');
        }
    };
    return (
        <TouchableOpacity activeOpacity={0.6} onPress={() => router.push({
            pathname: '/(app)/delivery/[id]',
            params: {
                id: data?.id,
                orderNumber: data?.order_number

            }
        })}>
            <Card padding={10} >
                <XStack justifyContent='space-between'>
                    <XStack justifyContent='center' >
                        <XStack gap={10} >
                            <Square height={70} width={70}
                                borderRadius={10}
                                gap={20}

                                style={{ overflow: 'hidden' }}
                            >
                                <Image
                                    src={getImageUrl(data)}
                                    height={'100%'}
                                    width={'100%'}
                                    alt={data?.package_name || 'Order item'}

                                />
                            </Square>
                            <YStack gap={5}>
                                <XStack gap={5} alignItems='center'>
                                    <Feather name='package' color={theme.icon.val} size={10} />
                                    <Text color={'$text'} fontFamily={'$body'} fontSize={11}>{data?.package_name || data?.order_owner_username}</Text>
                                </XStack>
                                <XStack gap={5} alignItems='center'>

                                    <Text color={'$text'} fontFamily={'$body'} fontSize={11}>{data?.origin}</Text>
                                </XStack>
                                <XStack gap={5} alignItems='center'>
                                    <Feather name='map-pin' color={theme.icon.val} size={10} />
                                    <Text color={'$text'} fontFamily={'$body'} fontSize={11} textWrap='wrap'>{data?.destination}</Text>
                                </XStack>
                                <XStack gap={5} alignItems='center'>
                                    <XStack gap={5} alignItems='center'>
                                        <Feather name='clock' color={theme.icon.val} size={10} />
                                        <Text color={'$text'} fontFamily={'$body'} fontSize={11}>{data?.duration} mins</Text>
                                    </XStack>
                                    <XStack gap={5} alignItems='center'>
                                        <MaterialCommunityIcons name='circle' color={theme.icon.val} size={10} />
                                        <Text color={'$text'} fontFamily={'$body'} fontSize={11}>{data?.distance} km</Text>
                                    </XStack>
                                </XStack>

                            </YStack>
                        </XStack>
                    </XStack>
                    <Feather name='chevron-right' size={20} color={theme.icon.val} />
                </XStack>
                <XStack justifyContent='space-between' marginLeft={80} marginRight={'2.5%'} marginTop={5}>
                    <XStack gap={5} alignItems='center'>
                        <AntDesign name='wallet' color={theme.icon.val} size={10} />
                        <Text color={'$text'} fontFamily={'$heading'} fontSize={12} fontWeight={'700'}>₦ {data?.delivery_fee}</Text>
                    </XStack>

                    {!isHomeScreen && <Status status={data?.order_status} />}
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