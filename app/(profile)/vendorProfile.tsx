import React from 'react'
import { Button, ScrollView, Text, useTheme, View } from 'tamagui'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { Input } from 'tamagui'
import { zodResolver } from '@hookform/resolvers/zod'
import AppTextInput from '@/components/AppInput'
import { useMutation } from '@tanstack/react-query'
import { updateCurrentVendorUser } from '@/api/user'
import { ActivityIndicator } from 'react-native'
import { useAuth } from '@/context/authContext'
import { Notifier, NotifierComponents } from 'react-native-notifier'
import { router } from 'expo-router'



const schema = z.object({
    companyRegNo: z.string().min(3, { message: 'Company(CAC) registration number is required' }),
    location: z.string().min(3, { message: 'Location is required' }),
    companyName: z.string().min(3, { message: 'Company Name is required' }),
    openingHour: z.string().min(1, { message: 'Opening Hour is required' }),
    closingHour: z.string().min(1, { message: 'Closing Hour is required' }),
    accountNumber: z.string()
        .min(10, { message: 'Account number MUST be a minimum of 10 characters long' })
        .max(10, { message: 'Account number MUST be a maximum of 10 characters long' }),
    bankName: z.string().min(1, { message: 'Bank Name is required' }),
    phoneNumber: z.string().min(1, { message: 'Account Name is required' }),

})
type FormData = z.infer<typeof schema>

const Profile = () => {
    const theme = useTheme()
    const { user } = useAuth()
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            phoneNumber: '',
            companyRegNo: '',
            location: '',
            companyName: '',
            openingHour: '',
            closingHour: '',
            accountNumber: '',
            bankName: '',
        },
        mode: 'onBlur'

    })
    const { isPending, mutate, data } = useMutation({
        mutationFn: updateCurrentVendorUser,
        onSuccess: (data) => {
            console.log(data)
            Notifier.showNotification({
                title: 'Success',
                description: 'Profile Updated.',
                Component: NotifierComponents.Alert,
                duration: 1000,
                componentProps: {
                    alertType: 'success'
                }


            })
            router.back();
            return;
        },
        onError: (error) => {
            console.log(error)
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
        console.log(data)
        mutate(data)
    }

    return (
        <ScrollView flex={1} backgroundColor={'$background'} showsVerticalScrollIndicator={false}>
            <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextInput
                        placeholder='Phone Number'
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        errorMessage={errors.phoneNumber?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="companyRegNo"
                render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextInput
                        placeholder='Company Reg No.'
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        errorMessage={errors.companyRegNo?.message}
                        autoCapitalize='words'
                        autoCorrect={false}
                        autoComplete='off'

                    />
                )}
            />
            <Controller
                control={control}
                name="location"
                render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextInput
                        placeholder='Location'
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        errorMessage={errors.location?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="companyName"
                render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextInput
                        placeholder='Company Name'
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        errorMessage={errors.companyName?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="openingHour"
                render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextInput
                        placeholder='Opening Hour'
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        errorMessage={errors.openingHour?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="closingHour"
                render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextInput
                        placeholder='Closing Hour'
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        errorMessage={errors.closingHour?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="accountNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextInput
                        placeholder='Account Number'
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        keyboardType={'number-pad'}
                        errorMessage={errors.accountNumber?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="bankName"
                render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextInput
                        placeholder='Bank Name'
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        errorMessage={errors.bankName?.message}
                    />
                )}
            />

            <Button style={{
                fontFamily: 'Poppins-Medium',
                textTransform: 'uppercase'
            }}
                marginVertical={'$3'} alignSelf='center'
                disabled={isPending}
                backgroundColor={isPending ? '$cardDark' : '$btnPrimaryColor'}
                width={'90%'} onPress={handleSubmit(onSubmit)}>
                {isPending ? <ActivityIndicator color={theme.icon.val} size={'large'} /> : 'Update Profile'}

            </Button>
        </ScrollView>
    )
}


export default Profile