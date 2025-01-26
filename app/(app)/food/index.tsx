import { StyleSheet, FlatList } from 'react-native'
import React from 'react'
import StoreCard from '@/components/StoreCard'
import { View } from 'tamagui'
import { useQuery } from '@tanstack/react-query'
import { getUsersByMealCategory } from '@/api/user'
import LoadingIndicator from '@/components/LoadingIndicator'

const Page = () => {

    const { data, isPending } = useQuery({
        queryKey: ['restaurants'],
        queryFn: getUsersByMealCategory
    })

    if (isPending) {
        return <LoadingIndicator />
    }

    return (
        <View flex={1} backgroundColor={'$background'}>

            <FlatList
                data={data}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <StoreCard item={item} />}
                contentContainerStyle={{
                    paddingBottom: 10
                }}
            />

        </View>
    )
}

export default Page

const styles = StyleSheet.create({})