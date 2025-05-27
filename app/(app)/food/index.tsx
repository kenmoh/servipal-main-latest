import { StyleSheet, FlatList } from 'react-native'
import React from 'react'
import StoreCard from '@/components/StoreCard'
import { Button, useTheme, View } from 'tamagui'
import { useQuery } from '@tanstack/react-query'
import { fetchRestaurants } from '@/api/user'
import LoadingIndicator from '@/components/LoadingIndicator'
import { SafeAreaView } from 'react-native-safe-area-context'
import Category from '@/components/Category'
import AppTextInput from '@/components/AppInput'
import AppHeader from '@/components/AppHeader'
import { CompanyProfile } from '@/types/user-types'

const categories = [
    { id: 1, name: 'Pizza' },
    { id: 2, name: 'Burger' },
    { id: 3, name: 'Chicken' },
    { id: 4, name: 'Salad' },
    { id: 5, name: 'Pasta' },
    { id: 6, name: 'Dessert' },
    { id: 7, name: 'Drinks' },
    { id: 8, name: 'Seafood' }
];
const Page = () => {
    const theme = useTheme()

    const { data, isPending } = useQuery({
        queryKey: ['restaurants'],
        queryFn: fetchRestaurants
    })

    console.log(data)

    if (isPending) {
        return <LoadingIndicator />
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.val }}>

            <AppHeader component={<AppTextInput height='$3.5' borderRadius={50} />} />

            <Category categories={categories} />

            <FlatList
                data={data}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={({ item }: { item: CompanyProfile }) => <StoreCard item={item} />}
                contentContainerStyle={{
                    paddingBottom: 10
                }}
            />



        </SafeAreaView>
    )
}

export default Page

const styles = StyleSheet.create({})