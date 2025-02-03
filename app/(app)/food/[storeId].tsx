
import { Dimensions, StyleSheet, View as NativeView } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedScrollHandler, interpolate } from 'react-native-reanimated'
import { router, useLocalSearchParams } from 'expo-router'
import { Button, Heading, Image, Paragraph, ScrollView, Text, useTheme, View, XStack, YStack } from 'tamagui'
import { AntDesign, Feather } from '@expo/vector-icons'
import HDivider from '@/components/HDivider'
import Category from '@/components/Category'
import FoodCard from '@/components/FoodCard'
import { Plus } from 'lucide-react-native'
import AddItemBtn from '@/components/AddItemBtn'

const groups = [
    { id: 1, name: 'Starters' },
    { id: 2, name: 'Main Course' },
    { id: 3, name: 'Desserts' },
    { id: 4, name: 'Others' },
];

const IMAGET_HEIGHT = Dimensions.get('window').height * 0.18
const TOP_SECTION_HEIGHT = Dimensions.get('window').height * 0.40
const HEADER_HEIGHT = 100
const CATEGORY_HEIGHT = 55


const StoreDetails = () => {
    const theme = useTheme()
    const scrollY = useSharedValue(0)
    const {
        companyName,
        backDrop,
        openingHour,
        closingHour,
        address,
        rating,
        reviews
    } = useLocalSearchParams()

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: event => {
            scrollY.value = event.contentOffset.y
        }
    })

    const categoryStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            scrollY.value,
            [0, IMAGET_HEIGHT],
            [0, -IMAGET_HEIGHT],
            'clamp'
        )
        return {
            transform: [{ translateY }],
            position: scrollY.value > TOP_SECTION_HEIGHT ? 'absolute' : 'relative',
            top: scrollY.value > TOP_SECTION_HEIGHT ? 0 : undefined,
            zIndex: scrollY.value > TOP_SECTION_HEIGHT ? 1 : 0
        }
    })
    // const headerStyle = useAnimatedStyle(() => {
    //     const opacity = interpolate(
    //         scrollY.value,
    //         [1, TOP_SECTION_HEIGHT],
    //         [0, 1],
    //         'clamp'
    //     )
    //     return {
    //         opacity
    //     }
    // })

    const headerStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [0, TOP_SECTION_HEIGHT],
            [0, 1],
            'clamp'
        );
        const translateY = interpolate(
            scrollY.value,
            [0, TOP_SECTION_HEIGHT],
            [-HEADER_HEIGHT, 0],
            'clamp'
        );
        return {
            opacity,
            transform: [{ translateY }],
        };
    });

    // Top section scale animation
    const topSectionStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            scrollY.value,
            [0, TOP_SECTION_HEIGHT],
            [1, 0],
            'clamp'
        );
        return {
            transform: [{ scale }],
        };
    });

    return (
        <View flex={1} backgroundColor={'$background'}>

            {/* HEADER SECTION */}

            <Animated.View
                style={[styles.header, {
                    backgroundColor: theme.background.val,
                    width: '100%',
                    zIndex: 1000
                }, headerStyle]}

            >
                <Heading
                    color={'$text'}
                    fontSize={18}
                    fontWeight={'bold'}
                    alignSelf='center'

                >{companyName}</Heading>

            </Animated.View>

            <Animated.ScrollView
                stickyHeaderIndices={[1]}
                showsVerticalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}

            >
                {/* TOP SECTION */}

                <Animated.View style={[{ height: TOP_SECTION_HEIGHT, backgroundColor: theme.cardBackground.val }, topSectionStyle]}>
                    <View gap={10}

                    >
                        <Image src={require('@/assets/images/Burge.jpg')}
                            height={IMAGET_HEIGHT}
                            objectFit='cover'
                        />

                        <View>
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

                        <XStack alignItems='baseline' justifyContent='space-between'>
                            <YStack marginTop={'$7'} paddingHorizontal={10} >
                                <Heading
                                    letterSpacing={0}
                                    color={'$text'}
                                    fontSize={22}
                                    fontWeight={'bold'}
                                >{companyName}</Heading>
                                <XStack alignItems='center' gap={'$2'}>
                                    <AntDesign name='staro' color={theme.btnPrimaryColor.val} />
                                    <Paragraph color={'$icon'} fontFamily={'$body'} fontSize={'$2'}>{rating}</Paragraph>
                                    <Paragraph color={'$icon'} fontFamily={'$body'} fontSize={'$2'}>( 300 reviews)</Paragraph>
                                </XStack>
                                <XStack alignItems='center' gap={'$2'}>
                                    <Feather name='map-pin' color={theme.icon.val} size={12} />
                                    <Paragraph color={'$icon'} fontFamily={'$body'} fontSize={'$2'}>{address}</Paragraph>
                                </XStack>
                                <XStack alignItems='center' gap={'$2'}>
                                    <AntDesign name='clockcircleo' color={theme.icon.val} />
                                    <Paragraph color={'$icon'} fontFamily={'$body'} fontSize={'$2'}>{openingHour}</Paragraph>
                                    <Paragraph color={'$icon'} fontFamily={'$body'} fontSize={'$2'}>{closingHour}</Paragraph>
                                </XStack>
                            </YStack>
                            <AddItemBtn onPress={() => router.push({ pathname: '/(app)/food/addMenu' })} />
                        </XStack>
                        <HDivider />
                    </View>

                </Animated.View>

                {/* CATEGORY */}
                <Animated.View
                    style={[{

                        backgroundColor: theme.cardBackground.val,
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: CATEGORY_HEIGHT,

                    }, categoryStyle]}
                >
                    <Category categories={groups} />
                </Animated.View>


                <YStack>
                    <FoodCard />
                    <FoodCard />
                    <FoodCard />
                    <FoodCard />
                    <FoodCard />
                    <FoodCard />
                    <FoodCard />
                </YStack>
            </Animated.ScrollView>

        </View>
    )
}

export default StoreDetails

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        elevation: 1000,
    },

})


