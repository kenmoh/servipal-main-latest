import { StyleSheet } from "react-native";
import React from "react";
import { View, YStack, Text, Button, TextArea } from "tamagui";
import { useLocalSearchParams } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { useState } from "react";
import AppPicker from "@/components/AppPicker";

const ISSUE_TYPES = [
    { id: "damaged", name: "Damaged Items" },
    { id: "wrong_items", name: "Wrong Items" },
    { id: "late", name: "Late Delivery" },
    { id: "rider", name: "Rider Behavior" },
    { id: "other", name: "Other" },
];

const ReportPage = () => {
    const { deliveryId } = useLocalSearchParams();
    const [issueType, setIssueType] = useState("");
    const [description, setDescription] = useState("");
    const queryClient = useQueryClient();

    const submitReportMutation = useMutation({
        mutationFn: async () => {
            // TODO: Implement report submission API
            return Promise.resolve();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["delivery", deliveryId] });
            Notifier.showNotification({
                title: "Success",
                description: "Report submitted successfully",
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
                <YStack gap="$2">
                    <Text>Issue Type</Text>
                    <AppPicker
                        items={ISSUE_TYPES}
                        placeholder="Select issue type"
                        value={issueType}
                        onValueChange={(id) => setIssueType(id)}
                    />
                </YStack>

                <YStack gap="$2">
                    <Text>Description</Text>
                    <TextArea
                        placeholder="Please describe the issue in detail..."
                        value={description}
                        onChangeText={setDescription}
                        minHeight={100}
                    />
                </YStack>

                <Button
                    backgroundColor={"$btnPrimaryColor"}
                    onPress={() => submitReportMutation.mutate()}
                    disabled={submitReportMutation.isPending}
                >
                    Submit Report
                </Button>
            </YStack>
        </View>
    );
};

export default ReportPage; 