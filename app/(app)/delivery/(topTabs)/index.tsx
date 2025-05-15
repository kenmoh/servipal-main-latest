import { getItemOrders } from '@/api/order'

import HDivider from '@/components/HDivider'
import ItemCard from '@/components/ItemCard'
import LoadingIndicator from '@/components/LoadingIndicator'
import Tabs from '@/components/Tabs'
import SelectDemo from '@/components/SelectDemo'
import { Order } from '@/types/order-types'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Plus, Send } from 'lucide-react-native'
import React, { useState } from 'react'
import { FlatList } from 'react-native'
import { LayoutAnimationConfig } from 'react-native-reanimated'
import SegmentedControl from '@react-native-segmented-control/segmented-control';

import { YStack, Text, useTheme, View, Button } from 'tamagui'



const index = () => {

    const theme = useTheme()
    const [selectedIndex, setSelectedIndex] = useState(0)

    const tabs = [
        { label: 'Package', iconName: "package-variant-closed" },
        { label: 'Food', iconName: "food-outline" },
        { label: 'Laundry', iconName: "washing-machine" },
    ]

    const segments = ['Packages', 'Foods', 'Laundries']

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
                        <SelectDemo />
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


            <SegmentedControl
                values={segments}
                selectedIndex={selectedIndex}
                onChange={(event: { nativeEvent: { selectedSegmentIndex: number } }) => {
                    setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
                }}
                style={{ height: 42.5, marginHorizontal: 10 }}
                backgroundColor={theme.background.val}
                tintColor={theme.transparentBtnPrimaryColor.val}



            />
            <HDivider width='100%' />

            <LayoutAnimationConfig skipEntering>
                {renderContent()}
            </LayoutAnimationConfig>

        </YStack>
    )
}

export default index


