import React, { useState } from 'react'
import { Button, ScrollView, useTheme, View, XStack } from 'tamagui'
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Yup from 'yup'
import { Formik } from 'formik'
import AppTextInput from '@/components/AppInput'
import { useMutation } from '@tanstack/react-query'
import { updateCurrentVendorUser } from '@/api/user'
import { ActivityIndicator, Platform } from 'react-native'
import { useAuth } from '@/context/authContext'
import { Notifier, NotifierComponents } from 'react-native-notifier'
import { router } from 'expo-router'
import { Clock } from 'lucide-react-native';
import { phoneRegEx } from '@/types/user-types';
import authStorage from "@/storage/authStorage";



const ValidationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
        .required()
        .matches(phoneRegEx, "Enter a valid phone number")
        .max(11)
        .min(10)
        .label("Phone Number"),
    location: Yup.string().required().label("Location"),
    bankName: Yup.string().required().label("Bank Name"),
    accountNumber: Yup.string().required().label("Account Number").min(10).max(10),
    companyName: Yup.string().required().label("Company Name"),
    companyRegNo: Yup.string(),
    openingHour: Yup.string().required().label("Opening hour"),
    closingHour: Yup.string().required().label("Closing hour"),
});

const Profile = () => {
    const theme = useTheme()
    const { user, profile, setProfile } = useAuth()
    const [showOpeningHour, setShowOpeningHour] = useState(false);
    const [showClosingHour, setShowClosingHour] = useState(false);


    const { isPending, mutate } = useMutation({
        mutationFn: updateCurrentVendorUser,
        onSuccess: async (data) => {
            console.log(data, 'FROM SERVER SUCCESS')
            await authStorage.removeProfile()
            await authStorage.storeProfile(data)
            setProfile(data)

            Notifier.showNotification({
                title: 'Success',
                description: 'Profile Updated.',
                Component: NotifierComponents.Alert,
                duration: 1000,
                componentProps: {
                    alertType: 'success'
                }


            })
            router.back();
            return;
        },
        onError: (error) => {
            console.log(error)
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

    return (
        <ScrollView flex={1} backgroundColor={'$background'} showsVerticalScrollIndicator={false}>
            <Formik
                initialValues={{
                    openingHour: profile?.opening_hours || "",
                    closingHour: profile?.closing_hours  || "",
                    companyName: profile?.business_name || "",
                    location: profile?.business_address || "",
                    bankName: profile?.bank_name || "",
                    accountNumber: profile?.bank_account_number || "",
                    companyRegNo: profile?.business_registration_number || "",
                    phoneNumber: profile?.phone_number || ''
                }
                }
                validationSchema={ValidationSchema}
                onSubmit={(values, { resetForm }) =>
                    mutate(values, { onSuccess: () => resetForm() })
                }
            >
                {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (

                    <>

                        <AppTextInput
                            placeholder='Phone Number'
                            editable={false}
                            onChangeText={handleChange('phoneNumber')}
                            value={values.phoneNumber}
                            keyboardType='phone-pad'
                            autoCapitalize='none'
                            errorMessage={touched.phoneNumber ? errors.phoneNumber : undefined}
                        />

                        <AppTextInput
                            placeholder='Company Reg No.'
                            editable={profile?.companyRegNo === "" ? true : false}
                            onChangeText={handleChange('companyRegNo')}
                            value={values.companyRegNo}
                            errorMessage={touched.companyRegNo ? errors.companyRegNo : undefined}
                            autoCapitalize='characters'
                            autoCorrect={false}
                            autoComplete='off'

                        />
                        <AppTextInput
                            placeholder='Location'
                            onChangeText={handleChange('location')}
                            value={values.location}
                            errorMessage={touched.location ? errors.location : undefined}
                        />
                        <AppTextInput
                            placeholder='Company Name'
                            editable={profile.companyName === "" ? true : false}
                            onChangeText={handleChange('companyName')}
                            autoCapitalize='words'
                            value={values.companyName}
                            errorMessage={touched.companyName ? errors.companyName : undefined}
                        />

                        <XStack width={'95%'} alignItems='center'>
                            <View width={'85%'}>

                                <AppTextInput
                                    editable={false}
                                    placeholder='Opening Hour'
                                    value={values.openingHour}
                                    onChangeText={handleChange("openingHour")}
                                    errorMessage={touched.openingHour ? errors.openingHour : undefined}
                                />
                            </View>

                            <Button
                                width={'15%'}
                                height={'$5'}
                                onPress={() => setShowOpeningHour(true)}
                                backgroundColor="$cardDark"
                                marginBottom={errors.openingHour ? 14 : 0}
                            >
                                <Clock color={theme.icon.val} />
                            </Button>
                        </XStack>
                        <XStack width={'95%'} alignItems='center'>
                            <View width={'85%'}>

                                <AppTextInput
                                    editable={false}
                                    placeholder='Closing Hour'
                                    value={values.closingHour}
                                    onChangeText={handleChange("closingHour")}
                                    errorMessage={touched.closingHour ? errors.closingHour : undefined}
                                />
                            </View>

                            <Button
                                width={'15%'}
                                height={'$5'}
                                onPress={() => setShowClosingHour(true)}
                                backgroundColor="$cardDark"
                                marginBottom={errors.closingHour ? 14 : 0}
                            >
                                <Clock color={theme.icon.val} />
                            </Button>
                        </XStack>


                        <AppTextInput
                            placeholder='Account Number'
                            onChangeText={handleChange('accountNumber')}
                            value={values.accountNumber}
                            keyboardType={'number-pad'}
                            errorMessage={touched.accountNumber ? errors.accountNumber : undefined}
                        />

                        <AppTextInput
                            placeholder='Bank Name'
                            onChangeText={handleChange('bankName')}
                            autoCapitalize='words'
                            value={values.bankName}
                            errorMessage={touched.bankName ? errors.bankName : undefined}
                        />

                        <Button style={{
                            fontFamily: 'Poppins-Medium',
                            textTransform: 'uppercase'
                        }}
                            marginVertical={'$3'} alignSelf='center'
                            disabled={isPending}
                            backgroundColor={isPending ? '$cardDark' : '$btnPrimaryColor'}
                            width={'90%'} onPress={() => handleSubmit()}>
                            {isPending ? <ActivityIndicator color={theme.icon.val} size={'large'} /> : 'Update Profile'}

                        </Button>
                        {showOpeningHour && (
                            <DateTimePicker
                                testID="openinHourPicker"
                                value={
                                    values.openingHour
                                        ? new Date(`1970-01-01T${values.openingHour}`)
                                        : new Date()
                                }
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowOpeningHour(Platform.OS === "ios");
                                    if (selectedDate && event.type !== 'dismissed') {
                                        const hours = selectedDate.getHours().toString().padStart(2, '0');
                                        const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
                                        setFieldValue("openingHour", `${hours}:${minutes}`);
                                    }
                                }}
                            />
                        )}

                        {showClosingHour && (
                            <DateTimePicker
                                testID="closingHourPicker"
                                value={
                                    values.closingHour
                                        ? new Date(`1970-01-01T${values.closingHour}`)
                                        : new Date()
                                }
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowClosingHour(Platform.OS === "ios");
                                    if (selectedDate && event.type !== 'dismissed') {
                                        const hours = selectedDate.getHours().toString().padStart(2, '0');
                                        const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
                                        setFieldValue('closingHour', `${hours}:${minutes}`);
                                    }
                                }}
                            />
                        )}


                        {showClosingHour && (
                            <DateTimePicker
                                testID="closingHourPicker"
                                value={
                                    values.closingHour
                                        ? new Date(`1970-01-01T${values.closingHour}`)
                                        : new Date()
                                }
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowClosingHour(Platform.OS === "ios");
                                    if (selectedDate && event.type !== 'dismissed') {
                                        const hours = selectedDate.getHours().toString().padStart(2, '0');
                                        const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
                                        setFieldValue('closingHour', `${hours}:${minutes}`);
                                    }
                                }}
                            />
                        )}


                    </>

                )}






            </Formik>





        </ScrollView>
    )
}


export default Profile