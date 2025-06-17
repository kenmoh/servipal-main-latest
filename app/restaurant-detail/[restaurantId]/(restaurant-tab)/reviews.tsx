import { FlatList, Image, StyleSheet } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import { Review } from '@/types/item-types';
import { View, Card, Paragraph, XStack, Text, YStack, Circle } from 'tamagui';
import HDivider from '@/components/HDivider';
import { dummyReviews } from './dummyReviews';
import { Star, CheckCircle2 } from 'lucide-react-native';
import { format } from 'date-fns';

const reviews = () => {
    const { reviews } = useLocalSearchParams();
    const vendorReviews = reviews ? JSON.parse(reviews as string) as Review[] : [];

    return (
        <View backgroundColor={'$background'} flex={1}>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={dummyReviews || []}
                keyExtractor={(item) => item.id}
                renderItem={({ item }: { item: Review }) => <ReviewCard data={item} />}
                contentContainerStyle={{ padding: 16 }}
            />
        </View>
    )
}

export default reviews

const ReviewCard = ({ data }: { data: Review }) => {
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <Star
                key={index}
                size={16}
                fill={index < rating ? "#FFD700" : "transparent"}
                color={index < rating ? "#FFD700" : "#D3D3D3"}
            />
        ));
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return dateString;
        }
    };

    return (
        <Card
            marginVertical={'$2'}
            backgroundColor={'$cardBackground'}
            borderWidth={StyleSheet.hairlineWidth}
            borderColor={'$borderColor'}
            borderRadius={'$4'}
        >
            <Card.Header>
                <XStack alignItems="center" gap={'$3'} marginBottom={'$2'}>
                    <Circle size={40} overflow="hidden">
                        <Image
                            source={{ uri: data.user.profile_image }}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </Circle>
                    <YStack flex={1}>
                        <XStack alignItems="center" gap={'$2'}>
                            <Text
                                fontSize={14}
                                color={'$color'}
                                style={{
                                    fontFamily: 'Poppins-Medium'
                                }}
                            >
                                {data.user.full_name}
                            </Text>
                            <CheckCircle2 size={16} color="#4CAF50" />
                        </XStack>
                        <Text fontSize={12} color={'$gray11'}>
                            {formatDate(data.created_at)}
                        </Text>
                    </YStack>
                </XStack>

                <XStack gap={'$1'} marginBottom={'$2'}>
                    {renderStars(data.rating)}
                </XStack>

                <Paragraph
                    fontSize={12}
                    color={'$color'}
                    lineHeight={20}
                    style={{
                        fontFamily: 'Poppins-Medium'
                    }}
                >
                    {data.comment}
                </Paragraph>
            </Card.Header>
        </Card>
    )
}