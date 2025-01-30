import { StyleSheet } from 'react-native'
import React from 'react'
import { Button, ScrollView, Text, View } from 'tamagui'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import AppTextInput from '@/components/AppInput'



const schema = z.object({
    fullName: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
    plateNumber: z.string(),
    password: z.string().nonempty('Company Name is required'),
    confirmPassword: z.string().nonempty('Account Number is required'),

})
type FormData = z.infer<typeof schema>

const AddRider = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur'
    })

    const onSubmit = (data: FormData) => {
        console.log(data)
    }

    return (
        <ScrollView flex={1} backgroundColor={'$background'}>
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
                        errorMessage={errors.phoneNumber?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextInput
                        placeholder='Password'
                        onBlur={onBlur}
                        onChangeText={onChange}
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
                        value={value}
                        errorMessage={errors.confirmPassword?.message}
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


export default AddRider

const styles = StyleSheet.create({})