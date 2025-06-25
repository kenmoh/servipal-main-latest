import { FlatList } from 'react-native'
import React from 'react'
import { View } from 'tamagui'
import RiderCard from '@/components/RiderCard'
import EmptyList from '@/components/EmptyList'
import { useQuery } from '@tanstack/react-query'
import { RiderResponse } from '@/types/user-types'
import { getCurrentDispatchRiders } from '@/api/user'
import { useAuth } from '@/context/authContext'
import LoadingIndicator from '@/components/LoadingIndicator'
import FAB from '@/components/FAB'
import { router } from 'expo-router'
import { UserPlus2 } from 'lucide-react-native'


const riders = () => {

    const { user } = useAuth()

    const { data, refetch, isFetching } = useQuery({
        queryKey: ['riders', user?.sub],
        queryFn: () => getCurrentDispatchRiders(),
    })

    console.log(data)


    if (isFetching) return <LoadingIndicator />

    return (
        <View backgroundColor={'$background'} flex={1}>

            {

                !isFetching && data?.length === 0 && <EmptyList
                    title="No Riders Yet"
                    description="Add your first dispatch rider to start managing deliveries efficiently"
                    buttonTitle="Add New Rider"
                    route="/profile/addRider"
                />
            }
            <FlatList
                data={data ?? []}
                keyExtractor={(item: RiderResponse) => item?.id?.toString()}
                renderItem={({ item }: { item: RiderResponse }) => <RiderCard rider={item} />}
                refreshing={isFetching}
                onRefresh={refetch}

            />
            {data && data?.length > 0 && <FAB icon={<UserPlus2 color={'white'} />} onPress={() => router.push({ pathname: "/profile/addRider" })} />}

        </View>
    )
}

export default riders



