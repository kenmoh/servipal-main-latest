import React, { useState } from "react";
import { Button, ScrollView, useTheme, View, XStack } from "tamagui";
import DateTimePicker from "@react-native-community/datetimepicker";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AppTextInput from "@/components/AppInput";
import { useMutation, useQuery } from "@tanstack/react-query";
import { updateCurrentVendorUser } from "@/api/user";
import { ActivityIndicator, Platform } from "react-native";
import { useAuth } from "@/context/authContext";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { router } from "expo-router";
import { Clock } from "lucide-react-native";
import { phoneRegEx } from "@/types/user-types";
import authStorage from "@/storage/authStorage";
import CurrentLocationButton from "@/components/CurrentLocationButton";
import { useLocationStore } from "@/store/locationStore";
import { getBanks } from "@/api/payment";
import AppPicker from "@/components/AppPicker";

const profileSchema = z.object({
    phoneNumber: z
        .string()
        .min(10, "Phone Number must be at least 10 digits")
        .max(13, "Phone Number must be at most 13 digits")
        .regex(phoneRegEx, "Enter a valid phone number"),
    location: z.string().min(1, "Location is required"),
    bankName: z.string().min(1, "Bank Name is required"),
    accountNumber: z.string().min(10, "Account Number must be 10 digits").max(10, "Account Number must be 10 digits"),
    companyName: z.string().optional(),
    companyRegNo: z.string().optional(),
    openingHour: z.string().min(1, "Opening Hour is required"),
    closingHour: z.string().min(1, "Closing Hour is required"),
});
type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {
    const theme = useTheme();
    const { user, profile, setProfile } = useAuth();
    const [showOpeningHour, setShowOpeningHour] = useState(false);
    const [showClosingHour, setShowClosingHour] = useState(false);
    const { setOrigin } = useLocationStore();

    const { data } = useQuery({
        queryKey: ['banks'],
        queryFn: getBanks,
        staleTime: 72 * 60 * 60 * 1000,
    });

    const { isPending, mutate } = useMutation({
        mutationFn: updateCurrentVendorUser,
        onSuccess: async (data) => {
            await authStorage.removeProfile();
            await authStorage.storeProfile(data);
            setProfile(data);
            Notifier.showNotification({
                title: "Success",
                description: "Profile Updated.",
                Component: NotifierComponents.Alert,
                duration: 1000,
                componentProps: {
                    alertType: "success",
                },
            });
            router.back();
            return;
        },
        onError: (error) => {
            Notifier.showNotification({
                title: "Error",
                description: `${error.message}`,
                Component: NotifierComponents.Alert,
                componentProps: {
                    alertType: "error",
                },
            });
        },
    });

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, touchedFields },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            openingHour: profile?.profile?.opening_hours || "",
            closingHour: profile?.profile?.closing_hours || "",
            companyName: profile?.profile?.business_name || "",
            location: profile?.profile?.business_address || "",
            bankName: profile?.profile?.bank_name || "",
            accountNumber: profile?.profile?.bank_account_number || "",
            companyRegNo: profile?.profile?.business_registration_number || "",
            phoneNumber: profile?.profile?.phone_number || "",
        },
    });

    const handleLocationSet = async (
        address: string,
        coords: [number, number]
    ) => {
        setOrigin(address, coords);
        setValue("location", address, { shouldValidate: true, shouldTouch: true });
    };

    const onSubmit = (values: ProfileFormData) => {
        mutate(values);
    };

    return (
        <ScrollView
            flex={1}
            backgroundColor={"$background"}
            showsVerticalScrollIndicator={false}
        >
            <View>
                <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <AppTextInput
                            placeholder="Phone Number"
                            editable={false}
                            onChangeText={field.onChange}
                            value={field.value}
                            keyboardType="phone-pad"
                            autoCapitalize="none"
                            errorMessage={errors.phoneNumber?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="companyRegNo"
                    render={({ field }) => (
                        <AppTextInput
                            placeholder="Company Reg No."
                            editable={profile?.profile?.business_registration_number === null}
                            onChangeText={field.onChange}
                            value={field.value}
                            errorMessage={errors.companyRegNo?.message}
                            autoCapitalize="characters"
                            autoCorrect={false}
                            autoComplete="off"
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="location"
                    render={({ field }) => (
                        <AppTextInput
                            placeholder="Business Location"
                            editable={false}
                            onChangeText={field.onChange}
                            value={field.value}
                            errorMessage={errors.location?.message}
                        />
                    )}
                />
                <CurrentLocationButton onLocationSet={handleLocationSet} />

                <Controller
                    control={control}
                    name="companyName"
                    render={({ field }) => (
                        <AppTextInput
                            placeholder="Company Name"
                            editable={profile?.profile?.business_name === null}
                            onChangeText={field.onChange}
                            autoCapitalize="words"
                            value={field.value}
                            errorMessage={errors.companyName?.message}
                        />
                    )}
                />


                <XStack width={"95%"} alignItems="center">
                    <View flex={1}>
                        <Controller
                            control={control}
                            name="openingHour"
                            render={({ field }) => (
                                <AppTextInput
                                    editable={false}
                                    placeholder="Opening Hour"
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    errorMessage={errors.openingHour?.message}
                                />
                            )}
                        />
                    </View>
                    <Button
                        width={"15%"}
                        height={"$5"}
                        onPress={() => setShowOpeningHour(true)}
                        backgroundColor="$cardDark"
                        marginBottom={errors.openingHour ? 14 : 0}
                    >
                        <Clock color={theme.icon.val} />
                    </Button>
                </XStack>

                <XStack width={"95%"} alignItems="center">
                    <View flex={1}>
                        <Controller
                            control={control}
                            name="closingHour"
                            render={({ field }) => (
                                <AppTextInput
                                    editable={false}
                                    placeholder="Closing Hour"
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    errorMessage={errors.closingHour?.message}
                                />
                            )}
                        />
                    </View>
                    <Button
                        width={"15%"}
                        height={"$5"}
                        onPress={() => setShowClosingHour(true)}
                        backgroundColor="$cardDark"
                        marginBottom={errors.closingHour ? 14 : 0}
                    >
                        <Clock color={theme.icon.val} />
                    </Button>
                </XStack>

                <Controller
                    control={control}
                    name="accountNumber"
                    render={({ field }) => (
                        <AppTextInput
                            placeholder="Account Number"
                            onChangeText={field.onChange}
                            value={field.value}
                            keyboardType={"number-pad"}
                            errorMessage={errors.accountNumber?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="bankName"
                    render={({ field }) => (
                        <AppPicker
                            items={data || []}
                            isBank
                            value={field.value || ""}
                            onValueChange={field.onChange}
                        />
                    )}
                />
                <Button
                    style={{
                        fontFamily: "Poppins-Medium",
                        textTransform: "uppercase",
                    }}
                    marginVertical={"$3"}
                    alignSelf="center"
                    disabled={isPending}
                    backgroundColor={isPending ? "$cardDark" : "$btnPrimaryColor"}
                    width={"90%"}
                    onPress={handleSubmit(onSubmit)}
                >
                    {isPending ? (
                        <ActivityIndicator color={theme.icon.val} size={"large"} />
                    ) : (
                        "Update Profile"
                    )}
                </Button>
                {showOpeningHour && (
                    <DateTimePicker
                        testID="openinHourPicker"
                        value={
                            control._formValues.openingHour
                                ? new Date(`1970-01-01T${control._formValues.openingHour}`)
                                : new Date()
                        }
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowOpeningHour(Platform.OS === "ios");
                            if (selectedDate && event.type !== "dismissed") {
                                const hours = selectedDate
                                    .getHours()
                                    .toString()
                                    .padStart(2, "0");
                                const minutes = selectedDate
                                    .getMinutes()
                                    .toString()
                                    .padStart(2, "0");
                                setValue("openingHour", `${hours}:${minutes}`, { shouldValidate: true, shouldTouch: true });
                            }
                        }}
                    />
                )}
                {showClosingHour && (
                    <DateTimePicker
                        testID="closingHourPicker"
                        value={
                            control._formValues.closingHour
                                ? new Date(`1970-01-01T${control._formValues.closingHour}`)
                                : new Date()
                        }
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowClosingHour(Platform.OS === "ios");
                            if (selectedDate && event.type !== "dismissed") {
                                const hours = selectedDate
                                    .getHours()
                                    .toString()
                                    .padStart(2, "0");
                                const minutes = selectedDate
                                    .getMinutes()
                                    .toString()
                                    .padStart(2, "0");
                                setValue("closingHour", `${hours}:${minutes}`, { shouldValidate: true, shouldTouch: true });
                            }
                        }}
                    />
                )}
            </View>
        </ScrollView>
    );
};

export default Profile;
