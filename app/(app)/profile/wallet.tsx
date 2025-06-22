import { StyleSheet, Text, FlatList } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Card, Heading, View, XStack, YStack } from 'tamagui'
import { ArrowDown, ArrowUp, Eye, EyeOff } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Transactioncard from '@/components/Transactioncard';
import HDivider from "@/components/HDivider";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/authContext';
import { getCurrentUserWallet } from '@/api/user';
import { useState } from 'react';
import { formatCurrency } from '@/utils/formatCurrency';
import { Transaction } from '@/types/user-types'


const index = () => {
    const { user, profile } = useAuth()
    const [isBalanceHidden, setIsBalanceHidden] = useState(false);

    const { data, isFetching, refetch } = useQuery({
        queryKey: ['wallet', user?.sub],
        queryFn: getCurrentUserWallet

    })

    console.log(data)

    return (
        <View flex={1} backgroundColor={'$background'}>
            <Animated.View
                entering={FadeInUp.duration(300).delay(300)}
            >
                <Card
                    width={'90%'}
                    borderRadius={15}
                    alignSelf='center'
                    overflow='hidden'
                    elevation={5}

                >
                    <LinearGradient
                        colors={['#f46b45', '#eea849']}
                        style={[styles.background]}
                        start={[0, 0]}
                        end={[1, 0]}
                    >
                        <Card.Header padding="$4">
                            <XStack justifyContent='space-between' alignItems='center' marginBottom="$5">
                                <YStack>
                                    <XStack alignItems='center' gap="$2">
                                        <Text style={styles.label}>Main Balance</Text>
                                        <Button
                                            unstyled
                                            onPress={() => setIsBalanceHidden(!isBalanceHidden)}
                                            icon={isBalanceHidden ?
                                                <Eye color="white" size={16} /> :
                                                <EyeOff color="white" size={16} />
                                            }
                                        />
                                    </XStack>
                                    <XStack alignItems='baseline' gap={'$1'} marginTop="$2">
                                        <Text style={styles.currency}>₦</Text>
                                        <Text style={styles.amount}>
                                            {isBalanceHidden ? '****' : formatCurrency(data?.balance || 0)}
                                        </Text>
                                    </XStack>
                                </YStack>
                                <YStack>

                                    <Text style={[styles.label]}>Escrow Balance</Text>
                                    <XStack alignItems='baseline' gap={'$1'} marginTop="$2">
                                        <Text style={[styles.currency, { fontFamily: "Poppins-Thin" }]}>₦</Text>
                                        <Text style={[styles.amount, { fontFamily: "Poppins-Thin" }]}>
                                            {isBalanceHidden ? '****' : formatCurrency(data?.escrow_balance || 0)}
                                        </Text>
                                    </XStack>
                                </YStack>


                            </XStack>

                            <YStack gap="$2">
                                {profile?.profile?.bank_account_number &&
                                    <Text style={styles.accountInfo}>
                                        Account Number: {profile?.profile?.bank_account_number}
                                    </Text>}
                                {profile?.profile?.bank_name || profile?.profile?.business_name &&
                                    <Text style={styles.accountInfo}>
                                        Name: {profile?.profile?.full_name || profile?.profile.business_name}
                                    </Text>}
                            </YStack>
                        </Card.Header>
                    </LinearGradient>
                </Card>

            </Animated.View>
            <Animated.View entering={FadeInUp.duration(500).delay(400)}>
                <XStack width={'90%'} alignSelf='center' gap={'4%'} marginTop={'$3'}>
                    <Button fontSize={'$2'} fontWeight={'600'} icon={<ArrowDown />} width={'48%'} backgroundColor={'$transparentBtnPrimaryColor'}>Withdraw</Button>
                    <Button fontSize={'$2'} fontWeight={'600'} icon={<ArrowUp />} width={'48%'} borderWidth={StyleSheet.hairlineWidth} borderColor={'$btnPrimaryColor'}>Deposit</Button>
                </XStack>
            </Animated.View>

            <View width={'90%'} alignSelf='center' marginVertical={'$4'}>
                <Heading fontSize={'$4'}>Transactions</Heading>
            </View>

            <FlatList
                data={data?.transactions || []}
                keyExtractor={(item: Transaction) => item?.id!}
                renderItem={({ item }) => <Transactioncard data={item} />}
                refreshing={isFetching}
                onRefresh={refetch}
            />

        </View>
    )
}

export default index

const styles = StyleSheet.create({
    background: {
        height: 185,
        position: 'relative',
    },
    label: {
        color: 'white',
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        opacity: 0.9,
    },
    currency: {
        color: 'white',
        fontFamily: 'Poppins-Medium',
        fontSize: 22,
    },
    currencySmall: {
        color: 'white',
        fontFamily: 'Poppins-Medium',
        fontSize: 18,
    },
    amount: {
        color: 'white',
        fontFamily: 'Poppins-Bold',
        fontSize: 22,
    },
    amountSmall: {
        color: 'white',
        fontFamily: 'Poppins-Bold',
        fontSize: 22,
    },
    accountInfo: {
        color: 'white',
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        opacity: 0.9,
        textTransform: 'capitalize'
    }
});