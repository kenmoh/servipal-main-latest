import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, } from 'react-native-safe-area-context'
import { View, Text, useTheme, Input, YStack, Button, Image, XStack, ScrollView } from 'tamagui'
import AppTextInput from "@/components/AppInput";
import { router } from 'expo-router';

const SignIn = () => {
    const theme = useTheme()
    return (

        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.background.val }}

        >
            <ScrollView flex={1}
                width={'100%'}
                backgroundColor={'$background'}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    alignItems: 'center',
                    justifyContent: 'center'

                }}
            >


                <View flex={1} width={'100%'} height={'100%'}
                    alignItems='center'
                    alignContent='center'
                    marginTop={100}
                    justifyContent='center'
                    backgroundColor={'$background'} >

                    <YStack alignSelf='center' width={'90%'} marginBottom={10} >
                        <Text alignSelf='flex-start' fontFamily={'$heading'} fontSize={20} fontWeight={'bold'}>Welcome back,</Text>
                        <Text alignSelf='flex-start' fontFamily={'$heading'} fontSize={12} fontWeight={'400'}>Login to continue</Text>
                    </YStack>
                    <AppTextInput label={'Email'} keyboardType='email-address' placeholder='email@example.com' />
                    <AppTextInput label={'Password'} keyboardType='default' secureTextEntry={true} placeholder='password' />
                    <View marginTop={10} width={'90%'} alignSelf='center'>
                        <Text hitSlop={50} alignSelf='flex-end'
                            onPress={() => router.navigate('/sign-up')}
                            fontFamily={'$body'}
                            fontSize={14}
                            color={'$btnPrimaryColor'}
                            textDecorationLine='underline'


                        >Forgot password</Text>
                    </View>
                    <Button
                        backgroundColor={'$btnPrimaryColor'}
                        height={'$5'}
                        width={'90%'}
                        marginTop={40}
                        color={'$text'}
                        fontWeight={'bold'}
                        fontSize={'$5'}
                        fontFamily={'$heading'}
                        textAlign='center'
                    >Login</Button>

                    <XStack alignSelf='center' marginTop={25} alignItems='center' justifyContent='center' width={'90%'} marginBottom={30} >
                        <Text color={'$text'} fontFamily={'$body'} fontSize={14} >Don't have an account? </Text>
                        <Text hitSlop={50} onPress={() => router.navigate('/sign-up')} fontFamily={'$body'} fontSize={14} color={'$btnPrimaryColor'} textDecorationLine='underline'>Register</Text>
                    </XStack>
                </View>
            </ScrollView>
        </SafeAreaView>

    )
}

export default SignIn

