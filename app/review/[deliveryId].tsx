import { StyleSheet } from "react-native";
import React from "react";
import { View, YStack, Text, Button, TextArea } from "tamagui";
import { useLocalSearchParams } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { useState } from "react";

const ReviewPage = () => {
    const { deliveryId } = useLocalSearchParams();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const queryClient = useQueryClient();

    const submitReviewMutation = useMutation({
        mutationFn: async () => {
            // TODO: Implement review submission API
            return Promise.resolve();
        },
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

    return (
        <View backgroundColor={"$background"} flex={1} padding="$4">
            <YStack gap="$4">
                <Text fontSize={20} fontWeight="bold">Rate Your Delivery</Text>

                <YStack gap="$2">
                    <Text>Your Rating</Text>
                    {/* TODO: Add star rating component */}
                </YStack>

                <YStack gap="$2">
                    <Text>Your Review</Text>
                    <TextArea
                        placeholder="Share your experience..."
                        value={comment}
                        onChangeText={setComment}
                        minHeight={100}
                    />
                </YStack>

                <Button
                    backgroundColor={"$btnPrimaryColor"}
                    onPress={() => submitReviewMutation.mutate()}
                    disabled={submitReviewMutation.isPending}
                >
                    Submit Review
                </Button>
            </YStack>
        </View>
    );
};

export default ReviewPage; 