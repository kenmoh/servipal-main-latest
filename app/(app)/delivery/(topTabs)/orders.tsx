import { fetchDeliveries, fetchUserRelatedOrders } from "@/api/order";
import HDivider from "@/components/HDivider";
import ItemCard from "@/components/ItemCard";
import LoadingIndicator from "@/components/LoadingIndicator";
import RefreshButton from "@/components/RefreshButton";
import { useAuth } from "@/context/authContext";
import { DeliveryDetail } from "@/types/order-types";
import { useQuery } from "@tanstack/react-query";
import {
    Check,
    ClockIcon,
    CoinsIcon,
    Handshake,
    Package,
    Package2,
    RefreshCcw,
    Shirt,
    Utensils,
} from "lucide-react-native";
import { useMemo, useState, useCallback } from "react";
import { FlatList, ScrollView } from "react-native";
import { YStack, Text, useTheme, Card, View, Button } from "tamagui";
import { StatsSkeleton, DeliveryListSkeleton } from "@/components/LoadingSkeleton";
import React from "react";

const UserOrders = () => {
    const theme = useTheme();
    const { user } = useAuth();

    const { data, isLoading, error, refetch, isFetching, isPending, isFetched } = useQuery({
        queryKey: ["deliveries", user?.sub],
        queryFn: () => fetchUserRelatedOrders(user?.sub as string),
        refetchOnWindowFocus: true,
        refetchOnMount: true,


    });


    const stats = useMemo(
        () => ({
            pending:
                data?.filter((order) => order.delivery?.delivery_status === "pending")
                    .length || 0,
            acepted:
                data?.filter((order) => order.delivery?.delivery_status === "accepted")
                    .length || 0,
            received:
                data?.filter((order) => order.delivery?.delivery_status === "received")
                    .length || 0,
            delivered:
                data?.filter((order) => order.delivery?.delivery_status === "delivered")
                    .length || 0,
            foodOrders:
                data?.filter((order) => order.order.order_type === "food").length || 0,
            packageOrders:
                data?.filter((order) => order.order.order_type === "package").length ||
                0,
            laundryOrders:
                data?.filter((order) => order.order.order_type === "laundry").length ||
                0,
        }),
        [data]
    );

    // Memoized FlatList helpers
    const renderItem = useCallback(({ item }: { item: DeliveryDetail }) => <ItemCard data={item} />, []);
    const renderSeparator = useCallback(() => <HDivider />, []);
    const keyExtractor = useCallback((item: DeliveryDetail) => item?.order?.id!, []);

    if (isLoading || isFetching || isPending || !isFetched || !data) {
        return (
            <YStack backgroundColor={theme.background} flex={1} paddingHorizontal="$2">
                <View
                    marginVertical={2}
                    backgroundColor={"$background"}
                    alignItems="center"
                    justifyContent="center"
                    height={110}
                >
                    <StatsSkeleton />
                </View>
                <HDivider width="100%" />
                <YStack backgroundColor={"$background"} flex={1}>
                    <DeliveryListSkeleton />
                </YStack>
            </YStack>
        );
    }

    if (error) return <RefreshButton onPress={refetch} label="Error loading orders" />

    return (
        <YStack backgroundColor={theme.background} flex={1} paddingHorizontal="$2">
            <View
                marginVertical={2}
                backgroundColor={"$background"}
                alignItems="center"
                justifyContent="center"
                height={110}
            >
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 10,
                        gap: 10,
                        paddingVertical: 10,
                        height: "100%",
                    }}
                >
                    <StatCard
                        icon={CoinsIcon}
                        label="Total Orders"
                        value={data?.length || 0}
                        color={theme.gray10.val}
                    />
                    <StatCard
                        icon={Check}
                        label="Received"
                        value={stats.received}
                        color={theme.successTransparent.val}
                    />
                    <StatCard
                        icon={ClockIcon}
                        label="Pending"
                        value={stats.pending}
                        color={theme.btnPrimaryColor.val}
                    />
                    <StatCard
                        icon={Handshake}
                        label="Assigned"
                        value={stats.acepted}
                        color={theme.gray11.val}
                    />

                    <StatCard
                        icon={Package2}
                        label="Delivered"
                        value={stats.delivered}
                        color={theme.blue9.val}
                    />
                    <StatCard
                        icon={Utensils}
                        label="Food"
                        value={stats.foodOrders}
                        color={theme.red9.val}
                    />
                    <StatCard
                        icon={Package}
                        label="Package"
                        value={stats.packageOrders}
                        color={theme.green9.val}
                    />
                    <StatCard
                        icon={Shirt}
                        label="Laundry"
                        value={stats.laundryOrders}
                        color={theme.purple9.val}
                    />
                </ScrollView>
            </View>

            <HDivider width="100%" />

            <YStack backgroundColor={"$background"} flex={1}>
                <FlatList
                    data={data}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    ItemSeparatorComponent={renderSeparator}
                    refreshing={isFetching}
                    onRefresh={refetch}
                    removeClippedSubviews={true}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                />
            </YStack>
        </YStack>
    );
};

export default UserOrders;

const StatCard = React.memo(({ icon: Icon, label, value, color }: {
    icon: any;
    label: string;
    value: number;
    color: string;
}) => (
    <Card
        bordered
        backgroundColor="$cardDark"
        width={100}
        height={90}
        alignItems="center"
        justifyContent="center"
        gap="$2"
        borderRadius="$4"
        marginBottom="$6"
    >
        <Icon size={24} color={color} />
        <YStack alignItems="center">
            <Text fontSize={18} fontWeight="700" color="$text">
                {value}
            </Text>
            <Text fontSize={11} color="$icon" fontFamily="$body">
                {label}
            </Text>
        </YStack>
    </Card>
));
StatCard.displayName = 'StatCard';
