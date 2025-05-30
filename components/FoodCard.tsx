import { StyleSheet, Image, Pressable } from 'react-native'

import { MenuItem } from "@/types/item-types";
import React from 'react'
import { Card, Heading, Paragraph, Checkbox, Square, useTheme, XStack, YStack } from 'tamagui'
import { Check } from 'lucide-react-native';

const FoodCard = ({ item, onPress, isChecked }: { item: MenuItem, isChecked: boolean; onPress: (id: string) => void }) => {

    const theme = useTheme()
    return (
        <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]} onPressIn={() => onPress(item.id)}>
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

                <XStack gap={'$4'}>
                    <Square height={80} width={80} borderRadius={'$3'} overflow='hidden'>
                        <Image source={{ uri: item?.images[0].url }}
                            style={{
                                height: '100%',
                                width: '100%'
                            }}
                        // objectFit='cover'
                        />
                    </Square>
                    <YStack width={'70%'}>
                        <Heading fontSize={14} fontWeight={'bold'}>{item.name}</Heading>
                        <Paragraph textWrap='wrap' marginTop='1' color={'$icon'} fontSize={12} flexWrap='wrap'>{item.description}</Paragraph>
                        <Heading marginTop={'$2'} fontSize={14} fontWeight={'bold'}>₦{Number(item.price).toFixed(2)}</Heading>
                    </YStack>
                </XStack>
                <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => onPress(item.id)}
                    position="absolute"
                    right={10}
                    top={10}
                    hitSlop={35}


                >

                    <Checkbox.Indicator>
                        <Check color={theme.btnPrimaryColor.val} />
                    </Checkbox.Indicator>
                </Checkbox>
            </Card>
        </Pressable>
    )
}

export default FoodCard

const styles = StyleSheet.create({})