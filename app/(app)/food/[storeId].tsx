import { Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Heading, Image, Paragraph, useTheme, View, XStack, YStack } from 'tamagui'
import { AntDesign } from '@expo/vector-icons'
import HDivider from '@/components/HDivider'


const IMAGET_HEIGHT = Dimensions.get('screen').height * 0.2
const StoreDetails = () => {
    const theme = useTheme()
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
            </View>
        </>
    )
}

export default StoreDetails

const styles = StyleSheet.create({})