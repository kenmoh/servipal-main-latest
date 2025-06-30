import React, { useState } from "react";
import { Button, ScrollView, useTheme, View, XStack } from "tamagui";
import DateTimePicker from "@react-native-community/datetimepicker";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AppTextInput from "@/components/AppInput";
import { useMutation, useQuery } from "@tanstack/react-query";
import { updateCurrentCustomer, updateCurrentVendorUser } from "@/api/user";
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
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const profileSchema = z.object({
    phoneNumber: z
        .string()
        .min(10, "Phone Number must be at least 10 digits")
        .max(13, "Phone Number must be at most 13 digits")
        .regex(phoneRegEx, "Enter a valid phone number"),
    location: z.string().min(1, "Location is required"),
    bankName: z.string().optional(),
    storeName: z.string().optional(),
    accountNumber: z.string().optional(),
    fullName: z.string().min(1, "Full name is required"),
});
type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {
    const theme = useTheme();
    const { profile, setProfile } = useAuth();
    const { setOrigin } = useLocationStore();

    const { data } = useQuery({
        queryKey: ["banks"],
        queryFn: getBanks,
        staleTime: 72 * 60 * 60 * 1000,
    });

    const { isPending, mutate } = useMutation({
        mutationFn: updateCurrentCustomer,
        onSuccess: async (data) => {
            console.log(data, "from customer profile");
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
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            storeName: profile?.profile?.store_name || "",
            location: profile?.profile?.business_address || "",
            bankName: profile?.profile?.bank_name || "",
            accountNumber: profile?.profile?.bank_account_number || "",
            phoneNumber: profile?.profile?.phone_number || "",
            fullName: profile?.profile?.full_name || "",
        },
    });

    const handleLocationSet = async (
        address: string,
        coords: [number, number]
    ) => {
        setOrigin(address, coords);
        setValue("location", address);
    };

    const onSubmit = (values: ProfileFormData) => {
        console.log(values);
        mutate({
            ...values,
            accountNumber: values.accountNumber ?? "",
            bankName: values.bankName ?? "",
            storeName: values.storeName ?? "",
        });
    };

    return (
        <KeyboardAwareScrollView>
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
                    name="fullName"
                    render={({ field }) => (
                        <AppTextInput
                            placeholder="Full Name"
                            onChangeText={field.onChange}
                            autoCapitalize="words"
                            value={field.value}
                            errorMessage={errors.fullName?.message}
                        />
                    )}
                />
                <CurrentLocationButton onLocationSet={handleLocationSet} />
                <Controller
                    control={control}
                    name="location"
                    render={({ field }) => (
                        <AppTextInput
                            placeholder="Location"
                            editable={false}
                            onChangeText={field.onChange}
                            value={field.value}
                            errorMessage={errors.location?.message}
                        />
                    )}
                />

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
            </View>
        </KeyboardAwareScrollView>
    );
};

export default Profile;
