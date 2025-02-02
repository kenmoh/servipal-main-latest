import React, { useState } from 'react'
import { Image } from 'react-native'
import {
    YStack,
    XStack,
    Text,
    Button,
    Input,
    ScrollView,
    View,
    useTheme
} from 'tamagui'

import { useLocalSearchParams } from 'expo-router/build/hooks'
import { Store } from 'lucide-react-native'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import AppTextInput from '@/components/AppInput'



const schema = z.object({

    deliveryAddress: z.string({ message: 'Delivery address is required.' }),


})

type FormData = z.infer<typeof schema>

const sizes = [
    { id: 1, value: 's', name: 'S' },
    { id: 2, value: 'm', name: 'M' },
    { id: 3, value: 'l', name: 'L' },
    { id: 4, value: 'xl', name: 'XL' },
    { id: 5, value: '2xl', name: '2XL' },
]

const colors = [
    { id: 1, value: 'red', hex: 'yellow' },
    { id: 2, value: 'blue', hex: '#0000FF' },
    { id: 3, value: 'green', hex: '#008000' },
    { id: 4, value: 'black', hex: 'tomato' },
]
const ItemDetail = () => {
    const theme = useTheme()
    const [quantity, setQuantity] = useState(1)
    const [size, setSize] = useState('')
    const [color, setColor] = useState('')
    const [address, setAddress] = useState('')

    const {
        itemId,
        name,
        price,
        image,
        seller,
        rating
    } = useLocalSearchParams()

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            deliveryAddress: '',

        }
    })

    const onSubmit = (data: FormData) => {
        console.log(data)
    }

    return (
        <ScrollView flex={1} backgroundColor="$background">
            {/* Product Image */}
            <Image
                src={image}
                resizeMode='cover' height={600}
                style={{ width: '100%', height: 350, borderRadius: 12 }}
            />
            <YStack padding="$4" gap="$4">


                {/* Product Info */}
                <YStack gap="$1">
                    <XStack gap={'$2'}>
                        <Store size={15} color={theme.icon.val} />
                        <Text fontSize="$3" fontWeight="500" color={'$text'} >{seller}</Text>
                    </XStack>
                    <Text fontSize="$4" fontWeight="700">{name}</Text>
                    <Text fontSize="$5" color="$orange10" fontWeight={'bold'}>₦{price}</Text>
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
                {/* Sizes Selector */}
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

                {/* Color Selector */}
                <YStack gap="$2">
                    <Text fontWeight="bold">Select Color</Text>
                    <XStack flexWrap="wrap" gap="$2">
                        {colors.map((colorItem) => (
                            <Button
                                circular
                                borderCurve='continuous'
                                key={colorItem.id}
                                backgroundColor={colorItem.hex}
                                borderColor={color === colorItem.value ? '$orange10' : ''}
                                borderWidth={color !== colorItem.value ? 5 : 0}
                                onPress={() => setColor(colorItem.value)}

                                size={'$3.5'}
                                fontSize={10}
                                pressStyle={{
                                    scale: 0.97,
                                    opacity: 0.9
                                }}
                            />

                        ))}
                    </XStack>
                </YStack>


                {/* Delivery Address */}
                <YStack gap="$2">
                    <Text fontWeight="bold">Delivery Address</Text>
                    <Controller
                        name='deliveryAddress'
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AppTextInput

                                placeholder='Enter delivery address'
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}

                                errorMessage={errors.deliveryAddress?.message}
                            />
                        )}

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