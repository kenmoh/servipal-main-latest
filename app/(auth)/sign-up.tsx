import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import React from 'react'
import { Button, Text, useTheme, View, XStack, YStack, ScrollView } from 'tamagui'
import AppTextInput from '@/components/AppInput'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppSelector from '@/components/AppSelect'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'


const roleData = [
    { id: 1, name: 'Regular User' },
    { id: 2, name: 'Restaurant Service Provider' },
    { id: 3, name: 'Laundry Service Provider' },
    { id: 4, name: 'Dispatch Provider' },
]


const role = [
    'Regular User',
    'Restaurant Service Provider',
    'Laundry Service Provider',
    'Dispatch Provider',
] as const



const schema = z.object({

    email: z.string({ message: 'Email is required.' }).email().trim(),
    phoneNumber: z.string().min(1, { message: 'Phone number is required' }),
    role: z.enum(role),
    password: z.string().min(1, { message: 'Password is required' }),
    confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
}).refine(data => data.password === data.confirmPassword, { message: "Password do not match.", path: ['confirmPassword'] })

type FormData = z.infer<typeof schema>

const SignUp = () => {
    const theme = useTheme()
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            email: '',
            phoneNumber: '',
            role: 'Regular User',
            password: '',
            confirmPassword: ''
        }
    })

    const onSubmit = (data: FormData) => {
        console.log(data)
    }
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
                <View width={'100%'} alignItems='center' alignContent='center' justifyContent='center' backgroundColor={'$background'}>

                    <YStack alignSelf='center' width={'90%'} marginBottom={5} >
                        <Text alignSelf='flex-start' fontFamily={'$heading'} fontSize={24} fontWeight={'bold'}>Let's get you started</Text>
                        <Text alignSelf='flex-start' fontFamily={'$heading'} fontSize={12} fontWeight={'400'}>Create an account</Text>
                    </YStack>
                    <Controller
                        name='email'
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AppTextInput
                                label='Email'

                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.email?.message}
                            />
                        )}
                    />
                    <Controller
                        name='phoneNumber'
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AppTextInput
                                label='Phone'

                                onBlur={onBlur}
                                onChangeText={onChange}
                                keyboardType='phone-pad'
                                value={value}
                                errorMessage={errors.phoneNumber?.message}
                            />
                        )}
                    />
                    <Controller
                        name='role'
                        control={control}
                        render={() => (
                            <AppSelector
                                label='Select user role'
                                items={roleData}
                            />
                        )}
                    />
                    <Controller
                        name='password'
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AppTextInput
                                label={'Password'}
                                onBlur={onBlur}
                                value={value}
                                onChangeText={onChange}
                                secureTextEntry

                                errorMessage={errors.password?.message}
                            />
                        )}
                    />
                    <Controller
                        name='confirmPassword'
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AppTextInput
                                label={'Confirm Password'}
                                onBlur={onBlur}
                                value={value}
                                onChangeText={onChange}
                                secureTextEntry

                                errorMessage={errors.confirmPassword?.message}
                            />
                        )}
                    />




                    <Button
                        backgroundColor={'$btnPrimaryColor'}
                        height={'$5'}
                        width={'90%'}
                        marginTop={40}
                        color={'$text'}
                        fontWeight={'bold'}
                        fontSize={'$5'}
                        fontFamily={'$heading'}
                        onPress={handleSubmit(onSubmit)}
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