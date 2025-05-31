import { DeliveryType, fetchDeliveries } from '@/api/order'
import HDivider from '@/components/HDivider'
import ItemCard from '@/components/ItemCard'
import LoadingIndicator from '@/components/LoadingIndicator'
import { useAuth } from '@/context/authContext'
import { DeliveryDetail } from '@/types/order-types'
import { useQuery } from '@tanstack/react-query'
import { Check, ClockIcon, Package, Package2, Shirt, ShoppingBag, Utensils } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { FlatList, ScrollView } from 'react-native'
import { YStack, Text, useTheme, Card } from 'tamagui'

const UserOrders = () => {
    const theme = useTheme()
    const { user } = useAuth()
    const [selectedType, setSelectedType] = useState<DeliveryType | 'all'>('all')

    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ['deliveries', user?.sub],
        queryFn: () => fetchDeliveries(),
        select: (data) => {
            if (!user?.sub || !data) return [];

            return data.filter(order =>
                order?.delivery?.sender_id === user.sub ||
                order?.delivery?.vendor_id === user.sub ||
                order?.delivery?.dispatch_id === user.sub ||
                order?.delivery?.rider_id === user.sub
            );
        },
        enabled: !!user?.sub // Only fetch when user ID is available
    })

    const stats = useMemo(() => ({
        pending: data?.filter(order => order.order.order_status === 'pending').length || 0,
        delivered: data?.filter(order => order.order.order_status === 'delivered').length || 0,
        completed: data?.filter(order => order.order.order_status === 'in-transit').length || 0,
        foodOrders: data?.filter(order => order.order.order_type === 'food').length || 0,
        packageOrders: data?.filter(order => order.order.order_type === 'package').length || 0,
        laundryOrders: data?.filter(order => order.order.order_type === 'laundry').length || 0,
    }), [data]);

    if (isLoading) return <LoadingIndicator />
    if (error) return <Text color="$red10">Error loading data</Text>

    return (
        <YStack backgroundColor={theme.background} flex={1} paddingHorizontal="$2">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 10,
                    gap: 10,
                    paddingVertical: 15
                }}
            >
                <StatCard
                    icon={ClockIcon}
                    label="Pending"
                    value={stats.pending}
                    color={theme.btnPrimaryColor.val}
                />
                <StatCard
                    icon={Package2}
                    label="Delivered"
                    value={stats.delivered}
                    color={theme.blue9.val}
                />
                <StatCard
                    icon={Check}
                    label="Completed"
                    value={stats.completed}
                    color={theme.green9.val}
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

            <HDivider width='100%' />

            <FlatList
                data={data}
                keyExtractor={(item: DeliveryDetail) => item?.delivery?.id!}
                renderItem={({ item }) => <ItemCard data={item} />}
                ItemSeparatorComponent={() => <HDivider />}
                refreshing={isFetching}
                onRefresh={refetch}
            />
        </YStack>
    )
}


export default UserOrders

const StatCard = ({ icon: Icon, label, value, color }: {
    icon: any,
    label: string,
    value: number,
    color: string
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
            <Text
                fontSize={18}
                fontWeight="700"
                color="$text"
            >
                {value}
            </Text>
            <Text
                fontSize={11}
                color="$icon"
                fontFamily="$body"
            >
                {label}
            </Text>
        </YStack>
    </Card>
);








