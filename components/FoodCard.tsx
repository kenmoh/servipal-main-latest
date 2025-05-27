import { StyleSheet, TouchableOpacity, Image } from 'react-native'

import { MenuItem } from "@/types/item-types";
import React from 'react'
import { Card, Heading, Paragraph, Text, Square, useTheme, XStack, YStack } from 'tamagui'

const FoodCard = ({item}: {item: MenuItem}) => {
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
                        <Image source={{uri: item.images[0].url}}
                            height={'100%'}
                            width={'100%'}
                            // objectFit='cover'
                        />
                    </Square>
                    <YStack width={'70%'}>
                        <Heading fontSize={14} fontWeight={'bold'}>{item.name}</Heading>
                        <Paragraph textWrap='wrap' marginTop='1' color={'$icon'} fontSize={12} flexWrap='wrap'>{item.description}</Paragraph>
                        <Heading marginTop={'$2'} fontSize={14} fontWeight={'bold'}>₦{item.price}</Heading>
                    </YStack>
                </XStack>
            </Card>
        </TouchableOpacity>
    )
}

export default FoodCard

const styles = StyleSheet.create({})