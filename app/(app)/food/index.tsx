import React, { useEffect, useState } from 'react'
import { StyleSheet, FlatList, ScrollView, Image } from 'react-native'
import { Card, Heading, Paragraph, XStack, YStack, Text, Separator } from 'tamagui'
import StoreCard from '@/components/StoreCard'
import * as Location from 'expo-location'
import { Button, useTheme, View } from 'tamagui'
import { useQuery } from '@tanstack/react-query'
import { fetchRestaurants } from '@/api/user'
import LoadingIndicator from '@/components/LoadingIndicator'
import { SafeAreaView } from 'react-native-safe-area-context'
import Category from '@/components/Category'
import AppTextInput from '@/components/AppInput'
import AppHeader from '@/components/AppHeader'
import { CompanyProfile } from '@/types/user-types'
import Swiper from 'react-native-swiper'
import { LinearGradient } from 'expo-linear-gradient'
import { getCoordinatesFromAddress } from '@/utils/geocoding'
import { getTravelDistance } from '@/api/order'

export interface RestaurantWithDistance extends CompanyProfile {
    distance: number;
}
export const featuredRestaurants = [
    {
        id: 'f1',
        company_name: 'Burger Palace',
        location: 'Victoria Island, Lagos',
        company_logo: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500',
        rating: 4.8
    },
    {
        id: 'f2',
        company_name: 'Pizza Hub',
        location: 'Lekki Phase 1, Lagos',
        company_logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
        rating: 4.5
    },
    {
        id: 'f3',
        company_name: 'Chicken Republic',
        location: 'Ikeja GRA, Lagos',
        company_logo: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500',
        rating: 4.6
    },
    {
        id: 'f4',
        company_name: 'Mama Kitchen',
        location: 'Ajah, Lagos',
        company_logo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500',
        rating: 4.9
    },
    {
        id: 'f5',
        company_name: 'Seafood Paradise',
        location: 'Victoria Island, Lagos',
        company_logo: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500',
        rating: 4.7
    },
    {
        id: 'f6',
        company_name: 'Suya Express',
        location: 'Ikoyi, Lagos',
        company_logo: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500',
        rating: 4.4
    },
    {
        id: 'f7',
        company_name: 'Rice Bowl',
        location: 'Maryland, Lagos',
        company_logo: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500',
        rating: 4.3
    },
    {
        id: 'f8',
        company_name: 'Pasta Paradise',
        location: 'Yaba, Lagos',
        company_logo: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500',
        rating: 4.6
    },
    {
        id: 'f9',
        company_name: 'Sweet Sensation',
        location: 'Surulere, Lagos',
        company_logo: 'https://images.unsplash.com/photo-1621274403997-37aace184f49?w=500',
        rating: 4.5
    },
    {
        id: 'f10',
        company_name: 'Local Dishes',
        location: 'Ikeja, Lagos',
        company_logo: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500',
        rating: 4.8
    }
];
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
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [filteredRestaurants, setFilteredRestaurants] = useState<(CompanyProfile & { distance: number })[]>([]);
    const [filteredFeatured, setFilteredFeatured] = useState<RestaurantWithDistance[]>([]);
    const { data, isPending } = useQuery({
        queryKey: ['restaurants'],
        queryFn: fetchRestaurants
    })


    // Get user's location
    useEffect(() => {
        const getUserLocation = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            const location = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });
        };

        getUserLocation();
    }, []);




    useEffect(() => {
        const filterRestaurants = async () => {
            if (!data || !userLocation) return;

            const restaurantsWithDistance = await Promise.all(
                data.map(async (restaurant) => {
                    const coordinates = await getCoordinatesFromAddress(restaurant.location);
                    if (!coordinates) return null;

                    const distance = await getTravelDistance(
                        userLocation.latitude,
                        userLocation.longitude,
                        coordinates.lat,
                        coordinates.lng
                    );

                    console.log('DISTANCE', distance)
                    console.log('DISTANCE')

                    if (!distance || distance > 6000) return null;

                    return {
                        ...restaurant,
                        distance
                    } as RestaurantWithDistance;
                })
            );

            const filtered = restaurantsWithDistance
                // .filter(Boolean)
                .filter((item): item is RestaurantWithDistance => item !== null)
                .sort((a, b) => a!.distance - b!.distance);

            setFilteredRestaurants(filtered as (CompanyProfile & { distance: number })[]);
        };

        filterRestaurants();
    }, [data, userLocation]);




    if (isPending) {
        return <LoadingIndicator />
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.val }}>

            <AppHeader component={<AppTextInput height='$3.5' borderRadius={50} placeholder='Search Restaurants..' />} />
            <Separator />

            {/* <Category categories={categories} /> */}

            <FlatList
                // data={data}
                data={filteredRestaurants}
                ListHeaderComponent={() => (
                    <>
                        <Category categories={categories} />
                        <FeaturedRestaurants />
                        {/* <FeaturedRestaurants restaurants={data || []} /> */}
                    </>
                )}
                stickyHeaderIndices={[1]}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={({ item }: { item: CompanyProfile & { distance: number } }) => (
                    <StoreCard item={item} distance={item.distance} screenType='RESTAURANT' />
                )}
                // renderItem={({ item }: { item: CompanyProfile }) => <StoreCard item={item}  />}
                contentContainerStyle={{
                    paddingBottom: 10
                }}
            />



        </SafeAreaView>
    )
}


export default Page

interface FeaturedRestaurantsProps {
    restaurants: CompanyProfile[]
}

export const FeaturedRestaurants = () => {
    const theme = useTheme()

    return (
        <YStack height={220}>
            <XStack
                paddingHorizontal="$4"
                paddingVertical="$2"
                justifyContent="space-between"
                alignItems="center"
            >
                <Heading color="$text" fontSize={16}>Featured Restaurants</Heading>
                {/* <Text color="$btnPrimaryColor" fontSize={12}>See All</Text> */}
            </XStack>

            <Swiper
                autoplay
                autoplayTimeout={3}
                showsPagination={false}
                loop
                height={200}
                showsButtons={false}
                bounces={false}
                removeClippedSubviews={false}
                containerStyle={{ paddingHorizontal: 10 }}
            >
                {featuredRestaurants?.map((restaurant) => (
                    <YStack
                        key={restaurant.id}
                        width="90%"
                        marginHorizontal="$2"
                    >
                        <Card
                            width="100%"
                            height={160}
                            overflow="hidden"
                            backgroundColor="$cardBackground"
                            elevation={3}
                            shadowColor="$shadowColor"
                            shadowOffset={{ width: 0, height: 2 }}
                            shadowOpacity={0.25}
                            shadowRadius={3.84}
                        >
                            <Image
                                source={{ uri: restaurant.company_logo }}
                                style={styles.image}
                            />
                            {/* Gradient overlay for better text visibility */}
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.7)']}
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: 80,
                                }}
                            />
                            <YStack
                                position="absolute"
                                bottom={0}
                                padding="$3"
                                width="100%"
                            >
                                <Heading
                                    fontSize={14}
                                    color="white"
                                    numberOfLines={1}
                                    shadowColor="black"
                                    shadowOffset={{ width: 0, height: 1 }}
                                    shadowOpacity={0.5}
                                    shadowRadius={2}
                                >
                                    {restaurant.company_name}
                                </Heading>
                                <Paragraph
                                    fontSize={12}
                                    color="white"
                                    numberOfLines={1}
                                    marginTop="$1"
                                    opacity={0.9}
                                    shadowColor="black"
                                    shadowOffset={{ width: 0, height: 1 }}
                                    shadowOpacity={0.5}
                                    shadowRadius={2}
                                >
                                    {restaurant.location}
                                </Paragraph>
                            </YStack>
                        </Card>
                    </YStack>
                ))}
            </Swiper>
        </YStack>
    )
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    }
})
