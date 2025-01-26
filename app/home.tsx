import React, { useState } from 'react'
import { Image } from 'react-native'
import {
    YStack,
    XStack,
    Text,
    Button,
    Input,
    ScrollView,
    Select,
    Separator,
    Sheet,
    View,
    useTheme
} from 'tamagui'
import { router } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'


const sizes = [
    { id: 1, value: 's', name: 'Small' },
    { id: 2, value: 'm', name: 'Medium' },
    { id: 3, value: 'l', name: 'Large' },
    { id: 4, value: 'xl', name: 'X-Large' },
]

const ItemDetail = () => {
    const theme = useTheme()
    const [quantity, setQuantity] = useState(1)
    const [size, setSize] = useState('')
    const [color, setColor] = useState('')
    const [address, setAddress] = useState('')

    return (
        <ScrollView flex={1} backgroundColor="$background">
            <YStack padding="$4" gap="$4">
                {/* Header */}
                <XStack justifyContent="space-between" alignItems="center" top={20}>
                    <Button backgroundColor={'$transparentBtnPrimaryColor'} circular icon={<MaterialCommunityIcons name='chevron-left' color={theme.icon.val} size={35} />} onPress={() => router.back()} />
                    <Button backgroundColor={'$transparentBtnPrimaryColor'} icon={<MaterialCommunityIcons name='heart-outline' color={theme.icon.val} size={35} />} circular />
                </XStack>

                {/* Product Image */}
                <Image
                    source={require('@/assets/images/mkt.png')}
                    resizeMode='cover' height={600}
                    style={{ width: '100%', height: 350, borderRadius: 12 }}
                />

                {/* Product Info */}
                <YStack gap="$1">
                    <Text fontSize="$3" fontWeight="500" color={'$text'} >Store Name</Text>
                    <Text fontSize="$4" fontWeight="600">Product Name</Text>
                    <Text fontSize="$5" color="$orange10" fontWeight={'bold'}>₦99.99</Text>
                    <Text color="$gray11">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</Text>
                </YStack>

                {/* Quantity Controls */}
                <XStack alignItems="center" gap="$4" >
                    <Text fontWeight="bold">Quantity:</Text>
                    <View backgroundColor={'$transparentBtnPrimaryColor'} paddingVertical={5} paddingHorizontal={15} borderRadius={50}>
                        <XStack gap={25}>
                            <Button fontWeight={'bold'}
                                size={'$2'}
                                backgroundColor={'$profileCard'}
                                circular
                                fontSize={20}
                                onPress={() => setQuantity(q => Math.max(1, q - 1))}
                                disabled={quantity === 1}
                            >-</Button>
                            <Text fontSize="$4" alignSelf='center'>{quantity}</Text>
                            <Button fontWeight={'bold'}
                                size={'$2'}
                                backgroundColor={'$profileCard'}
                                circular
                                fontSize={20} onPress={() => setQuantity(q => q + 1)}>+</Button>
                        </XStack>
                    </View>
                </XStack>
                <YStack gap="$2">
                    <Text fontWeight="bold">Select Size</Text>
                    <XStack flexWrap="wrap" gap="$2">
                        {sizes.map((sizeItem) => (
                            <Button
                                borderCurve='continuous'
                                key={sizeItem.id}
                                backgroundColor={size === sizeItem.value ? '$transparentBtnPrimaryColor' : '$profileCard'}
                                color={size === sizeItem.value ? 'white' : '$gray11'}
                                fontWeight={size === sizeItem.value ? '700' : '400'}
                                onPress={() => setSize(sizeItem.value)}
                                borderRadius="$4"
                                paddingHorizontal="$3"
                                paddingVertical="$2"
                                size={'$3'}
                                fontSize={10}
                                pressStyle={{
                                    scale: 0.97,
                                    opacity: 0.9
                                }}
                            >
                                {sizeItem.name}
                            </Button>
                        ))}
                    </XStack>
                </YStack>



                {/* Delivery Address */}
                <YStack gap="$2">
                    <Text fontWeight="bold">Delivery Address</Text>
                    <Input
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Enter delivery address"
                        multiline
                        numberOfLines={3}
                        backgroundColor="$gray5"
                    />
                </YStack>

                {/* Add to Cart Button */}
                <Button
                    backgroundColor="$orange10"
                    color="white"
                    size="$5"
                    onPress={() => { }}
                >
                    Buy
                </Button>
            </YStack>
        </ScrollView>
    )
}

export default ItemDetail