import { StyleSheet } from 'react-native'
import React from 'react'
import { Button, ScrollView, Text, View } from 'tamagui'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import AppTextInput from '@/components/AppInput'



const schema = z.object({
    companyRegNo: z.string().nonempty('Company Reg No. is required'),
    location: z.string().nonempty('Location is required'),
    companyName: z.string().nonempty('Company Name is required'),
    openingHour: z.string().nonempty('Opening Hour is required'),
    closingHour: z.string().nonempty('Closing Hour is required'),
    accountNumber: z.string().nonempty('Account Number is required'),
    bankName: z.string().nonempty('Bank Name is required'),
    accountName: z.string().nonempty('Account Name is required'),
    // image: z.instanceof(File).optional()
})
type FormData = z.infer<typeof schema>

const Profile = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur' // Validate on blur instead of on change
    })

    const onSubmit = (data: FormData) => {
        console.log(data)
    }

    return (
        <ScrollView flex={1} backgroundColor={'$background'} showsVerticalScrollIndicator={false}>
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
            <Controller
                control={control}
                name="accountName"
                render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextInput
                        placeholder='Account Name'
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        errorMessage={errors.accountName?.message}
                    />
                )}
            />
            <Button style={{
                fontFamily: 'Poppins-Medium',
                textTransform: 'uppercase'
            }} marginVertical={'$3'} alignSelf='center' backgroundColor={'$btnPrimaryColor'} width={'90%'} onPress={handleSubmit(onSubmit)}>Submit</Button>
        </ScrollView>
    )
}


export default Profile

const styles = StyleSheet.create({})