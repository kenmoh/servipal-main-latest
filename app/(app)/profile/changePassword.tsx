import { StyleSheet } from 'react-native'
import React from 'react'
import { Button, ScrollView, View } from 'tamagui'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import AppTextInput from '@/components/AppInput'



const schema = z.object({
    oldPassword: z.string().min(1, 'Required'),
    newPassword: z.string().min(1, 'Required'),
    confirmPassword: z.string().min(1, 'Required')
}).refine(data => data.newPassword === data.confirmPassword, { message: "Password do not match.", path: ['confirmPassword'] })
type FormData = z.infer<typeof schema>

const ChangePassword = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur'
    })

    const onSubmit = (data: FormData) => {

    }

    return (
        <ScrollView flex={1} backgroundColor={'$background'}>


            <View marginVertical={'$5'}>
                <Controller
                    control={control}
                    name="oldPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            placeholder='Old Password'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry
                            errorMessage={errors.oldPassword?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="newPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            placeholder='New Password'
                            secureTextEntry
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.newPassword?.message}
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


                <Button style={{
                    fontFamily: 'Poppins-Medium',
                    textTransform: 'uppercase'
                }} marginVertical={'$3'} alignSelf='center' backgroundColor={'$btnPrimaryColor'} width={'90%'} onPress={handleSubmit(onSubmit)}>Submit</Button>
            </View>
        </ScrollView>
    )
}


export default ChangePassword

const styles = StyleSheet.create({})