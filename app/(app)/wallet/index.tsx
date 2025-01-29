import { StyleSheet, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Card, Heading, View, XStack } from 'tamagui'
import { ArrowDown, ArrowUp } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Transactioncard from '@/components/Transactioncard';


const index = () => {
    return (
        <View flex={1} backgroundColor={'$background'}>
            <Animated.View
                entering={FadeInUp.duration(300).delay(300)}
            >
                <Card width={'90%'} borderRadius={10} alignSelf='center' overflow='hidden'>
                    <LinearGradient
                        colors={['#f46b45', '#eea849']}
                        style={styles.background}
                        start={[0, 0]} end={[1, 0]}

                    >
                        <Card.Header >
                            <Text style={{
                                color: 'white',
                                fontFamily: 'Poppins-Regular',
                                fontSize: 14,

                            }}>Balance</Text>
                            <XStack alignItems='baseline' gap={'$0.5'}>
                                <Text style={{ color: 'white', fontFamily: 'Poppins-Medium', fontSize: 22 }}>₦</Text>
                                <Text style={{ color: 'white', fontFamily: 'Poppins-Bold', fontSize: 32 }}>4500</Text>
                            </XStack>
                            <Text style={{
                                color: 'white',
                                fontFamily: 'Poppins-Regular',
                                fontSize: 14,

                            }}>Account Number: 0090998877</Text>
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

            <Transactioncard />
            <Transactioncard />
            <Transactioncard />
            <Transactioncard />

        </View>
    )
}

export default index

const styles = StyleSheet.create({
    background: {
        height: 125,
    },
})