import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, } from 'react-native-safe-area-context'
import { View, Text, useTheme, Input, YStack, Button, Image, XStack, ScrollView } from 'tamagui'
import AppTextInput from "@/components/AppInput";
import { router } from 'expo-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

const schema = z.object({

    email: z.string().email().trim(),


})

type FormData = z.infer<typeof schema>


const SignIn = () => {
    const theme = useTheme()
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            email: '',

        }
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
                        <Text alignSelf='flex-start' fontFamily={'$heading'} fontSize={20} fontWeight={'bold'}>Recover password</Text>
                        <Text alignSelf='flex-start' fontFamily={'$heading'} fontSize={12} fontWeight={'400'}>Enter the email you registered with.</Text>
                    </YStack>
                    <Controller
                        name='email'
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AppTextInput
                                label={'Email'}
                                placeholder='email@example.com'
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                keyboardType='email-address'
                                errorMessage={errors.email?.message}
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
                    >Submit</Button>

                    <XStack alignSelf='center' marginTop={25} alignItems='center' justifyContent='center' width={'90%'} marginBottom={30} >
                        <Text color={'$text'} fontFamily={'$body'} fontSize={14} >Or continue to </Text>
                        <Text hitSlop={50} onPress={() => router.navigate('/sign-in')} fontFamily={'$body'} fontSize={14} color={'$btnPrimaryColor'} textDecorationLine='underline'>Login</Text>
                    </XStack>
                </View>
            </ScrollView>
        </SafeAreaView>

    )
}

export default SignIn

