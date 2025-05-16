import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, } from 'react-native-safe-area-context'
import { View, Text, useTheme, Input, YStack, Button, Image, XStack, ScrollView } from 'tamagui'
import AppTextInput from "@/components/AppInput";
import { router } from 'expo-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Notifier, NotifierComponents } from 'react-native-notifier';
import { useMutation } from '@tanstack/react-query';
import { recoverPassword } from '@/api/auth';
import { ActivityIndicator } from 'react-native';

const schema = z.object({

    email: z.string().email().trim(),


})

type FormData = z.infer<typeof schema>


const RecoverPassword = () => {
    const theme = useTheme()
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            email: '',

        }
    })

    const { mutate, isPending } = useMutation({
        mutationFn: recoverPassword,
        onError: (error) => {
            Notifier.showNotification({
                title: 'Error',
                description: `${error.message}`,
                Component: NotifierComponents.Alert,
                componentProps: {
                    alertType: 'error'
                }
            })

        },
        onSuccess: (data) => {
            Notifier.showNotification({
                title: 'Success',
                description: 'Password reset link sent to your email. It will expire in 10 minutes.',
                Component: NotifierComponents.Alert,
                componentProps: {
                    alertType: 'success'
                }
            })

            router.replace('/(auth)/sign-in');

        }
    });

    const onSubmit = (data: FormData) => {
        mutate(data);
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
                                editable={!isPending}
                            />
                        )}
                    />

                    <Button
                        backgroundColor={isPending ? '$cardDark' : '$btnPrimaryColor'}
                        height={'$5'}
                        width={'90%'}
                        marginTop={40}
                        color={'$text'}
                        fontWeight={'bold'}
                        fontSize={'$5'}
                        fontFamily={'$heading'}
                        textAlign='center'
                        onPress={handleSubmit(onSubmit)}
                    >{isPending ? <ActivityIndicator size={'large'} color={theme.text.val} /> : 'Send'}</Button>

                    <XStack alignSelf='center' marginTop={25} alignItems='center' justifyContent='center' width={'90%'} marginBottom={30} >
                        <Text color={'$text'} fontFamily={'$body'} fontSize={14} >Or continue to </Text>
                        <Text hitSlop={50} onPress={() => router.navigate('/sign-in')} fontFamily={'$body'} fontSize={14} color={'$btnPrimaryColor'} textDecorationLine='underline'>Login</Text>
                    </XStack>
                </View>
            </ScrollView>
        </SafeAreaView>

    )
}

export default RecoverPassword

