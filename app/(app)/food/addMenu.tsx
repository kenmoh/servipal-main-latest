import { StyleSheet } from 'react-native'
import React from 'react'
import { ScrollView, View, Button } from 'tamagui'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import AppTextInput from '@/components/AppInput'
import AppButton from '@/components/AppButton'
import ImagePickerInput from '@/components/AppImagePicker'


const schema = z.object({
    name: z.string().min(1, 'Name is a required field'),
    description: z.string().min(1, "Description is a required field"),
    price: z.number().int().gt(0, 'Price MUST be greater than 0').lte(999999),
    image: z.any().nullable().refine(val => val != null, {
        message: "Image is required"
    })
})


type FormData = z.infer<typeof schema>

const addMenu = () => {

    const { control, handleSubmit,
        formState: { errors } } = useForm<FormData>({
            resolver: zodResolver(schema),
            mode: 'onBlur',
            defaultValues: {
                name: '',
                description: '',
                price: 0,
                image: null
            }
        })

    const onSubmit = (data: FormData) => {
        console.log(data)
    }
    // const selectedImage = watch('image') as ImageType | null

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
                            placeholder='Description.'
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
                    render={({ field: { onChange, value } }) => (
                        <ImagePickerInput
                            value={value}
                            onChange={onChange}
                            errorMessage={errors.image?.message?.toString()}
                        />
                    )}
                />
                <Button style={{
                    fontFamily: 'Poppins-Medium',
                    textTransform: 'uppercase'
                }}
                    marginVertical={'$3'} alignSelf='center'
                    backgroundColor={'$btnPrimaryColor'}
                    width={'90%'} onPress={handleSubmit(onSubmit)}>Submit</Button>
            </View>
        </ScrollView>
    )
}

export default addMenu

const styles = StyleSheet.create({})
