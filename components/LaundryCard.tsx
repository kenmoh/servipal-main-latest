import { StyleSheet, Image, Pressable } from 'react-native'
import { LaundryMenuItem } from "@/types/item-types"
import React from 'react'
import { Card, Heading, Paragraph, Checkbox, Square, useTheme, XStack, YStack } from 'tamagui'
import { Check, Edit, Trash } from 'lucide-react-native'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/context/authContext'
import { Notifier, NotifierComponents } from 'react-native-notifier'
import { AntDesign } from '@expo/vector-icons'
import { router } from 'expo-router'

const LaundryCard = ({ item, onPress, onDelete }: {
    item: LaundryMenuItem,
    onPress: (item: LaundryMenuItem) => void,
    onDelete?: (id: string) => void
}) => {
    const theme = useTheme()
    const { user } = useAuth()
    const cartItems = useCartStore(state => state.cart.order_items)

    // Check if item exists in cart
    const isChecked = cartItems.some(cartItem => cartItem.item_id === item.id)

    const isOwner = user?.user_type === 'laundry_vendor' && user?.sub === item.user_id;


    return (
        <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]} onPress={() => onPress(item)}>
            <Card
                bordered
                padded
                width={'95%'}
                alignSelf='center'
                borderWidth={StyleSheet.hairlineWidth}
                borderColor={'$profileCard'}
                marginVertical='$1.5'
                backgroundColor={'$cardBackground'}
            >
                {/* Edit/Delete buttons for owner */}
                {isOwner && (
                    <XStack position="absolute" top={10} right={10} gap={20} zIndex={2}>
                        <Pressable
                            onPress={() => router.push({
                                pathname: '/laundry-detail/addLaundryItem',
                                params: {
                                    id: item.id,
                                    name: item.name,
                                    price: item.price,
                                    images: JSON.stringify(item.images),
                                    item_type: item.item_type,
                                }
                            })}
                            hitSlop={10}
                            style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }]}
                        >
                            <Edit color={theme.icon.val} size={15} />
                        </Pressable>
                        <Pressable
                            onPress={() => onDelete ? onDelete(item.id) : Notifier.showNotification({
                                title: "Delete",
                                description: "Item deleted successfully.",
                                Component: NotifierComponents.Alert,
                                duration: 2000,
                                componentProps: { alertType: "warn" },
                            })}
                            hitSlop={10}
                            style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }]}
                        >
                            <Trash color={theme.red10.val} size={15} />
                        </Pressable>
                    </XStack>
                )}
                <XStack gap={'$4'}>
                    <Square height={80} width={80} borderRadius={'$3'} overflow='hidden'>
                        <Image
                            source={{ uri: item?.images?.[0]?.url || 'https://via.placeholder.com/80x80?text=No+Image' }}
                            style={{
                                height: '100%',
                                width: '100%'
                            }}
                        />
                    </Square>
                    <YStack width={'70%'} alignSelf='center' justifyContent='center'>
                        <Heading fontSize={12} color={'$icon'} letterSpacing={'$1'} style={{ fontFamily: 'Poppins-Regular', fontWeight: '400' }}>
                            {item?.name}
                        </Heading>

                        <Heading marginTop={'$2'} fontSize={14} fontWeight={'bold'}>
                            ₦{Number(item?.price).toFixed(2)}
                        </Heading>
                    </YStack>
                </XStack>
                <Checkbox
                    checked={isChecked}
                    position="absolute"
                    right={10}
                    bottom={10}
                    hitSlop={25}
                    size={'$5'}
                    disabled={isOwner}
                    onPressIn={!isOwner ? () => onPress(item) : () => Notifier.showNotification({
                        title: "Not Allowed",
                        description: "You cannot order from your own laundry",
                        Component: NotifierComponents.Alert,
                        duration: 3000,
                        componentProps: {
                            alertType: "warn",
                        },
                    })}
                >
                    <Checkbox.Indicator>
                        <Check color={theme.btnPrimaryColor.val} />
                    </Checkbox.Indicator>
                </Checkbox>
            </Card>
        </Pressable>
    )
}

export default LaundryCard

