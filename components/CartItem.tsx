import { View, Text, Image, XStack, useTheme } from "tamagui";
import { CartItem, useCartStore } from "@/store/cartStore";
import { TouchableOpacity } from "react-native";
import { Minus, Plus, Trash2Icon } from "lucide-react-native";

type CartItemProps = {
    item: CartItem;
};

const Item = ({ item }: CartItemProps) => {
    const { updateItemQuantity, removeItem } = useCartStore();
    const theme = useTheme()

    return (
        <>
            <View
                flexDirection="row"
                padding="$2"
                backgroundColor="$cardBackground"
                borderRadius="$2"
                marginVertical="$1"
            >
                <Image
                    source={{ uri: item.image }}
                    width={60}
                    height={60}
                    borderRadius="$1"
                />
                <View flex={1} marginLeft="$2">
                    <Text fontFamily="$body">{item.name}</Text>
                    <Text fontFamily="$body" color="$gray11">
                        ₦{item.price?.toLocaleString()}
                    </Text>
                    <Text fontFamily="$body">Qty: {item.quantity}</Text>
                </View>
            </View>

            <XStack alignSelf="flex-end">
                <XStack alignItems="center" justifyContent="center" gap={"$2"} width={'$15'}>
                    <TouchableOpacity
                        onPress={() => updateItemQuantity(item.item_id, item.quantity - 1)}
                        style={{
                            backgroundColor: theme.transparentBtnPrimaryColor.val,
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                            padding: 5
                        }}>
                        <Minus size={20} color={theme.icon.val} />
                    </TouchableOpacity>
                    <Text color={'$icon'} fontSize={'$6'}>0</Text>
                    <TouchableOpacity
                        onPress={() => updateItemQuantity(item.item_id, item.quantity + 1)}
                        style={{
                            backgroundColor: theme.transparentBtnPrimaryColor.val,
                            borderTopRightRadius: 10,
                            borderBottomRightRadius: 10,
                            padding: 5
                        }}>
                        <Plus size={20} color={theme.icon.val} />
                    </TouchableOpacity>
                </XStack>
                <TouchableOpacity
                    onPress={() => removeItem(item.item_id)}
                    style={{
                        backgroundColor: theme.error.val,
                        borderRadius: 10,
                        padding: 5

                    }}>
                    <Trash2Icon size={20} color={theme.icon.val} />
                </TouchableOpacity>
            </XStack>
        </>
    );
};

export default Item;