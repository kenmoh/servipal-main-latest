import { StyleSheet } from 'react-native'
import React from 'react'
import { ScrollView, View } from 'tamagui'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import AppTextInput from '@/components/AppInput'
import AppButton from '@/components/AppButton'


const schema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    image: z.instanceof(File),
})

type FormData = z.infer<typeof schema>

const addMenu = () => {

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur'
    })

    const onSubmit = (data: FormData) => {
        console.log(data)
    }
    return (
        <ScrollView backgroundColor={'$background'} flex={1}>
            <View marginTop={'$5'}>

                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            placeholder='Name'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.name?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="price"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            placeholder='Price'
                            onBlur={onBlur}
                            onChangeText={(text) => onChange(Number(text))}
                            value={value?.toString()}
                            keyboardType="numeric"
                            errorMessage={errors.price?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            placeholder='Description'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.description?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="image"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            placeholder='Image'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value instanceof File ? value.name : ''}
                            errorMessage={errors.image?.message}
                        />
                    )}
                />
                <AppButton title='Submit' onPress={handleSubmit(onSubmit)} />
            </View>
        </ScrollView>
    )
}

export default addMenu

const styles = StyleSheet.create({})