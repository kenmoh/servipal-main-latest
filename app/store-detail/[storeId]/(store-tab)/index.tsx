import { FlatList, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme, View, YStack } from "tamagui";
import Category, { CategoryType } from "@/components/Category";
import FoodCard from "@/components/FoodCard";
import CartInfoBtn from "@/components/CartInfoBtn";
import { useAuth } from "@/context/authContext";
import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchVendorItems } from "@/api/item";
import { MenuItem } from "@/types/item-types";
import { useCartStore } from "@/store/cartStore";
import EmptyList from "@/components/EmptyList";
import { dummyMenuItems } from './dummyData';
import AddItemBtn from "@/components/AddItemBtn";
import FAB from "@/components/FAB";
import { Menu, Plus } from "lucide-react-native";

const groups: CategoryType[] = [
    { id: "1", name: "Starters", category_type: "food" },
    { id: "2", name: "Main Course", category_type: "food" },
    { id: "3", name: "Desserts", category_type: "food" },
    { id: "4", name: "Others", category_type: "food" },
];

const StoreDetails = () => {
    const { user } = useAuth();
    const { storeId, screenType } = useLocalSearchParams();
    const { cart, addItem, totalCost, removeItem } = useCartStore();
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

    const { data, refetch, isFetching } = useQuery({
        queryKey: ["storeItems", storeId],
        queryFn: () => fetchVendorItems(storeId as string),
    });

    const handleAddToCart = useCallback(
        (item: MenuItem) => {
            if (checkedItems.has(item.id)) {
                removeItem(item.id);
                setCheckedItems(prev => {
                    const newChecked = new Set(prev);
                    newChecked.delete(item.id);
                    return newChecked;
                });
            } else {
                addItem(storeId as string, item.id, 1, {
                    name: item.name,
                    price: Number(item.price),
                    image: item.images[0]?.url || "",
                });
                setCheckedItems(prev => {
                    const newChecked = new Set(prev);
                    newChecked.add(item.id);
                    return newChecked;
                });
            }
        },
        [addItem, removeItem, storeId, checkedItems]
    );

    return (
        <View flex={1} backgroundColor={"$background"}>
            <YStack flex={1}>
                <FlatList
                    data={data ?? []}
                    keyExtractor={(item) => item?.id}
                    renderItem={({ item }: { item: MenuItem }) => (
                        <FoodCard
                            item={item}
                            screenType={screenType as "RESTAURANT" | "LAUNDRY"}
                            onPress={() => handleAddToCart(item)}
                        />
                    )}
                    removeClippedSubviews={true}
                    ListHeaderComponent={<Category categories={groups || []} />}
                    ListEmptyComponent={
                        <EmptyList
                            title="No Menu Items"
                            description="Add your first menu item to start selling"
                            buttonTitle="Add Menu Item"
                            route="/store-detail/addMenu"
                        />
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

            {user?.user_type === "vendor" && <FAB icon={<Menu color={'white'} />} onPress={() => router.push({ pathname: "/store-detail/addMenu" })} />}

        </View>
    );
};


export default StoreDetails;
