import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, } from 'react-native-safe-area-context'
import { View, Text, useTheme, Input, YStack, Button, Image, XStack, ScrollView } from 'tamagui'
import AppTextInput from "@/components/AppInput";
import { router } from 'expo-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

const schema = z.object({

    username: z.string().email().trim(),
    password: z.string().min(1, { message: 'Password is required' }),

})

type FormData = z.infer<typeof schema>


const SignIn = () => {
    const theme = useTheme()
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            username: '',
            password: '',
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
                    marginTop={100}
                    justifyContent='center'
                    backgroundColor={'$background'} >

                    <YStack alignSelf='center' width={'90%'} marginBottom={10} >
                        <Text alignSelf='flex-start' fontFamily={'$heading'} fontSize={20} fontWeight={'bold'}>Welcome back,</Text>
                        <Text alignSelf='flex-start' fontFamily={'$heading'} fontSize={12} fontWeight={'400'}>Login to continue</Text>
                    </YStack>
                    <Controller
                        name='username'
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AppTextInput
                                label={'Email'}
                                placeholder='email@example.com'
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                keyboardType='email-address'
                                errorMessage={errors.username?.message}
                            />
                        )}
                    />
                    <Controller
                        name='password'
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AppTextInput
                                label={'Password'}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                secureTextEntry
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />


                    <View marginTop={10} width={'90%'} alignSelf='center'>
                        <Text hitSlop={50} alignSelf='flex-end'
                            onPress={() => router.push('./forgot-password')}
                            fontFamily={'$body'}
                            fontSize={14}
                            color={'$btnPrimaryColor'}
                            textDecorationLine='underline'


                        >Forgot password</Text>
                    </View>
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
                    >Login</Button>

                    <XStack alignSelf='center' marginTop={25} alignItems='center' justifyContent='center' width={'90%'} marginBottom={30} >
                        <Text color={'$text'} fontFamily={'$body'} fontSize={14} >Don't have an account? </Text>
                        <Text hitSlop={50} onPress={() => router.navigate('/sign-up')} fontFamily={'$body'} fontSize={14} color={'$btnPrimaryColor'} textDecorationLine='underline'>Register</Text>
                    </XStack>
                </View>
            </ScrollView>
        </SafeAreaView>

    )
}

export default SignIn

