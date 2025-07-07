import { FlatList, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Heading, Paragraph, useTheme, View, YStack } from "tamagui";
import LaundryCard from "@/components/LaundryCard";
import CartInfoBtn from "@/components/CartInfoBtn";
import { useAuth } from "@/context/authContext";
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLaundryMenu } from "@/api/user";
import { LaundryMenuItem } from "@/types/item-types";
import { useCartStore } from "@/store/cartStore";
import EmptyList from "@/components/EmptyList";

import FAB from "@/components/FAB";
import { Menu } from "lucide-react-native";

const StoreDetails = () => {
    const { user } = useAuth();
    const { laundryId, storeId } = useLocalSearchParams();
    const { cart, addItem, totalCost, removeItem } = useCartStore();

    const laundryVendorId = storeId || laundryId;

    const { data, refetch, isFetching } = useQuery({
        queryKey: ["laundryItems", laundryVendorId],
        queryFn: () => fetchLaundryMenu(laundryVendorId as string),
        select: (items) =>
            items?.filter((item) => item.item_type === "laundry") || [],
    });


    const handleAddToCart = useCallback(
        (item: LaundryMenuItem) => {
            const isInCart = cart.order_items.some((cartItem) => cartItem.item_id === item.id);
            if (isInCart) {
                removeItem(item.id);
            } else {
                addItem(laundryVendorId as string, item.id, 1, {
                    name: item.name,
                    price: Number(item.price),
                    image: item.images?.[0]?.url || "",
                });
            }
        },
        [addItem, removeItem, laundryVendorId, cart.order_items]
    );


    return (
        <View flex={1} backgroundColor={"$background"} padding='$2'>
            <YStack flex={1}>
                <FlatList
                    data={data ?? []}
                    keyExtractor={(item) => item?.id}
                    renderItem={({ item }: { item: LaundryMenuItem }) => (
                        <LaundryCard
                            item={item}
                            onPress={() => handleAddToCart(item)}
                        />
                    )}
                    removeClippedSubviews={true}
                    ListHeaderComponent={<View />}
                    ListEmptyComponent={
                        !isFetching && user?.sub === laundryId ? (
                            <EmptyList
                                title="No Menu Items"
                                description="Add your first menu item to start selling"
                                buttonTitle="Add Menu Item"
                                route="/laundry-detail/addLaundryItem"
                            />
                        ) : null
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    refreshing={isFetching}
                    onRefresh={refetch}
                    stickyHeaderIndices={[0]}
                />
            </YStack>

            <CartInfoBtn
                label="View Cart"
                totalCost={totalCost?.toString()!}
                totalItem={cart.order_items.length}
                onPress={() => router.push({ pathname: "/cart" })}
            />

            {user?.user_type === "laundry_vendor" && laundryVendorId === user?.sub && data && data?.length > 0 && (
                <View position="absolute" bottom={40} right={10}>
                    <FAB
                        icon={<Menu color={"white"} />}
                        onPress={() =>
                            router.push({
                                pathname: "/laundry-detail/addLaundryItem"
                            })
                        }
                    />
                </View>
            )}
        </View>
    );
};

export default StoreDetails;
