
import { SafeAreaView, } from 'react-native-safe-area-context'
import { View, Text, useTheme, YStack, Button, ScrollView } from 'tamagui'
import AppTextInput from "@/components/AppInput";
import { router } from 'expo-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

const schema = z.object({

    emailCode: z.number().min(6).max(6),
    phoneCode: z.number().min(6).max(6),


})

type FormData = z.infer<typeof schema>


const SignIn = () => {
    const theme = useTheme()
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur',

    })

    const onSubmit = (data: FormData) => {
        console.log(data)
    }
    return (

        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.background.val }}

        >
            <ScrollView flex={1}
                width={'100%'}
                backgroundColor={'$background'}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    alignItems: 'center',
                    justifyContent: 'center'

                }}
            >


                <View flex={1} width={'100%'} height={'100%'}
                    alignItems='center'
                    alignContent='center'

                    justifyContent='center'
                    backgroundColor={'$background'} >

                    <YStack alignSelf='center' width={'90%'} marginBottom={10} >
                        <Text alignSelf='flex-start' fontFamily={'$heading'} fontSize={20} fontWeight={'bold'}>Verify your account</Text>
                        <Text alignSelf='flex-start' fontFamily={'$heading'} fontSize={12} fontWeight={'400'}>Enter the code sent to your email and phone.</Text>
                    </YStack>
                    <Controller
                        name='phoneCode'
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AppTextInput
                                label={'Phone Code'}
                                placeholder='234534'
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value.toString()}
                                keyboardType='numeric'
                                errorMessage={errors.phoneCode?.message}
                            />
                        )}
                    />
                    <Controller
                        name='emailCode'
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AppTextInput
                                label={'Email Code'}
                                placeholder='123466'
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value.toString()}
                                keyboardType='numeric'
                                errorMessage={errors.emailCode?.message}
                            />
                        )}
                    />

                    <Button
                        backgroundColor={'$btnPrimaryColor'}
                        height={'$5'}
                        width={'90%'}
                        marginTop={40}
                        color={'$text'}
                        fontWeight={'bold'}
                        fontSize={'$5'}
                        fontFamily={'$heading'}
                        textAlign='center'
                        onPress={handleSubmit(onSubmit)}
                    >Verify</Button>


                </View>
            </ScrollView>
        </SafeAreaView>

    )
}

export default SignIn

