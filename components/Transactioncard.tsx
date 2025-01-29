import { StyleSheet } from 'react-native'
import React from 'react'
import { Card, Circle, Text, View, XStack, YStack } from 'tamagui'
import { ArrowUp } from 'lucide-react-native'

const Transactioncard = () => {
    return (
        <Card unstyled

            width={'90%'} alignSelf='center'
            borderBottomWidth={StyleSheet.hairlineWidth}
            borderBottomColor={'$inputBackground'} borderRadius={0}>
            <XStack padding={'$3'} alignItems='center' justifyContent='space-between'>
                <XStack gap={'$2'} alignItems='center'>
                    <Circle

                        width={'$2'}
                        height={'$2'}
                        backgroundColor={'$success'}>
                        <ArrowUp color={'teal'} size={12} />
                    </Circle>
                    <YStack>
                        <Text fontSize={12} fontWeight={'700'}>Kenmoh Ltd</Text>
                        <Text color={'$icon'} fontSize={10}>29-01-2025</Text>
                    </YStack>
                </XStack>
                <Text fontSize={12} fontWeight={'700'}>₦ 4500</Text>
            </XStack>
        </Card>
    )
}

export default Transactioncard

const styles = StyleSheet.create({})