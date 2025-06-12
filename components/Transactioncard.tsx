import { StyleSheet } from 'react-native'
import React from 'react'
import { Card, Circle, Text, View, XStack, YStack } from 'tamagui'
import { ArrowDown, ArrowUp } from 'lucide-react-native'
import { Transaction } from '@/types/user-types'

const Transactioncard = ({ data }: { data: Transaction }) => {
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
                        backgroundColor={data?.transaction_type === 'credit' ? 'rgba(4, 255, 130, 0.2)' : 'rgba(255, 0, 0, 0.2)'}>
                        {data?.transaction_type === 'credit' ? <ArrowDown color={'green'} size={12} /> : <ArrowUp color={'red'} size={12} />}
                    </Circle>
                    <YStack>
                        <Text textTransform='capitalize' fontSize={12} fontWeight={'400'}>{data?.payment_by}</Text>
                        <Text color={'$icon'} fontSize={10}>{data?.created_at}</Text>
                    </YStack>
                </XStack>
                <Text fontSize={12} fontWeight={'700'}>₦ {Number(data?.amount).toFixed(2)}</Text>
            </XStack>
        </Card>
    )
}

export default Transactioncard

const styles = StyleSheet.create({})