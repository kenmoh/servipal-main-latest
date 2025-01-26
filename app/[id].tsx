import { StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import React from 'react'
import { Card, Text, XStack, Circle, Avatar, YStack, Paragraph, useTheme, Button } from 'tamagui'
import { AntDesign, Feather, FontAwesome6 } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import MapView from 'react-native-maps';

import LoadingIndicator from '@/components/LoadingIndicator'
import { orderItemDetails } from '@/api/order'
import { StatusBar } from 'expo-status-bar'
import { Status } from '@/components/ItemCard'



const MAP_HEIGHT = Dimensions.get('window').height * 0.35



const ItemDetails = () => {
    const { id, orderNumber } = useLocalSearchParams()
    const theme = useTheme()

    const { data, isLoading } = useQuery({
        queryKey: ['order', id],
        queryFn: () => orderItemDetails(id as string),
        enabled: !!id,
        // staleTime: 1000 * 60 * 3,
    })


    if (isLoading) {
        return <LoadingIndicator />
    }

    return (

        <>

            <Stack.Screen options={{
                headerTransparent: true,
                title: '',
                headerStyle: {
                    backgroundColor: 'transparent',

                },
                headerTintColor: theme.profileCard.val
            }} />
            <MapView initialRegion={{
                longitude: 8.6753,
                latitude: 9.0820,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }} style={{ height: MAP_HEIGHT }} />
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 25 }} >
                {data?.rider_phone_number && <Card marginVertical={10} backgroundColor={'$profileCard'} width={'95%'} alignSelf='center' bordered borderColor={'$inputBackground'} paddingRight={10}>
                    <XStack justifyContent='space-between' >
                        <XStack gap={5} justifyContent='center' alignSelf='center'>
                            <Avatar size={'$8'}>
                                <Avatar.Image source={require('@/assets/images/rider.png')} />
                                <Avatar.Fallback backgroundColor={'$inputBackground'} />
                            </Avatar>
                            <YStack alignSelf='center'>
                                <Text fontFamily={'$body'} fontSize={11}>{data?.rider_name}</Text>
                                <Text fontFamily={'$body'} fontSize={12} fontWeight={'600'}>{data?.dispatch_company_name}</Text>
                                <Text fontFamily={'$body'} color={'$text'} fontSize={12}>LG456</Text>
                            </YStack>
                        </XStack>
                        <Circle alignSelf='center' size={40} style={{ backgroundColor: 'rgba(255, 168,0,0.35)' }}>
                            <TouchableOpacity hitSlop={100} onPress={() => console.log('Calling Number')} >
                                <AntDesign name='phone' color={'white'} />
                            </TouchableOpacity>
                        </Circle>
                    </XStack>
                </Card>}
                <Card marginVertical={5} width={'95%'} alignSelf='center' backgroundColor={'$profileCard'} bordered borderColor={'$inputBackground'} paddingRight={10}>
                    <Card.Header gap={5} >
                        <XStack gap={5} alignItems='baseline' justifyContent='space-between'>
                            <Text color={'$text'} fontSize={12} marginBottom={5}>ORDER DETAILS</Text>
                            <Status status={data?.order_status} />
                        </XStack>
                        <XStack gap={5} alignItems='baseline'>
                            <AntDesign name='infocirlceo' color={theme.icon.val} size={15} />
                            <YStack>
                                <Paragraph color={'$text'} fontFamily={'$body'} fontWeight={'300'} fontSize={11}>Order Number</Paragraph>
                                <Paragraph color={'$text'} fontFamily={'$body'} fontWeight={'500'} fontSize={12}>#{data?.order_number}</Paragraph>
                            </YStack>
                        </XStack>
                        <XStack gap={5} alignItems='baseline'>
                            <AntDesign name='wallet' color={theme.icon.val} size={15} />
                            <YStack>
                                <Paragraph color={'$text'} fontFamily={'$body'} fontWeight={'300'} fontSize={11}>Delivery fee(After commission)</Paragraph>
                                <Paragraph color={'$text'} fontFamily={'$body'} fontWeight={'500'} fontSize={12}>₦{data?.amount_due_dispatch}</Paragraph>
                            </YStack>
                        </XStack>
                        <XStack gap={5} alignItems='baseline'>
                            <Feather name='map-pin' color={theme.icon.val} size={15} />
                            <YStack>
                                <Paragraph color={'$text'} fontFamily={'$body'} fontWeight={'300'} fontSize={11}>Delivery Address</Paragraph>
                                <Paragraph color={'$text'} fontFamily={'$body'} fontWeight={'500'} fontSize={12}>{data?.destination}</Paragraph>
                            </YStack>
                        </XStack>
                        <XStack justifyContent='space-between'>
                            <XStack gap={5} alignItems='baseline'>
                                <FontAwesome6 name="square-phone" size={15} color={theme.icon.val} />
                                <YStack>
                                    <Paragraph color={'$text'} fontFamily={'$body'} fontWeight={'300'} fontSize={11}>Sender Phone</Paragraph>
                                    <Paragraph color={'$text'} fontFamily={'$body'} fontWeight={'500'} fontSize={12}>{data?.order_owner_phone_number}</Paragraph>
                                </YStack>
                            </XStack>
                            <XStack gap={5} alignItems='baseline'>
                                <FontAwesome6 name="square-phone" size={15} color={theme.icon.val} />
                                <YStack>
                                    <Paragraph color={'$text'} fontFamily={'$body'} fontWeight={'300'} fontSize={11}>Recipient Phone </Paragraph>
                                    <Paragraph color={'$text'} fontFamily={'$body'} fontWeight={'500'} fontSize={12}>{data?.order_owner_phone_number}</Paragraph>
                                </YStack>
                            </XStack>
                        </XStack>

                    </Card.Header>
                </Card>
                <Card marginVertical={5} width={'95%'} alignSelf='center' backgroundColor={'$profileCard'} bordered borderColor={'$inputBackground'} paddingRight={10}>
                    <Card.Header gap={5} >
                        <XStack gap={5} alignItems='baseline' justifyContent='space-between'>
                            <Text color={'$text'} fontSize={12} marginBottom={5}>ORDER DETAILS</Text>
                            <Status status={data?.order_status} />
                        </XStack>
                        <XStack gap={5} alignItems='baseline'>
                            <AntDesign name='infocirlceo' color={theme.icon.val} size={15} />
                            <YStack>
                                <Paragraph color={'$text'} fontFamily={'$body'} fontWeight={'300'} fontSize={11}>Order Number</Paragraph>
                                <Paragraph color={'$text'} fontFamily={'$body'} fontWeight={'500'} fontSize={12}>#{data?.order_number}</Paragraph>
                            </YStack>
                        </XStack>
                        <XStack gap={5} alignItems='baseline'>
                            <AntDesign name='wallet' color={theme.icon.val} size={15} />
                            <YStack>
                                <Paragraph color={'$text'} fontFamily={'$body'} fontWeight={'300'} fontSize={11}>Delivery fee(After commission)</Paragraph>
                                <Paragraph color={'$text'} fontFamily={'$body'} fontWeight={'500'} fontSize={12}>₦{data?.amount_due_dispatch}</Paragraph>
                            </YStack>
                        </XStack>
                        <XStack gap={5} alignItems='baseline'>
                            <Feather name='map-pin' color={theme.icon.val} size={15} />
                            <YStack>
                                <Paragraph color={'$text'} fontFamily={'$body'} fontWeight={'300'} fontSize={11}>Delivery Address</Paragraph>
                                <Paragraph color={'$text'} fontFamily={'$body'} fontWeight={'500'} fontSize={12}>{data?.destination}</Paragraph>
                            </YStack>
                        </XStack>
                        <XStack justifyContent='space-between'>
                            <XStack gap={5} alignItems='baseline'>
                                <FontAwesome6 name="square-phone" size={15} color={theme.icon.val} />
                                <YStack>
                                    <Paragraph color={'$text'} fontFamily={'$body'} fontWeight={'300'} fontSize={11}>Owner Phone</Paragraph>
                                    <Paragraph color={'$text'} fontFamily={'$body'} fontWeight={'500'} fontSize={12}>{data?.order_owner_phone_number}</Paragraph>
                                </YStack>
                            </XStack>
                            <XStack gap={5} alignItems='baseline'>
                                <FontAwesome6 name="square-phone" size={15} color={theme.icon.val} />
                                <YStack>
                                    <Paragraph color={'$text'} fontFamily={'$body'} fontWeight={'300'} fontSize={11}>Recipient Phone </Paragraph>
                                    <Paragraph color={'$text'} fontFamily={'$body'} fontWeight={'500'} fontSize={12}>{data?.order_owner_phone_number}</Paragraph>
                                </YStack>
                            </XStack>
                        </XStack>

                    </Card.Header>
                </Card>
            </ScrollView>

            <Button
                bottom={10}
                size={'$4'}
                backgroundColor={'$btnPrimaryColor'}
                width={'95%'}
                textAlign='center'
                alignSelf='center'
                fontSize={20}
                fontFamily={'$body'}
                color={'$text'}
                fontWeight={'600'}

                pressStyle={{ backgroundColor: '$transparentBtnPrimaryColor' }}
            >Accept</Button>
        </>

    )
}

export default ItemDetails

const styles = StyleSheet.create({})