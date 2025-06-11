import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import React from 'react'
import { Notifier, NotifierComponents } from 'react-native-notifier'
import { Button, Text, useTheme, View, XStack, YStack, ScrollView } from 'tamagui'
import AppTextInput from '@/components/AppInput'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Formik } from 'formik'
import * as Yup from 'yup'

import AppPicker from '@/components/AppPicker'
import { useMutation } from '@tanstack/react-query'
import { registerApi } from '@/api/auth'
import { phoneRegEx } from '@/types/user-types'


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


export const validationSchema = Yup.object().shape({
    email: Yup.string().email().trim().required().label("Email"),
    userType: Yup.string().required().label("userType"),
    phoneNumber: Yup.string()
        .required()
        .matches(phoneRegEx, "Enter a valid phone number")
        .max(11)
        .min(10)
        .label("Phone Number"),
    password: Yup.string().required().label("Password").min(8),
    confirmPassword: Yup.string().min(8)
        .oneOf([Yup.ref("password"), null!], "Passwords must match")
        .required()
        .label("Confirm Password"),
});




const SignUp = () => {
    const theme = useTheme()


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

                    <Formik
                        validationSchema={validationSchema}
                        onSubmit={mutate}
                        initialValues={{
                            username: "",
                            email: "",
                            phoneNumber: "",
                            userType: "",
                            confirmPassword: "",
                            password: "",
                        }}
                    >
                        {({ handleChange, handleSubmit, values, touched, errors }) => (
                            <>
                                <AppTextInput

                                    onChangeText={handleChange('email')}
                                    placeholder='Email'
                                    keyboardType='email-address'
                                    value={values.email}
                                    errorMessage={touched.email ? errors.email : undefined}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    autoComplete='off'
                                    editable={!isPending}

                                />
                                <AppTextInput

                                    onChangeText={handleChange('phoneNumber')}
                                    keyboardType='phone-pad'
                                    value={values.phoneNumber}
                                    placeholder='Phone Number'
                                    errorMessage={touched.phoneNumber ? errors.phoneNumber : undefined}
                                    editable={!isPending}

                                />
                                <AppPicker items={roleData} value={values?.userType} onValueChange={handleChange('userType')} />
                                <AppTextInput

                                    value={values.password}
                                    onChangeText={handleChange('password')}
                                    secureTextEntry
                                    placeholder='Password'
                                    errorMessage={touched.password ? errors.password : undefined}
                                    editable={!isPending}

                                />
                                <AppTextInput

                                    value={values.confirmPassword}
                                    onChangeText={handleChange('confirmPassword')}
                                    secureTextEntry
                                    placeholder='Confirm Password'
                                    errorMessage={touched.confirmPassword ? errors.confirmPassword : undefined}
                                    editable={!isPending}

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
                                    onPress={() => handleSubmit()}
                                >  {isPending ? <ActivityIndicator size={'large'} color={theme.text.val} /> : 'Register'}</Button>



                            </>
                        )}

                    </Formik>




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
