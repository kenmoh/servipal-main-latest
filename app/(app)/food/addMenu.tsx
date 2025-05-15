import { StyleSheet } from 'react-native'
import React from 'react'
import { ScrollView, View, Button } from 'tamagui'
import { number, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import AppTextInput from '@/components/AppInput'
import ImagePickerInput from '@/components/AppImagePicker'
import AppPicker from '@/components/AppPicker'


const schema = z.object({
    name: z.string().min(1, 'Name is a required field'),
    price: z.number().int().gt(0, 'Price MUST be greater than 0').lte(999999),
    ingredients: z.string().min(1, "Ingredients is a required field"),
    category: z.string({ message: 'Category is a required field' }),
    side: z.string().optional(),
    image: z.any().nullable().refine(val => val != null, {
        message: "Image is required"
    })
})


type FormData = z.infer<typeof schema>

const categories = [
    { id: 1, name: 'Burger' },
    { id: 2, name: 'Sandwiches' },
    { id: 3, name: 'Steak' },
    { id: 4, name: 'Pizza' },
    { id: 5, name: 'Soup' },
    { id: 6, name: 'Chicken' },
    { id: 7, name: 'Others' },
]

const addMenu = () => {

    const { control, handleSubmit,
        formState: { errors } } = useForm<FormData>({
            resolver: zodResolver(schema),
            mode: 'onBlur',
            defaultValues: {
                name: '',
                ingredients: '',
                price: 0,
                image: null,
                category: '',
                side: ''
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
                    name="ingredients"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            placeholder='Ingredients'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.ingredients?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="category"
                    render={({ field: { onChange, value } }) => (
                        <AppPicker items={categories} onValueChange={onChange} value={value} />
                    )}
                />
                <Controller
                    control={control}
                    name="side"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            placeholder='Side'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.side?.message}
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
