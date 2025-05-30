import { View, Text, Image, XStack, useTheme, Card, YStack } from "tamagui";
import { CartItem, useCartStore } from "@/store/cartStore";
import { TouchableOpacity } from "react-native";
import { Minus, Plus, Trash } from "lucide-react-native";

type CartItemProps = {
    item: CartItem;
};

const Item = ({ item }: CartItemProps) => {
    const { updateItemQuantity, removeItem } = useCartStore();
    const theme = useTheme()

    return (
        <Card
            padding="$3"
            backgroundColor="$cardDark"
            borderRadius="$2"
            marginVertical="$1"
            width={'90%'}
            alignSelf="center"
            flexDirection="row"
            justifyContent="space-between"
        >
            <XStack flex={1}>
                {/* Left side: Image */}
                <Image
                    source={{ uri: item.image }}
                    width={60}
                    height={60}
                    borderRadius="$1"
                />

                {/* Middle: Name and Price */}
                <View marginLeft="$2" flex={1}>
                    <Text fontFamily="$body" numberOfLines={2}>
                        {item.name}
                    </Text>
                    <Text fontFamily="$body" color="$gray11" marginTop="$1">
                        ₦{item.price?.toLocaleString()}
                    </Text>
                </View>
            </XStack>

            {/* Right: Quantity Controls */}

            <YStack>
                <XStack gap={"$2"} >
                    <TouchableOpacity
                        onPress={() => updateItemQuantity(item.item_id, item.quantity - 1)}
                        style={{

                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                            padding: 3
                        }}>
                        <Minus size={20} color={theme.icon.val} />
                    </TouchableOpacity>
                    <View padding={3}>
                        <Text color={'$icon'} fontSize={'$3'}>{item.quantity}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => updateItemQuantity(item.item_id, item.quantity + 1)}
                        style={{

                            borderTopRightRadius: 10,
                            borderBottomRightRadius: 10,
                            padding: 3
                        }}>
                        <Plus size={20} color={theme.icon.val} />
                    </TouchableOpacity>
                </XStack>

                {/* Delete button */}
                <TouchableOpacity
                    onPress={() => removeItem(item.item_id)}
                    style={{
                        borderRadius: 20,
                        padding: 5,
                        alignSelf: 'flex-end',
                        marginTop: 10

                    }}>
                    <Trash size={20} color={theme.icon.val} />
                </TouchableOpacity>

            </YStack>

        </Card>
    );
};

export default Item;