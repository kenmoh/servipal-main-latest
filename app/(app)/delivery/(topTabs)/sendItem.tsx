import { StyleSheet } from 'react-native'
import React from 'react'
import { ScrollView, View, Button, XStack } from 'tamagui'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import AppTextInput from '@/components/AppInput'
import ImagePickerInput from '@/components/AppImagePicker'


const coordinatesSchema = z.tuple([
    z.number({ message: 'Required' }).nullable(),
    z.number({ message: 'Required' }).nullable(),
]);

export const sendItemSchema = z.object({
    name: z.string().nonempty({ message: "Name is required" }),
    description: z.string().nonempty({ message: "Description is required" }),
    origin: z.string().nonempty({ message: "Origin is required" }),
    destination: z.string().nonempty({ message: "Destination is required" }),
    duration: z.string().nonempty({ message: "Duration is required" }),
    originCoords: coordinatesSchema,
    destinationCoord: coordinatesSchema,
    distance: z.number({ message: 'Distance is required' }),
    imageUrl: z.string().nonempty({ message: "Image is required" }),
});

type FormData = z.infer<typeof sendItemSchema>

const sendItem = () => {

    const { control, handleSubmit,
        formState: { errors } } = useForm<FormData>({
            resolver: zodResolver(sendItemSchema),
            mode: 'onBlur',
            defaultValues: {
                name: '',
                description: '',
                imageUrl: '',
                origin: '',
                destination: '',
            }
        })

    const onSubmit = (data: FormData) => {
        console.log(data)
    }


    return (
        <ScrollView backgroundColor={'$background'} flex={1} showsVerticalScrollIndicator={false}>

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
                    name="origin"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            placeholder='Pickup Location'
                            onBlur={onBlur}
                            onChangeText={(text) => onChange(Number(text))}
                            value={value?.toString()}
                            keyboardType="numeric"
                            errorMessage={errors.origin?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="destination"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            placeholder='Destination'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.destination?.message}
                        />
                    )}
                />
                <XStack width={'95%'} alignSelf='center'>
                    <View width={'50%'}>

                        <Controller
                            control={control}
                            name="distance"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <AppTextInput
                                    placeholder='Distance'
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value?.toString()}
                                    errorMessage={errors.distance?.message}
                                />
                            )}
                        />
                    </View>
                    <View width={'50%'}>
                        <Controller
                            control={control}
                            name="duration"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <AppTextInput
                                    placeholder='Duration'
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.duration?.message}
                                />
                            )}
                        />
                    </View>
                </XStack>
                <XStack width={'95%'} alignSelf='center'>
                    <View width={'50%'}>
                        <Controller
                            control={control}
                            name="originCoords"
                            render={({ field: { onChange, onBlur, value } }) => {
                                // Convert the tuple (e.g., [12.34, 56.78]) into a comma-separated string ("12.34, 56.78")
                                const displayValue =
                                    Array.isArray(value) && value.every((v) => v !== null)
                                        ? value.join(', ')
                                        : '';

                                return (
                                    <AppTextInput
                                        placeholder="Destination Coords"
                                        onBlur={onBlur}
                                        onChangeText={(text) => {
                                            // Split the text into parts based on comma separation
                                            const parts = text.split(',').map((part) => part.trim());
                                            // Attempt to parse both parts as numbers
                                            const parsed: (number | null)[] = parts.map((p) => {
                                                const num = parseFloat(p);
                                                return isNaN(num) ? null : num;
                                            });

                                            // Only update if we have exactly two parts
                                            if (parsed.length === 2) {
                                                onChange(parsed as [number | null, number | null]);
                                            }
                                        }}
                                        value={displayValue}
                                        errorMessage={errors.originCoords?.message}
                                    />
                                );
                            }}
                        />
                    </View>
                    <View width={'50%'}>

                        <Controller
                            control={control}
                            name="destinationCoord"
                            render={({ field: { onChange, onBlur, value } }) => {

                                const displayValue =
                                    Array.isArray(value) && value.every((v) => v !== null)
                                        ? value.join(', ')
                                        : '';

                                return (
                                    <AppTextInput
                                        placeholder="Destination Coords"
                                        onBlur={onBlur}
                                        onChangeText={(text) => {

                                            const parts = text.split(',').map((part) => part.trim());

                                            const parsed: (number | null)[] = parts.map((p) => {
                                                const num = parseFloat(p);
                                                return isNaN(num) ? null : num;
                                            });


                                            if (parsed.length === 2) {
                                                onChange(parsed as [number | null, number | null]);
                                            }
                                        }}
                                        value={displayValue}
                                        errorMessage={errors.destinationCoord?.message}
                                    />
                                );
                            }}
                        />
                    </View>
                </XStack>
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
                            numberOfLines={4}
                        />
                    )}
                />


                <Controller
                    control={control}
                    name="imageUrl"
                    render={({ field: { onChange, value } }) => (
                        <ImagePickerInput
                            value={value}
                            onChange={onChange}
                            errorMessage={errors.imageUrl?.message?.toString()}
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

export default sendItem

const styles = StyleSheet.create({})
