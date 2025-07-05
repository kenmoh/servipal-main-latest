import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Card, Circle, Text, View, XStack, YStack } from 'tamagui'
import { ArrowDown, ArrowUp } from 'lucide-react-native'
import { Transaction } from '@/types/user-types'
import { router } from 'expo-router'

const Transactioncard = ({ data }: { data: Transaction }) => {

    console.log(data)

    // Determine circle and icon color
    let circleBg = data?.transaction_type === 'credit' ? 'rgba(4, 255, 130, 0.1)' : 'rgba(255, 0, 0, 0.2)';
    let iconColor = data?.transaction_type === 'credit' ? 'green' : 'red';
    if (data?.payment_status === 'pending' && data?.transaction_type === 'credit') {
        circleBg = 'rgba(255, 193, 7, 0.2)';
        iconColor = '#FFC107';
    }

    return (
        <TouchableOpacity hitSlop={25} onPress={() => router.push({
            pathname: '/profile/[transactionId]',
            params: {
                transactionId: data?.id,
                amount: data.amount,
                date: data?.created_at,
                status: data?.payment_status,
                paymentBy: data?.payment_by,
                transactionType: data?.transaction_type,
                paymentLink: data?.payment_link
            }
        })} >
            <Card unstyled

                width={'90%'} alignSelf='center'
                borderBottomWidth={StyleSheet.hairlineWidth}
                borderBottomColor={'$inputBackground'} borderRadius={0}>
                <XStack padding={'$3'} alignItems='center' justifyContent='space-between'>
                    <XStack gap={'$2'} alignItems='center'>
                        <Circle

                            width={'$2'}
                            height={'$2'}
                            backgroundColor={circleBg}>
                            {data?.transaction_type === 'credit'
                                ? <ArrowDown color={iconColor} size={14} />
                                : <ArrowUp color={iconColor} size={12} />}
                        </Circle>
                        <YStack>
                            <Text textTransform='capitalize' fontSize={12} fontWeight={'400'}>{data?.payment_by}</Text>
                            <Text color={'$icon'} fontSize={10}>{data?.created_at}</Text>
                        </YStack>
                    </XStack>
                    <Text fontSize={12} fontWeight={'700'}>₦ {Number(data?.amount).toFixed(2)}</Text>
                </XStack>
            </Card>
        </TouchableOpacity>
    )
}

export default Transactioncard

const styles = StyleSheet.create({})