import { StyleSheet } from "react-native";
import React from "react";
import { Button, ScrollView } from "tamagui";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AppTextInput from "@/components/AppInput";
import { useMutation } from "@tanstack/react-query";
import { registerRiderApi } from "@/api/auth";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { RiderResponse } from "@/types/user-types";
import { useAuth } from '@/context/authContext'
import LoadingIndicator from "@/components/LoadingIndicator";
import { queryClient } from '@/app/_layout'
import { updateRider } from "@/api/user";

const createSchema = z
    .object({
        fullName: z.string().min(1, "Name is required"),
        email: z.string({ message: "Email is required." }).email().trim(),
        phoneNumber: z.string().min(1, { message: "Phone number is required" }),
        bikeNumber: z.string().min(1, { message: "Plate number is required" }),
        password: z.string().min(1, { message: "Password is required" }),
        confirmPassword: z
            .string()
            .min(1, { message: "Confirm password is required" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password do not match.",
        path: ["confirmPassword"],
    });

const editSchema = z.object({
    fullName: z.string().min(1, "Name is required"),
    phoneNumber: z.string().min(1, { message: "Phone number is required" }),
    bikeNumber: z.string().min(1, { message: "Plate number is required" }),
});

type CreateFormData = z.infer<typeof createSchema>;
type UpdateFormData = z.infer<typeof editSchema>;
type FormData = CreateFormData | UpdateFormData;

const AddRider = () => {
    const { user } = useAuth()
    const { riderParams, isEditing } = useLocalSearchParams();
    const rider = riderParams ? JSON.parse(riderParams as string) as RiderResponse : null;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(isEditing ? editSchema : createSchema),
        mode: "onBlur",
        defaultValues: {
            fullName: rider?.full_name || "",
            email: "",
            phoneNumber: rider?.phone_number || "",
            bikeNumber: rider?.bike_number || "",
            password: "",
            confirmPassword: "",
        },
    });

    const handleSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['riders', user?.sub] });
        Notifier.showNotification({
            title: isEditing ? "Rider Updated" : "Rider Added(Pending Confirmation)",
            description: isEditing
                ? "Rider updated successfully."
                : "Rider added successfully.",
            Component: NotifierComponents.Alert,
            duration: 2000,
            componentProps: {
                alertType: "success",
            },
        });
        router.push("/profile/riders");
    };

    const handleError = (error: Error) => {
        Notifier.showNotification({
            title: "Error",
            description: error.message,
            Component: NotifierComponents.Alert,
            componentProps: {
                alertType: "error",
            },
        });
    };

    const createMutation = useMutation({
        mutationFn: registerRiderApi,
        onSuccess: handleSuccess,
        onError: handleError,
    });

    const updateMutation = useMutation({
        mutationFn: (data: UpdateFormData) =>
            updateRider(rider!.id, {
                fullName: data.fullName,
                phoneNumber: data.phoneNumber,
                bikeNumber: data.bikeNumber,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['riders', user?.sub],
                exact: true
            });

            handleSuccess();
            reset();
        },
        onError: handleError,
    });

    // const updateMutation = useMutation({
    //     mutationFn: (data: UpdateFormData) =>
    //         updateRider(rider!.id, {
    //             fullName: data.fullName,
    //             phoneNumber: data.phoneNumber,
    //             bikeNumber: data.bikeNumber,
    //         }),
    //     onSuccess: handleSuccess,
    //     onError: handleError,
    // });


    const onSubmit = (data: FormData) => {
        if (isEditing) {
            updateMutation.mutate(data as UpdateFormData);
        } else {
            createMutation.mutate(data as CreateFormData);
        }

    };

    return (
        <>
            <Stack.Screen
                options={{ title: isEditing ? "Edit Rider" : "Add Rider" }}
            />
            <ScrollView
                flex={1}
                backgroundColor={"$background"}
                showsVerticalScrollIndicator={false}
            >
                <Controller
                    control={control}
                    name="fullName"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            placeholder="Full Name"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.fullName?.message}
                        />
                    )}
                />
                {!isEditing && (
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AppTextInput
                                placeholder="Email"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors?.root?.email?.message}
                            />
                        )}
                    />
                )}
                <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            placeholder="Phone Number"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType={"number-pad"}
                            errorMessage={errors.phoneNumber?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="bikeNumber"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            placeholder="Plate Number"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.bikeNumber?.message}
                        />
                    )}
                />
                {!isEditing && (
                    <>
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <AppTextInput
                                    placeholder="Password"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    secureTextEntry
                                    showPasswordToggle
                                    value={value}
                                    errorMessage={errors?.root?.password?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <AppTextInput
                                    placeholder="Confirm Password"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    secureTextEntry
                                    showPasswordToggle
                                    value={value}
                                    errorMessage={errors?.root?.confirmPassword?.message}
                                />
                            )}
                        />
                    </>
                )}

                <Button
                    style={{
                        fontFamily: "Poppins-Medium",
                        textTransform: "uppercase",
                    }}
                    marginVertical={"$3"}
                    alignSelf="center"
                    backgroundColor={createMutation.isPending || updateMutation.isPending ? '$cardDark' : "$btnPrimaryColor"}
                    disabled={createMutation.isPending || updateMutation.isPending}
                    width={"90%"}
                    onPress={handleSubmit(onSubmit)}
                >
                    {createMutation.isPending || updateMutation.isPending ? (
                        <LoadingIndicator />
                    ) : isEditing ? (
                        "Update"
                    ) : (
                        "Submit"
                    )}
                </Button>
            </ScrollView>
        </>
    );
};

export default AddRider;

const styles = StyleSheet.create({});
