import React from "react";
import { ActivityIndicator } from "react-native";
import { YStack, Button, useTheme, Text, XStack, Card } from "tamagui";
import AppTextInput from "@/components/AppInput";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { fundWallet } from "@/api/payment";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { router } from "expo-router";

const fundWalletSchema = z.object({
    amount: z
        .string()
        .min(1, "Amount is required")
        .refine(
            (val) => !isNaN(Number(val)) && Number(val) > 0,
            "Enter a valid amount"
        ),
});

type FundWalletForm = z.infer<typeof fundWalletSchema>;

const FundWallet = () => {
    const theme = useTheme();
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<FundWalletForm>({
        resolver: zodResolver(fundWalletSchema),
        defaultValues: { amount: "" },
    });

    const amount = watch("amount");

    const amountTooLow = Number(amount) < 1000;
    const amountTooHigh = Number(amount) > 100_000;

    const { mutate, isPending } = useMutation({
        mutationFn: fundWallet,
        onSuccess: () => {
            Notifier.showNotification({
                title: "Success",
                description: "Wallet funded successfully",
                Component: NotifierComponents.Alert,
                componentProps: {
                    alertType: "success",
                },
            });
            reset();
            router.back();
        },
        onError: (error) => {
            Notifier.showNotification({
                title: "Error",
                description: error.message,
                Component: NotifierComponents.Alert,
                componentProps: {
                    alertType: "error",
                },
            });
        },
    });

    const onSubmit = (value: FundWalletForm) => {
        console.log("Submitting:", value.amount);
        mutate({ amount: Number(value.amount) });
    };

    return (
        <YStack
            flex={1}
            backgroundColor={theme.background.val}
            marginTop="$7"
            gap={35}
            alignItems="center"
        >
            <Controller
                name="amount"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextInput
                        label={"Amount"}
                        placeholder="Enter amount to fund wallet"
                        onBlur={onBlur}
                        onChangeText={(text) => onChange(text)}
                        value={value?.toString().trim() || ""}
                        keyboardType="numeric"
                        errorMessage={
                            amountTooLow
                                ? "Minimum amount is ₦1000"
                                : amountTooHigh
                                    ? "Maximum amount is ₦100,000"
                                    : errors.amount?.message
                        }
                    />
                )}
            />
            {errors.amount && (
                <Text color="$red10" fontSize={14}>
                    {errors.amount.message}
                </Text>
            )}
            <Button
                size="$5"
                backgroundColor={
                    !amount || amountTooLow || amountTooHigh || errors.amount
                        ? "$cardDark"
                        : "$btnPrimaryColor"
                }
                color="white"
                borderRadius={12}
                width={"90%"}
                fontSize={18}
                onPress={handleSubmit(onSubmit)}
                disabled={isPending || !!errors.amount || amountTooLow || amountTooHigh}
            >
                {isPending ? (
                    <ActivityIndicator color="white" size={"large"} />
                ) : (
                    "Fund Wallet"
                )}
            </Button>
        </YStack>
    );
};

export default FundWallet;
