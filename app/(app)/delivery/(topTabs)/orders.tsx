import { DeliveryType, fetchDeliveries } from '@/api/order'
import HDivider from '@/components/HDivider'
import ItemCard from '@/components/ItemCard'
import LoadingIndicator from '@/components/LoadingIndicator'
import { useAuth } from '@/context/authContext'
import { DeliveryDetail } from '@/types/order-types'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { FlatList } from 'react-native'
import { YStack, Text, useTheme } from 'tamagui'

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
                order.delivery.sender_id === user.sub ||
                order.delivery.vendor_id === user.sub ||
                order.delivery.dispatch_id === user.sub ||
                order.delivery.rider_id === user.sub
            );
        },
        enabled: !!user?.sub // Only fetch when user ID is available
    })

    if (isLoading) return <LoadingIndicator />
    if (error) return <Text color="$red10">Error loading data</Text>

    return (
        <YStack backgroundColor={theme.background} flex={1} padding="$2">

            <HDivider width='100%' />

            <FlatList
                data={data}
                keyExtractor={(item: DeliveryDetail) => item.delivery.id}
                renderItem={({ item }) => <ItemCard data={item} />}
                ItemSeparatorComponent={() => <HDivider />}
                refreshing={isFetching}
                onRefresh={refetch}
            />
        </YStack>
    )
}

export default UserOrders







