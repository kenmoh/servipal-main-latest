import { Dimensions, ScrollView, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Button, Heading, Image, Paragraph, Text, useTheme, View, XStack, YStack } from 'tamagui'
import { AntDesign } from '@expo/vector-icons'
import HDivider from '@/components/HDivider'


const IMAGET_HEIGHT = Dimensions.get('screen').height * 0.2
const StoreDetails = () => {
    const theme = useTheme()
    const [activeCategory, setActiveCategory] = useState('Pizza');
    const scrollRef = useRef<ScrollView>(null); const buttonWidth = 100;
    const screenWidth = Dimensions.get('window').width;

    const categories = [
        'Pizza', 'Burger', 'Chicken', 'Salad',
        'Pasta', 'Dessert', 'Drinks', 'Seafood'
    ];


    const scrollToCategory = (index: number) => {
        const offset = index * buttonWidth;
        const centerOffset = (screenWidth - buttonWidth) / 2;

        scrollRef.current?.scrollTo({
            x: Math.max(0, offset - centerOffset),
            animated: true
        });
    };
    const {
        storeId,
        companyName,
        backDrop,
        openingHour,
        closingHour,
        address,
        rating,
        reviews
    } = useLocalSearchParams()


    return (
        <>

            <View backgroundColor={'$background'} flex={1}>
                <YStack gap={10}>
                    <Image src={require('@/assets/images/mkt.png')}
                        height={IMAGET_HEIGHT}
                        objectFit='cover'
                    />
                    <View backgroundColor={'rebeccapurple'}>
                        <Image src={require('@/assets/images/Pizza.jpeg')}
                            height={65}
                            width={65}
                            borderRadius={10}
                            objectFit='cover'
                            position='absolute'
                            top={-35}
                            left={20}
                        />
                    </View>
                    <YStack marginTop={'$7'} paddingHorizontal={10}>

                        <Heading
                            letterSpacing={0}
                            color={'$text'}
                            fontSize={22}
                            fontWeight={'bold'}
                        >{companyName}</Heading>
                        <XStack alignItems='center' gap={'$2'}>
                            <AntDesign name='staro' color={theme.btnPrimaryColor.val} />
                            <Paragraph color={'$text'} fontFamily={'$body'} fontSize={'$2'}>{rating}</Paragraph>
                            <Paragraph color={'$text'} fontFamily={'$body'} fontSize={'$2'}>( 300 reviews)</Paragraph>
                        </XStack>
                        <Paragraph color={'$text'} fontFamily={'$body'} fontSize={'$2'}>{address}</Paragraph>
                    </YStack>
                    <HDivider />
                </YStack>
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 10,
                        gap: 5
                    }}
                >
                    {categories.map((category, index) => (
                        <Button
                            key={category}
                            onPress={() => {
                                setActiveCategory(category);
                                scrollToCategory(index);
                            }}
                            backgroundColor={
                                activeCategory === category
                                    ? '$transparentBtnPrimaryColor'
                                    : '$profileCard'
                            }
                            color={
                                activeCategory === category
                                    ? 'white'
                                    : '$text'
                            }
                            borderRadius="$10"
                            paddingHorizontal="$4"
                            height={'$3'}
                            pressStyle={{
                                scale: 0.97,
                                opacity: 0.9
                            }}
                        >
                            <Text
                                fontSize={14}
                                fontFamily="$body"
                            >
                                {category}
                            </Text>
                        </Button>
                    ))}
                </ScrollView>

            </View>
        </>
    )
}

export default StoreDetails

const styles = StyleSheet.create({})