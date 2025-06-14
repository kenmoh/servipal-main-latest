import { StyleSheet } from "react-native";
import React from "react";
import { View, YStack, Text, Button, TextArea } from "tamagui";
import { useLocalSearchParams } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { useState } from "react";
import AppPicker from "@/components/AppPicker";

const RATINGS = [
    { id: "1", name: "1 Star" },
    { id: "2", name: "2 Stars" },
    { id: "3", name: "3 Stars" },
    { id: "4", name: "4 Stars" },
    { id: "5", name: "5 Stars" },
];

const RATE_TARGETS = [
    { id: "rider", name: "Rider" },
    { id: "vendor", name: "Vendor" },
];

const ReviewPage = () => {
    const { deliveryId } = useLocalSearchParams();
    const [rating, setRating] = useState("");
    const [rateTarget, setRateTarget] = useState("");
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
                <Text fontSize={20} fontWeight="bold">Write a Review</Text>

                <YStack gap="$2">
                    <Text>Who are you rating?</Text>
                    <AppPicker
                        items={RATE_TARGETS}
                        placeholder="Select who to rate"
                        value={rateTarget}
                        onValueChange={(id) => setRateTarget(id)}
                    />
                </YStack>

                <YStack gap="$2">
                    <Text>Rating</Text>
                    <AppPicker
                        items={RATINGS}
                        placeholder="Select rating"
                        value={rating}
                        onValueChange={(id) => setRating(id)}
                    />
                </YStack>

                <YStack gap="$2">
                    <Text>Comment</Text>
                    <TextArea
                        placeholder="Write your review..."
                        value={comment}
                        onChangeText={setComment}
                        minHeight={100}
                    />
                </YStack>

                <Button
                    backgroundColor={"$btnPrimaryColor"}
                    onPress={() => submitReviewMutation.mutate()}
                    disabled={submitReviewMutation.isPending || !rateTarget || !rating}
                >
                    Submit Review
                </Button>
            </YStack>
        </View>
    );
};

export default ReviewPage; 