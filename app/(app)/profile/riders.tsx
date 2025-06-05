import { FlatList, StyleSheet } from 'react-native'
import React from 'react'
import { Button, useTheme, View } from 'tamagui'
import RiderCard from '@/components/RiderCard'
import { router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { RiderResponse } from '@/types/user-types'
import { getCurrentDispatchRiders } from '@/api/user'
import { useAuth } from '@/context/authContext'


const riders = () => {
    const theme = useTheme()
    const { user } = useAuth()

    const { data, refetch, isFetching } = useQuery({
        queryKey: ['deliveries', user?.sub],
        queryFn: () => getCurrentDispatchRiders(),
    })

    console.log('XXXXXXXXXXXXXXX', data, '==========================')
    return (
        <View backgroundColor={'$background'} flex={1}>

            <FlatList
                data={data ?? []}
                keyExtractor={(item: RiderResponse) => item?.id?.toString()}
                renderItem={({ item }: { item: RiderResponse }) => <RiderCard rider={item} />}
                refreshing={isFetching}
                onRefresh={refetch}
            />




            <Button onPress={() => router.push('/addRider')}>Add Rider</Button>

        </View>
    )
}

export default riders

const styles = StyleSheet.create({})