import { getItemOrders } from '@/api/order'

import HDivider from '@/components/HDivider'
import ItemCard from '@/components/ItemCard'
import LoadingIndicator from '@/components/LoadingIndicator'
import Tabs from '@/components/Tabs'
import { Order } from '@/types/order-types'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Plus } from 'lucide-react-native'
import React, { useState } from 'react'
import { FlatList } from 'react-native'
import { LayoutAnimationConfig } from 'react-native-reanimated'

import { YStack, Text, useTheme, View, Button } from 'tamagui'



const index = () => {


    const theme = useTheme()
    const [selectedIndex, setSelectedIndex] = useState(0)

    const tabs = [
        { label: 'Package', iconName: "package-variant-closed" },
        { label: 'Food', iconName: "food-outline" },
        { label: 'Laundry', iconName: "washing-machine" },
    ]

    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ['item-orders'],
        queryFn: getItemOrders,
        select: (data) => {
            return {
                packages: data?.filter(order => order?.order_type === 'delivery') || [],
                foods: data?.filter(order => order.order_type === 'food') || [],
                laundries: data?.filter(order => order.order_type === 'laundry') || []
            }
        }
    })



    const renderContent = () => {
        const commonFlatListProps = {
            keyExtractor: (item: Order) => item.id,
            ItemSeparatorComponent: () => <HDivider />,
            refreshing: isFetching,
            onRefresh: refetch,
        }

        if (isLoading) {
            return <LoadingIndicator />
        }

        if (error) {
            return <Text color="$red10">Error loading data</Text>
        }

        switch (selectedIndex) {
            case 0:
                return (
                    <View flex={1}>
                        <FlatList
                            {...commonFlatListProps}
                            data={data?.packages}
                            renderItem={({ item }) => <ItemCard data={item} isHomeScreen />}
                        />
                    </View>
                )
            case 1:
                return (
                    <View flex={1}>
                        <FlatList
                            {...commonFlatListProps}
                            data={data?.foods}
                            renderItem={({ item }) => <ItemCard data={item} isHomeScreen />}
                        />
                    </View>
                )
            case 2:
                return (
                    <View flex={1}>
                        <FlatList
                            {...commonFlatListProps}
                            data={data?.laundries}
                            renderItem={({ item }) => <ItemCard data={item} isHomeScreen />}
                        />
                    </View>
                )
        }
    }




    return (
        <YStack backgroundColor={theme.background} flex={1}>

            <Tabs data={tabs} onChange={(index) => setSelectedIndex(index)} selectedIndex={selectedIndex} />

            <LayoutAnimationConfig skipEntering>
                {renderContent()}
            </LayoutAnimationConfig>
            <Button
                onPress={() => router.push({ pathname: '/(app)/(profile)/addRider' })}
                size={'$5'}
                circular
                position='absolute'
                bottom={20}
                right={20}
                pressStyle={{
                    backgroundColor: 'yellow'
                }}
                backgroundColor={'$orange10'}>
                <Plus color={'white'} size={25} />
            </Button>
        </YStack>
    )
}

export default index


