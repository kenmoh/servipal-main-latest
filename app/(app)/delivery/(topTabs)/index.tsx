import { DeliveryType, fetchDeliveries } from '@/api/order'
import HDivider from '@/components/HDivider'
import ItemCard from '@/components/ItemCard'
import LoadingIndicator from '@/components/LoadingIndicator'
import { DeliveryDetail } from '@/types/order-types'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { YStack, Text, useTheme, Button } from 'tamagui'
import { RefreshCcw, Send } from "lucide-react-native";
import { router } from "expo-router";

const DeliveryScreen = () => {
    const theme = useTheme()
    const [selectedType, setSelectedType] = useState<DeliveryType | 'all'>('all')

    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ['deliveries', selectedType],
        queryFn: () => fetchDeliveries({
            deliveryType: selectedType === 'all' ? undefined : selectedType
        }),
        // select: (data) => {
        //     return data?.filter(order => order.order.order_payment_status === 'paid') || []
        // }
    })

    if (isLoading) return <LoadingIndicator />
    if (error) {
        return (
            <YStack
                flex={1}
                backgroundColor={theme.background}
                alignItems="center"
                justifyContent="center"
                gap="$4"
            >
                <Text color="$red10" fontSize={16}>
                    Error loading deliveries
                </Text>
                <Button

                    backgroundColor="$btnPrimaryColor"
                    color="$text"
                    size="$4"
                    onPress={() => refetch()}
                    pressStyle={{ opacity: 0.8 }}
                >
                    <RefreshCcw color={theme.text.val} size={20} />
                    Try Again
                </Button>
            </YStack>
        )
    }

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
            <TouchableOpacity
                onPress={() => router.push('/delivery/sendItem')}
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 65,
                    width: 65,
                    borderRadius: 50,
                    backgroundColor: theme.btnPrimaryColor?.val,
                    position: 'absolute',
                    bottom: 10,
                    right: 10
                }}
            >
                <Send color={theme.text?.val} size={25} />
            </TouchableOpacity>
        </YStack>
    )
}

export default DeliveryScreen




