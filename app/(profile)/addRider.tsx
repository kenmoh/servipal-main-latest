import { StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { Button, ScrollView, Text, View } from 'tamagui'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import AppTextInput from '@/components/AppInput'
import { useMutation } from "@tanstack/react-query";
import { registerRiderApi } from "@/api/auth";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { RiderResponse } from '@/types/user-types'



const schema = z.object({
    fullName: z.string().min(1, 'Name is required'),
    email: z.string({ message: 'Email is required.' }).email().trim(),
    phoneNumber: z.string().min(1, { message: 'Phone number is required' }),
    plateNumber: z.string().min(1, { message: 'Plate number is required' }),
    password: z.string().min(1, { message: 'Password is required' }),
    confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
}).refine(data => data.password === data.confirmPassword, { message: "Password do not match.", path: ['confirmPassword'] })

const editSchema = z.object({
    fullName: z.string().min(1, 'Name is required'),
    email: z.string({ message: 'Email is required.' }).email().trim(),
    phoneNumber: z.string().min(1, { message: 'Phone number is required' }),
    plateNumber: z.string().min(1, { message: 'Plate number is required' }),
})

type FormData = z.infer<typeof schema>

const AddRider = () => {
    const { riderParams, isEditing } = useLocalSearchParams()
    const rider = JSON.parse(riderParams as string) as RiderResponse


    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            fullName: rider?.full_name || '',
            email: rider?.email || '',
            phoneNumber: '',
            plateNumber: '',
            password: '',
            confirmPassword: ''
        }
    })



    const { mutate } = useMutation({
        mutationFn: registerRiderApi,
        onSuccess: (data) => {
            Notifier.showNotification({
                title: 'Rider Added(Pending Confirmation)',
                description: 'Rider added success. Ride should confirm account with the code send to email and phone',
                Component: NotifierComponents.Alert,
                duration: 1000,
                componentProps: {
                    alertType: 'info'
                }


            })
            router.push('/profile/riders')
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
        <>
            <Stack.Screen options={{ title: isEditing ? 'Edit Rider' : 'Add Rider' }} />
            <ScrollView flex={1} backgroundColor={'$background'} showsVerticalScrollIndicator={false}>
                <Controller
                    control={control}
                    name="fullName"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            placeholder='Full Name'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.fullName?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            placeholder='Email'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.email?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            placeholder='Phone Number'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType={'number-pad'}
                            errorMessage={errors.phoneNumber?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="plateNumber"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            placeholder='Plate Number'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.plateNumber?.message}
                        />
                    )}
                />
                {!isEditing && <>

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AppTextInput
                                placeholder='Password'
                                onBlur={onBlur}
                                onChangeText={onChange}
                                secureTextEntry
                                value={value}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="confirmPassword"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AppTextInput
                                placeholder='Confirm Password'
                                onBlur={onBlur}
                                onChangeText={onChange}
                                secureTextEntry
                                value={value}
                                errorMessage={errors.confirmPassword?.message}
                            />
                        )}
                    />
                </>}


                <Button
                    style={{
                        fontFamily: 'Poppins-Medium',
                        textTransform: 'uppercase'
                    }} marginVertical={'$3'}
                    alignSelf='center'
                    backgroundColor={'$btnPrimaryColor'}
                    width={'90%'} onPress={handleSubmit(onSubmit)}>Submit</Button>
            </ScrollView>
        </>
    )
}


export default AddRider

const styles = StyleSheet.create({})