import { Dimensions, StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { Heading, Image, Paragraph, Text, useTheme, View, XStack, YStack } from 'tamagui'
import { AntDesign, Feather } from '@expo/vector-icons'
import HDivider from '@/components/HDivider'
import Category from '@/components/Category'
import FoodCard from '@/components/FoodCard'

const groups = [
    { id: 1, name: 'Starters' },
    { id: 2, name: 'Main Course' },
    { id: 3, name: 'Desserts' },
    { id: 4, name: 'Others' },

];

const IMAGET_HEIGHT = Dimensions.get('screen').height * 0.2
const StoreDetails = () => {
    const theme = useTheme()
    const {
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
                    <View >
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
                    <Category categories={groups} />
                </YStack>
                <FoodCard />

            </View>
        </>
    )
}

export default StoreDetails

const styles = StyleSheet.create({})