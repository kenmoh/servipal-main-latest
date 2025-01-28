import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Card, Heading, Image, Paragraph, Text, Square, useTheme, XStack, YStack } from 'tamagui'

const FoodCard = () => {
    const theme = useTheme()
    return (
        <TouchableOpacity>
            <Card
                bordered
                padded
                width={'95%'}
                alignSelf='center'
                borderWidth={StyleSheet.hairlineWidth}
                borderColor={'$profileCard'}
                marginVertical='$1.5'
                backgroundColor={'$cardBackground'}
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    hitSlop={30}
                    style={{
                        backgroundColor: theme.transparentBtnPrimaryColor.val,
                        width: 30,
                        height: 30,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 50,
                        position: 'absolute',
                        right: 15,
                        top: 12,
                        zIndex: 999

                    }}
                >
                    <Text fontWeight={'bold'} fontSize={20}>+</Text>

                </TouchableOpacity>
                <XStack gap={'$4'}>
                    <Square height={80} width={80} borderRadius={'$3'} overflow='hidden'>
                        <Image src={require('@/assets/images/Burge.jpg')}
                            height={'100%'}
                            width={'100%'}
                            objectFit='cover'
                        />
                    </Square>
                    <YStack width={'70%'}>
                        <Heading fontSize={14} fontWeight={'bold'}>Chicken Burger</Heading>
                        <Paragraph textWrap='wrap' marginTop='1' color={'$icon'} fontSize={12} flexWrap='wrap'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem, commodi.</Paragraph>
                        <Heading marginTop={'$2'} fontSize={14} fontWeight={'bold'}>₦4500</Heading>
                    </YStack>
                </XStack>
            </Card>
        </TouchableOpacity>
    )
}

export default FoodCard

const styles = StyleSheet.create({})