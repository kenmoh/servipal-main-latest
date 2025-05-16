import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import React from 'react'
import { Notifier, NotifierComponents } from 'react-native-notifier'
import { Button, Text, useTheme, View, XStack, YStack, ScrollView } from 'tamagui'
import AppTextInput from '@/components/AppInput'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppSelector from '@/components/AppSelect'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import AppPicker from '@/components/AppPicker'
import { useMutation } from '@tanstack/react-query'
import { registerApi } from '@/api/auth'


const roleData = [
    { id: 1, name: 'customer' },
    { id: 2, name: 'vendor' },
    { id: 4, name: 'dispatch' },
]


const role = [
    'customer',
    'vendor',
    'dispatch',
] as const



const schema = z.object({

    email: z.string({ message: 'Email is required.' }).email().trim(),
    phoneNumber: z.string().min(1, { message: 'Phone number is required' }),
    userType: z.enum(role),
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
            userType: 'customer',
            password: '',
            confirmPassword: ''
        }
    })

    const { mutate, isPending } = useMutation({
        mutationFn: registerApi,
        onSuccess: (data) => {
            Notifier.showNotification({
                title: 'Pending Confirmation',
                description: 'Please confirm your account with the code sent to your email and phone.',
                Component: NotifierComponents.Alert,
                duration: 1000,
                componentProps: {
                    alertType: 'info'
                }


            })
            router.replace('/(auth)/confirm-account');
            return;
        },
        onError: (error) => {
            Notifier.showNotification({
                title: 'Error',
                description: `${error.message}`,
                Component: NotifierComponents.Alert,
                componentProps: {
                    alertType: 'error'
                }
            })
        }
    })


    const onSubmit = (data: FormData) => {
        mutate(data)

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
                                onBlur={onBlur}
                                onChangeText={onChange}
                                placeholder='Email'
                                keyboardType='email-address'
                                value={value}
                                errorMessage={errors.email?.message}
                                autoCapitalize='none'
                                autoCorrect={false}
                                autoComplete='off'
                                editable={!isPending}

                            />
                        )}
                    />
                    <Controller
                        name='phoneNumber'
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AppTextInput
                                onBlur={onBlur}
                                onChangeText={onChange}
                                keyboardType='phone-pad'
                                value={value}
                                placeholder='Phone Number'
                                errorMessage={errors.phoneNumber?.message}
                                editable={!isPending}

                            />
                        )}
                    />


                    <Controller
                        name="userType"
                        control={control}
                        defaultValue="customer"
                        render={({ field: { value, onChange } }) => (
                            <AppPicker items={roleData} value={value} onValueChange={onChange} />
                        )}
                    />

                    <Controller
                        name='password'
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AppTextInput
                                onBlur={onBlur}
                                value={value}
                                onChangeText={onChange}
                                secureTextEntry
                                placeholder='Password'
                                errorMessage={errors.password?.message}
                                editable={!isPending}

                            />
                        )}
                    />
                    <Controller
                        name='confirmPassword'
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AppTextInput
                                onBlur={onBlur}
                                value={value}
                                onChangeText={onChange}
                                secureTextEntry
                                placeholder='Confirm Password'
                                errorMessage={errors.confirmPassword?.message}
                                editable={!isPending}

                            />
                        )}
                    />




                    <Button
                        disabled={isPending}
                        backgroundColor={isPending ? '$cardDark' : '$btnPrimaryColor'}
                        height={'$5'}
                        width={'90%'}
                        marginTop={40}
                        color={'$text'}
                        fontWeight={'bold'}
                        fontSize={'$5'}
                        fontFamily={'$heading'}
                        onPress={handleSubmit(onSubmit)}
                    >  {isPending ? <ActivityIndicator size={'large'} color={theme.text.val} /> : 'Register'}</Button>

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
