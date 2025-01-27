// import { Dimensions, StyleSheet, Animated, FlatList } from 'react-native'
// import { Stack, useLocalSearchParams } from 'expo-router'
// import { Heading, Image, Paragraph, ScrollView, Text, useTheme, View, XStack, YStack } from 'tamagui'
// import { AntDesign, Feather } from '@expo/vector-icons'
// import HDivider from '@/components/HDivider'
// import Category from '@/components/Category'
// import FoodCard from '@/components/FoodCard'
// import { useRef, useState } from 'react'

// const groups = [
//     { id: 1, name: 'Starters' },
//     { id: 2, name: 'Main Course' },
//     { id: 3, name: 'Desserts' },
//     { id: 4, name: 'Others' },
// ];




// const IMAGET_HEIGHT = Dimensions.get('screen').height * 0.2
// const HEADER_HEIGHT = 100
// const CATEGORY_HEIGHT = 20
// const CATEGORY_SCROLL_DISTANCE = Dimensions.get('screen').height * 0.5
// const StoreDetails = () => {
//     const theme = useTheme()
//     const scrollY = useRef(new Animated.Value(0)).current
//     const {
//         companyName,
//         backDrop,
//         openingHour,
//         closingHour,
//         address,
//         rating,
//         reviews
//     } = useLocalSearchParams()



//     return (
//         <View flex={1} backgroundColor={'$background'}>
//             <Stack.Screen options={{
//                 title: `${companyName}`,
//             }}/>

//             <ScrollView
//                 stickyHeaderIndices={[1]}
//                StickyHeaderComponent={()=> <Category categories={groups}/>}
//                 showsVerticalScrollIndicator={false}

//             >
//                 {/* First section - Header content */}
//                 <YStack gap={10}>
//                     <Image src={require('@/assets/images/mkt.png')}
//                         height={IMAGET_HEIGHT}
//                         objectFit='cover'
//                     />
//                     <View>
//                         <Image src={require('@/assets/images/Pizza.jpeg')}
//                             height={65}
//                             width={65}
//                             borderRadius={10}
//                             objectFit='cover'
//                             position='absolute'
//                             top={-35}
//                             left={20}
//                         />
//                     </View>

//                     <YStack marginTop={'$7'} paddingHorizontal={10}>
//                         <Heading
//                             letterSpacing={0}
//                             color={'$text'}
//                             fontSize={22}
//                             fontWeight={'bold'}
//                         >{companyName}</Heading>
//                         <XStack alignItems='center' gap={'$2'}>
//                             <AntDesign name='staro' color={theme.btnPrimaryColor.val} />
//                             <Paragraph color={'$icon'} fontFamily={'$body'} fontSize={'$2'}>{rating}</Paragraph>
//                             <Paragraph color={'$icon'} fontFamily={'$body'} fontSize={'$2'}>( 300 reviews)</Paragraph>
//                         </XStack>
//                         <XStack alignItems='center' gap={'$2'}>
//                             <Feather name='map-pin' color={theme.icon.val} size={12} />
//                             <Paragraph color={'$icon'} fontFamily={'$body'} fontSize={'$2'}>{address}</Paragraph>
//                         </XStack>
//                         <XStack alignItems='center' gap={'$2'}>
//                             <AntDesign name='clockcircleo' color={theme.icon.val} />
//                             <Paragraph color={'$icon'} fontFamily={'$body'} fontSize={'$2'}>{openingHour}</Paragraph>
//                             <Paragraph color={'$icon'} fontFamily={'$body'} fontSize={'$2'}>{closingHour}</Paragraph>
//                         </XStack>
//                     </YStack>
//                     <HDivider />
//                 </YStack>

//                 {/* Second section - Category */}
//                 <Category categories={groups} />

//                 {/* Food Cards */}
//                 <YStack>
//                     <FoodCard />
//                     <FoodCard />
//                     <FoodCard />
//                     <FoodCard />
//                     <FoodCard />
//                     <FoodCard />
//                     <FoodCard />
//                 </YStack>
//             </ScrollView>
//         </View>


//     )
// }

// export default StoreDetails

// const styles = StyleSheet.create({

// })

import { Dimensions, StyleSheet, Animated } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { Heading, Image, Paragraph, ScrollView, Text, useTheme, View, XStack, YStack } from 'tamagui'
import { AntDesign, Feather } from '@expo/vector-icons'
import HDivider from '@/components/HDivider'
import Category from '@/components/Category'
import FoodCard from '@/components/FoodCard'
import { useRef, useState } from 'react'

const groups = [
    { id: 1, name: 'Starters' },
    { id: 2, name: 'Main Course' },
    { id: 3, name: 'Desserts' },
    { id: 4, name: 'Others' },
];

const IMAGET_HEIGHT = Dimensions.get('screen').height * 0.15
const HEADER_HEIGHT = 80


const StoreDetails = () => {
    const theme = useTheme()
    const scrollY = useRef(new Animated.Value(0)).current
    const {
        companyName,
        backDrop,
        openingHour,
        closingHour,
        address,
        rating,
        reviews
    } = useLocalSearchParams()

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, IMAGET_HEIGHT - HEADER_HEIGHT],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    })

    return (
        <View flex={1} backgroundColor={'$background'}>

            <Animated.View
                style={[
                    styles.header,
                    {
                        opacity: headerOpacity,
                        backgroundColor: theme.background.val
                    }
                ]}
            >
                <Heading
                    color={'$text'}
                    fontSize={18}
                    fontWeight={'bold'}
                >{companyName}</Heading>
            </Animated.View>

            <Animated.ScrollView
                stickyHeaderIndices={[1]}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                contentContainerStyle={{
                    paddingTop: HEADER_HEIGHT
                }}
            >

                <YStack gap={10}>
                    <Image src={require('@/assets/images/mkt.png')}
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

                    <YStack marginTop={'$7'} paddingHorizontal={10}>
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
                    <HDivider />
                </YStack>


                <View
                    backgroundColor={'$background'}

                >
                    <Category categories={groups} />
                </View>


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
    }
})