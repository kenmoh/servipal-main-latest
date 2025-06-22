import { useEffect, useState } from 'react';
import { SafeAreaView, } from 'react-native-safe-area-context'
import { View, Text, useTheme, YStack, Button, ScrollView, XStack } from 'tamagui'
import AppTextInput from "@/components/AppInput";
import { router } from 'expo-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Notifier, NotifierComponents } from 'react-native-notifier';
import { useMutation } from '@tanstack/react-query';
import { resendVerification, verifyContact } from '@/api/auth';
import { ActivityIndicator } from 'react-native';
import { X } from 'lucide-react-native';
import authStorage from "@/storage/authStorage";

const schema = z.object({
    emailCode: z
        .string()
        .min(6, { message: "Email code must be 6 digits" })
        .max(6, { message: "Email code must be 6 digits" })
        .regex(/^\d+$/, { message: "Email code must contain only digits" }),
    phoneCode: z
        .union([
            z.string(),
            z.number().transform((val) => val.toString()),
        ])
        .transform((val) => val.toString())
        .pipe(
            z
                .string()
                .min(6, { message: "Phone code must be 6 digits" })
                .max(6, { message: "Phone code must be 6 digits" })
                .regex(/^\d+$/, { message: "Phone code must contain only digits" })
        ),
});


type FormData = z.infer<typeof schema>


const ConfirmAccount = () => {
    const theme = useTheme()
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [email, setEmail] = useState("");

    console.log(email);


    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur',

    })

    const { mutate, isPending } = useMutation({
        mutationFn: verifyContact,
        onSuccess: (data) => {
            authStorage.removeEmail();
            Notifier.showNotification({
                title: 'Success',
                description: 'Account creation successful',
                Component: NotifierComponents.Alert,
                duration: 1000,
                componentProps: {
                    alertType: 'success'
                }
            })
            router.replace('/(auth)/sign-in');
        },
        onError: (error) => {
            Notifier.showNotification({
                title: 'Error',
                description: `${error.message}`,
                Component: NotifierComponents.Alert,
                componentProps: {
                    alertType: 'error'
                }
            })
        }
    })

    const { mutate: resend, isPending: isResending } = useMutation({
        mutationFn: (email: string) => resendVerification(email),
        onSuccess: () => {
            Notifier.showNotification({
                title: 'Success',
                description: 'Verification codes sent successfully',
                Component: NotifierComponents.Alert,
                componentProps: {
                    alertType: 'success'
                }
            });
            setCountdown(120);
            setCanResend(false);
        },
        onError: (error) => {
            Notifier.showNotification({
                title: 'Error',
                description: error.message,
                Component: NotifierComponents.Alert,
                componentProps: {
                    alertType: 'error'
                }
            });
        }
    });

    // Countdown timer effect
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0 && !canResend) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }

        return () => clearInterval(timer);
    }, [countdown, canResend]);

    useEffect(() => {
        authStorage.getEmail().then(e => {
            if (e) setEmail(e);
        });
    }, []);



    const onSubmit = (data: FormData) => {
        mutate(data)

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
                                onChangeText={(text) => onChange(text)}
                                value={value?.toString().trim() || ""}
                                keyboardType='numeric'
                                errorMessage={errors.phoneCode?.message}
                                editable={!isPending}

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
                                onChangeText={(text) => onChange(text)}
                                value={value?.toString().trim() || ""}
                                keyboardType='numeric'
                                errorMessage={errors.emailCode?.message}
                                editable={!isPending}

                            />
                        )}
                    />
                    <XStack alignSelf='center' marginTop={40} alignItems='center' justifyContent='center' width={'90%'} gap={5}>

                        <Button
                            backgroundColor={isPending ? '$cardDark' : '$btnPrimaryColor'}
                            height={'$5'}
                            width={'50%'}
                            color={'$text'}
                            fontWeight={'bold'}
                            fontSize={'$4'}
                            fontFamily={'$heading'}
                            textAlign='center'
                            disabled={isPending}
                            onPress={handleSubmit(onSubmit)}
                        >

                            {isPending ? <ActivityIndicator size={'large'} color={theme.text.val} /> : 'Verify'}
                        </Button>
                        <Button
                            backgroundColor={'transparent'}
                            height={'$5'}
                            width={'50%'}
                            color={canResend ? '$btnPrimaryColor' : '$gray11'}
                            fontWeight={'bold'}
                            fontSize={'$4'}
                            fontFamily={'$heading'}
                            textAlign='center'
                            disabled={!canResend || isResending}
                            onPress={() => resend(email)}
                        >
                            {isResending ?
                                <ActivityIndicator size={'small'} color={theme.btnPrimaryColor.val} /> :
                                canResend ?
                                    'Resend' :
                                    `Resend in ${countdown}s`
                            }
                        </Button>
                    </XStack>


                </View>
            </ScrollView>
        </SafeAreaView>

    )
}

export default ConfirmAccount

