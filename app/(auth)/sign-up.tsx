import { ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'
import { Notifier, NotifierComponents } from 'react-native-notifier'
import { Button, Text, useTheme, View, XStack, YStack } from 'tamagui'
import AppTextInput from '@/components/AppInput'
import { router } from 'expo-router'

import AppPicker from '@/components/AppPicker'
import { useMutation } from '@tanstack/react-query'
import { registerApi } from '@/api/auth'
import { phoneRegEx } from '@/types/user-types'
import authStorage from "@/storage/authStorage"
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

// RHF & Zod imports
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const roleData = [
    { id: 'customer', name: 'Customer' },
    { id: 'restaurant_vendor', name: 'Restaurant Service' },
    { id: 'laundry_vendor', name: 'Laundry Service' },
    { id: 'dispatch', name: 'Dispatch Service' },
]

const signUpSchema = z.object({
    email: z.string().email().trim().nonempty('Email is required'),
    userType: z.string().nonempty('User type is required'),
    phoneNumber: z.string()
        .regex(phoneRegEx, 'Enter a valid phone number')
        .min(10, 'Phone number must be at least 10 digits')
        .max(11, 'Phone number must be at most 11 digits'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm Password is required'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUp = () => {
    const theme = useTheme()

    const { control, handleSubmit, formState: { errors }, watch } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: '',
            userType: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: registerApi,
        onSuccess: (data) => {
            authStorage.storeEmail(data.email);
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

    const onSubmit = (values: SignUpFormValues) => {
        mutate(values)
    }

    return (
        <KeyboardAwareScrollView>
            <View width={'100%'} alignItems='center' alignContent='center' justifyContent='center' backgroundColor={'$background'}>
                <YStack alignSelf='center' width={'90%'} marginBottom={5} >
                    <Text alignSelf='flex-start' fontFamily={'$heading'} fontSize={24} fontWeight={'bold'}>Let's get you started</Text>
                    <Text alignSelf='flex-start' fontFamily={'$heading'} fontSize={12} fontWeight={'400'}>Create an account</Text>
                </YStack>
                <View width={'100%'}>
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value, onBlur } }) => (
                            <AppTextInput
                                onChangeText={onChange}
                                onBlur={onBlur}
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
                        control={control}
                        name="phoneNumber"
                        render={({ field: { onChange, value, onBlur } }) => (
                            <AppTextInput
                                onChangeText={onChange}
                                onBlur={onBlur}
                                keyboardType='phone-pad'
                                value={value}
                                placeholder='Phone Number'
                                errorMessage={errors.phoneNumber?.message}
                                editable={!isPending}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="userType"
                        render={({ field: { onChange, value } }) => (
                            <AppPicker
                                items={roleData}
                                isBank={false}
                                value={value}
                                onValueChange={onChange}

                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value, onBlur } }) => (
                            <AppTextInput
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                secureTextEntry
                                showPasswordToggle
                                placeholder='Password'
                                errorMessage={errors.password?.message}
                                editable={!isPending}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="confirmPassword"
                        render={({ field: { onChange, value, onBlur } }) => (
                            <AppTextInput
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                secureTextEntry
                                showPasswordToggle
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
                        alignSelf='center'
                        fontFamily={'$heading'}
                        onPress={handleSubmit(onSubmit)}
                    >  {isPending ? <ActivityIndicator size={'large'} color={theme.text.val} /> : 'Register'}</Button>
                </View>
                <XStack alignSelf='center' marginTop={25} alignItems='center' justifyContent='center' width={'90%'} marginBottom={30} >
                    <Text color={'$text'} fontFamily={'$body'} fontSize={14} >Already have an account? </Text>
                    <Text hitSlop={50} onPress={() => router.navigate('/sign-in')} fontFamily={'$body'} fontSize={14} color={'$btnPrimaryColor'} textDecorationLine='underline'>Login</Text>
                </XStack>
            </View>
        </KeyboardAwareScrollView>
        // </ScrollView>


    )
}

export default SignUp

const styles = StyleSheet.create({})
