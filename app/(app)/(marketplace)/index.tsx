import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import {
    YStack,
    XStack,
    Image,
    Text,
    Card,
    Button,
} from 'tamagui';
import { FlatList, Dimensions } from 'react-native';
import { router } from 'expo-router';
interface MarketplaceItem {
    id: string;
    name: string;
    seller: string;
    price: number;
    rating: number;
    image: string;
}

const marketplaceItems: MarketplaceItem[] = [
    {
        id: '1',
        name: 'Professional Cleaning Kit',
        seller: 'CleanPro Supplies',
        price: 49.99,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3'
    },
    {
        id: '2',
        name: 'Industrial Vacuum Cleaner',
        seller: 'Industrial Solutions',
        price: 299.99,
        rating: 5,
        image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?ixlib=rb-4.0.3'
    },
    {
        id: '3',
        name: 'Eco Cleaning Bundle',
        seller: 'Green Clean Co',
        price: 79.99,
        rating: 4,
        image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?ixlib=rb-4.0.3'
    },
    {
        id: '4',
        name: 'Window Cleaning Set',
        seller: 'Crystal Clear',
        price: 34.99,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1596263576925-d90d63691097?ixlib=rb-4.0.3'
    }
];

// ... keep the interface and marketplaceItems array the same ...

export default function Marketplace() {
    const screenWidth = Dimensions.get('window').width;
    const columnWidth = (screenWidth - 30) / 2;

    const renderRatingStars = (rating: number) => {
        return (
            <XStack gap="$1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <AntDesign
                        key={star}
                        name='star'
                        size={10}
                        color={star <= rating ? '#FFD700' : '#D3D3D3'}
                    />
                ))}
            </XStack>
        );
    };

    const renderItem = ({ item }: { item: MarketplaceItem }) => (
        <Card
            key={item.id}
            elevate
            bordered
            onPress={() => router.push({
                pathname: '/[itemId]',
                params: {
                    itemId: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    seller: item.seller,
                    rating: item.rating
                }
            })}
            pressStyle={{ scale: 0.975 }}
            width={columnWidth}
            margin="$2"
            overflow='hidden'

        >

            <Image
                source={{ uri: item.image }}
                width="100%"
                height={120}
                objectFit="cover"
                borderRadius="$0"
            />

            <Card.Footer padded alignSelf='center'>
                <YStack gap="$2">
                    <Text fontSize="$3" fontWeight="bold" numberOfLines={1}>
                        {item.name}
                    </Text>

                    <Text fontSize={10} color="$gray10" numberOfLines={1}>
                        Seller: {item.seller}
                    </Text>

                    <XStack gap={2} justifyContent="space-between" alignItems="center">
                        <Text fontSize="$3" fontWeight="bold" color="$blue10">
                            ₦{item.price.toFixed(2)}
                        </Text>
                        {renderRatingStars(item.rating)}
                    </XStack>

                    <Button
                        alignSelf='center'
                        backgroundColor="$transparentBtnPrimaryColor"
                        color="white"
                        marginTop="$2"
                        size="$3"
                        width={'100%'}
                        borderRadius={'$10'}
                        fontWeight={'700'}
                        fontSize={'$1'}
                    >
                        Buy Now
                    </Button>
                </YStack>
            </Card.Footer>
        </Card>
    );

    return (
        <YStack flex={1} alignSelf='center'>
            {/* <Text fontSize="$6" fontWeight="bold" padding="$4">
                Marketplace
            </Text> */}

            <FlatList
                data={marketplaceItems}
                renderItem={renderItem}
                numColumns={2}

                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 0 }}
                showsVerticalScrollIndicator={false}
            />
        </YStack>
    );
}
