import { FlatList, StyleSheet, Text } from 'react-native'
import React from 'react'
import { Button, useTheme, View, XStack } from 'tamagui'
import RiderCard from '@/components/RiderCard'
import { Link, router, Stack } from 'expo-router'
import { Plus } from 'lucide-react-native'
import { useQuery } from '@tanstack/react-query'
import { RiderResponse } from '@/types/user-types'
import { getCurrentDispatchRiders } from '@/api/user'
import { useAuth } from '@/context/authContext'


const riders = () => {
    const theme = useTheme()
    const { user } = useAuth()

    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ['deliveries', user?.sub],
        queryFn: () => getCurrentDispatchRiders(),
    })
    return (
        <View backgroundColor={'$background'} flex={1}>

            <FlatList
                data={data ?? []}
                keyExtractor={(item: RiderResponse) => item.id}
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