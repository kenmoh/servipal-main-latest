import { FlatList, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme, View, YStack } from "tamagui";
import Category, { CategoryType } from "@/components/Category";
import FoodCard from "@/components/FoodCard";
import CartInfoBtn from "@/components/CartInfoBtn";
import { useAuth } from "@/context/authContext";
import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FoodGroup, MenuItem } from "@/types/item-types";
import { useCartStore } from "@/store/cartStore";
import EmptyList from "@/components/EmptyList";

import FAB from "@/components/FAB";
import { Menu } from "lucide-react-native";
import { fetchRestaurantMenu } from "@/api/user";

const groups: CategoryType[] = [
    { id: "appetizer", name: "Appetizers", category_type: "food" },
    { id: "main_course", name: "Main Course", category_type: "food" },
    { id: "dessert", name: "Desserts", category_type: "food" },
    { id: "others", name: "Others", category_type: "food" },
];

const StoreDetails = () => {
    const { user } = useAuth();
    const { storeId, screenType, restaurantId } = useLocalSearchParams();
    const { cart, addItem, totalCost, removeItem } = useCartStore();
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
    const [selectedFoodGroup, setSelectedFoodGroup] = useState<string | undefined>('main_course');
    const restId = storeId || restaurantId
    const { data, refetch, isFetching } = useQuery({
        queryKey: ["restaurantItems", storeId, selectedFoodGroup],
        queryFn: () => fetchRestaurantMenu(selectedFoodGroup as FoodGroup, restId as string),
        select: (items) =>
            items?.filter((item) => item.item_type === "food") || [],
    });



    const handleAddToCart = useCallback(
        (item: MenuItem) => {
            if (checkedItems.has(item.id)) {
                removeItem(item.id);
                setCheckedItems((prev) => {
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
                setCheckedItems((prev) => {
                    const newChecked = new Set(prev);
                    newChecked.add(item.id);
                    return newChecked;
                });
            }
        },
        [addItem, removeItem, storeId, checkedItems]
    );

    console.log(selectedFoodGroup, 'SELECTED FOOD GROUP')
    console.log(storeId, 'STORE ID', data)


    return (
        <View flex={1} backgroundColor={"$background"}>
            <YStack flex={1}>
                <FlatList
                    data={data ?? []}
                    keyExtractor={(item) => item?.id}
                    renderItem={({ item }: { item: MenuItem }) => (
                        <FoodCard
                            item={item}
                            cardType={"RESTAURANT"}
                            onPress={() => handleAddToCart(item)}
                        />
                    )}
                    removeClippedSubviews={true}
                    ListHeaderComponent={<Category
                        categories={groups || []}
                        onCategorySelect={val => setSelectedFoodGroup(val ?? undefined)}
                        selectedCategory={selectedFoodGroup ?? null}
                    />}
                    ListEmptyComponent={
                        !isFetching ? (
                            <EmptyList
                                title="No Menu Items"
                                description="Add your first menu item to start selling"
                                buttonTitle="Add Menu Item"
                                route="/restaurant-detail/addMenu"
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

            {user?.user_type === "restaurant_vendor" && data && data?.[0]?.restaurant_id === user?.sub && (
                <FAB
                    icon={<Menu color={"white"} />}
                    onPress={() =>
                        router.push({
                            pathname: "/restaurant-detail/addMenu"

                        })
                    }
                />
            )}
        </View>
    );
};

export default StoreDetails;
