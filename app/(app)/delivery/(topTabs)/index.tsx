import { DeliveryType, fetchDeliveries } from '@/api/order'
import HDivider from '@/components/HDivider'
import ItemCard from '@/components/ItemCard'
import LoadingIndicator from '@/components/LoadingIndicator'
import { DeliveryDetail } from '@/types/order-types'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { FlatList } from 'react-native'
import { YStack, Text, useTheme, View, Select } from 'tamagui'

const DeliveryScreen = () => {
    const theme = useTheme()
    const [selectedType, setSelectedType] = useState<DeliveryType | 'all'>('all')

    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ['deliveries', selectedType],
        queryFn: () => fetchDeliveries({
            deliveryType: selectedType === 'all' ? undefined : selectedType
        }),
        //select: (data) => {
        //     return data?.filter(order => order.order.order_payment_status === 'paid') || []
        // }
    })

    if (isLoading) return <LoadingIndicator />
    if (error) return <Text color="$red10">Error loading data</Text>

    return (
        <YStack backgroundColor={theme.background} flex={1} padding="$2">

            <HDivider width='100%' />

            <FlatList
                data={data}
                keyExtractor={(item: DeliveryDetail) => item.delivery.id}
                renderItem={({ item }) => <ItemCard data={item} isHomeScreen />}
                ItemSeparatorComponent={() => <HDivider />}
                refreshing={isFetching}
                onRefresh={refetch}
            />
        </YStack>
    )
}

export default DeliveryScreen




