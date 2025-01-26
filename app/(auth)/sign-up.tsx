import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import React from 'react'
import { Button, Text, useTheme, View, XStack, YStack, ScrollView } from 'tamagui'
import AppTextInput from '@/components/AppInput'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppSelector from '@/components/AppSelect'


const roleData = [
    { id: 1, name: 'Regular User' },
    { id: 2, name: 'Restaurant Service Provider' },
    { id: 3, name: 'Laundry Service Provider' },
    { id: 4, name: 'Dispatch Provider' },
]

const SignUp = () => {
    const theme = useTheme()
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.background.val }}

        >

            <ScrollView
                flex={1}
                width={'100%'}
                backgroundColor={'$background'}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    alignItems: 'center',
                    justifyContent: 'center'

                }}

            >
                <View width={'100%'} marginTop={40} alignItems='center' alignContent='center' justifyContent='center' backgroundColor={'$background'}>

                    <YStack alignSelf='center' width={'90%'} marginBottom={5} >
                        <Text alignSelf='flex-start' fontFamily={'$heading'} fontSize={24} fontWeight={'bold'}>Let's get you started</Text>
                        <Text alignSelf='flex-start' fontFamily={'$heading'} fontSize={12} fontWeight={'400'}>Create an account</Text>
                    </YStack>
                    <AppTextInput label={'Email'} keyboardType='email-address' placeholder='email@example.com' />
                    <AppTextInput label={'Phone'} keyboardType='phone-pad' placeholder='08077665544' />
                    <AppSelector label='Select user role' items={roleData} />
                    <AppTextInput label={'Password'} keyboardType='default' secureTextEntry={true} placeholder='password' />
                    <AppTextInput label={'Confirm Password'} keyboardType='default' secureTextEntry={true} placeholder='password' />
                    <Button
                        backgroundColor={'$btnPrimaryColor'}
                        height={'$5'}
                        width={'90%'}
                        marginTop={40}
                        color={'$text'}
                        fontWeight={'bold'}
                        fontSize={'$5'}
                        fontFamily={'$heading'}
                    >Login</Button>

                    <XStack alignSelf='center' marginTop={25} alignItems='center' justifyContent='center' width={'90%'} marginBottom={30} >
                        <Text color={'$text'} fontFamily={'$body'} fontSize={14} >Already have an account? </Text>
                        <Text hitSlop={50} onPress={() => router.navigate('/sign-in')} fontFamily={'$body'} fontSize={14} color={'$btnPrimaryColor'} textDecorationLine='underline'>Login</Text>
                    </XStack>
                </View>
            </ScrollView>
        </SafeAreaView>

    )
}

export default SignUp

const styles = StyleSheet.create({})