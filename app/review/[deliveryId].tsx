import { ScrollView, StyleSheet } from "react-native";
import React from "react";
import { View, YStack, Text, Button, TextArea, XStack, useTheme } from "tamagui";
import { useLocalSearchParams } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { useState } from "react";
import AppPicker from "@/components/AppPicker";
import AppTextInput from "@/components/AppInput";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createReview } from "@/api/review";
import { ReviewCreate, ReviewerType } from "@/types/review-types";

// order_id ?: string;
// item_id ?: string;
// reviewee_id: string;
// rating: number;
// comment: string;
// review_type: ReviewerType;

const reviewSchema = z.object({
    orderId: z.string().optional(),
    itemId: z.string().optional(),
    revieweeId: z.string().min(1, "Reviewee ID is required"),
    reviewType: z.string().min(1, "Please select review type"),
    rating: z.number().min(1, "Please select a rating").max(5, "Rating must be between 1 and 5"),
    description: z.string().min(10, "Review must be at least 10 characters").max(500, "Review must be less than 500 characters"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const RATINGS = [
    { id: 1, name: "1 Star" },
    { id: 2, name: "2 Stars" },
    { id: 3, name: "3 Stars" },
    { id: 4, name: "4 Stars" },
    { id: 5, name: "5 Stars" },
];

const ReviewPage = () => {
    const { revieweeId, deliveryId, orderId, itemId, orderType } = useLocalSearchParams();
    const queryClient = useQueryClient();
    const theme = useTheme()



    const {
        control,
        handleSubmit,
        formState: { errors, isValid },

    } = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        mode: "onChange",
        defaultValues: {

            revieweeId: revieweeId as string,
            orderId: orderId as string,
            itemId: itemId as string,
            reviewType: orderType as string,
            rating: 1,
            description: "",
        },
    });

    const REVIEW_TYPE = [
        { id: 'order', name: "Order" },
        { id: 'product', name: "Item" },
    ];

    const { mutate, isPending } = useMutation({
        mutationFn: createReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["delivery", deliveryId] });
            Notifier.showNotification({
                title: "Success",
                description: "Review submitted successfully",
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "success" },
            });
        },
        onError: (error: Error) => {
            Notifier.showNotification({
                title: "Error",
                description: error.message,
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "error" },
            });
        },
    });

    const onSubmit = (data: ReviewFormData) => {
        mutate({
            order_id: data.orderId,
            item_id: data.itemId,
            reviewee_id: data.revieweeId,
            rating: data.rating,
            comment: data.description,
            review_type: data.reviewType as ReviewerType,
        });

    };

    return (
        <ScrollView style={{ backgroundColor: theme.background.val, flex: 1, padding: 20 }}>
            <YStack gap="$4">


                <YStack display="none">

                    <View flex={1}>
                        <Controller
                            control={control}
                            name="orderId"
                            render={({ field: { onChange, value } }) => (
                                <AppTextInput
                                    autoCapitalize="none"
                                    value={`${orderId}` || ""}
                                    editable={false}
                                    label="Order ID"
                                />
                            )}
                        />
                    </View>

                    <View flex={1}>
                        <Controller
                            control={control}
                            name="itemId"
                            render={({ field: { onChange, value } }) => (
                                <AppTextInput
                                    autoCapitalize="none"
                                    value={`${itemId}` || ""}
                                    editable={false}
                                    label="Item ID"
                                />
                            )}
                        />
                    </View>


                    <View>

                        <Controller
                            control={control}
                            name="revieweeId"
                            render={({ field: { onChange, value } }) => (
                                <AppTextInput
                                    autoCapitalize="none"
                                    value={`${revieweeId}`}
                                    editable={false}
                                    label="Reviewee ID"
                                />
                            )}
                        />
                    </View>
                </YStack>

                <XStack alignSelf="center" gap="$2" width="100%">
                    <View width={'45%'}>
                        <Controller
                            control={control}
                            name="rating"
                            render={({ field: { onChange, value } }) => (
                                <AppPicker
                                    label="Rating"
                                    items={RATINGS}
                                    placeholder="Select rating"
                                    value={value.toString()}
                                    onValueChange={(id) => onChange(Number(id))}
                                />
                            )}
                        />
                        {errors.rating && (
                            <Text fontSize={12} color="$red10" marginTop="$1">
                                {errors.rating.message}
                            </Text>
                        )}
                    </View>
                    <View width={'50%'} display="none">
                        <Controller
                            control={control}
                            name="reviewType"
                            render={({ field: { onChange, value } }) => (
                                <AppTextInput
                                    label="Review Type"
                                    value={`${orderType}`}
                                    onChangeText={onChange}
                                    editable={false}
                                />
                            )}
                        />
                        {errors.reviewType && (
                            <Text fontSize={12} color="$red10" marginTop="$1">
                                {errors.reviewType.message}
                            </Text>
                        )}
                    </View>


                </XStack>

                <View width={'100%'}>
                    <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, value } }) => (
                            <YStack gap="$2">
                                <Text fontSize={14} fontWeight="600" color="$text">
                                    Comment
                                </Text>
                                <TextArea
                                    placeholder="Write your review..."
                                    value={value}
                                    onChangeText={onChange}
                                    minHeight={100}
                                    backgroundColor="$cardBackground"
                                    // borderColor={errors.comment ? "$red10" : "$btnPrimaryColor"}
                                    borderWidth={1}
                                />
                                {errors.description && (
                                    <Text fontSize={12} color="$red10">
                                        {errors.description.message}
                                    </Text>
                                )}
                                <Text fontSize={11} color="$gray11" alignSelf="flex-end">
                                    {value.length}/500 characters
                                </Text>
                            </YStack>
                        )}
                    />
                </View>

                <Button
                    width={'100%'}
                    backgroundColor={"$btnPrimaryColor"}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isPending || !isValid}
                    opacity={isPending || !isValid ? 0.6 : 1}
                >
                    {isPending ? "Submitting..." : "Submit Review"}
                </Button>
            </YStack>
        </ScrollView>
    );
};

export default ReviewPage; 