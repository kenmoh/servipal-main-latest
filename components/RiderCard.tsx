import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import {
    Avatar,
    Card,
    Label,
    Switch,
    Text,
    useTheme,
    XStack,
    YStack,
} from "tamagui";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { Edit, Trash2 } from "lucide-react-native";
import HDivider from "./HDivider";
import { RiderResponse } from "@/types/user-types";
import { deleteRider } from "@/api/user";
import LoadingIndicator from "./LoadingIndicator";
import { useAuth } from '@/context/authContext'
import { queryClient } from '@/app/_layout'

const RiderCard = ({ rider }: { rider: RiderResponse }) => {
    const theme = useTheme();
    const { user } = useAuth()

    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteRider(rider?.id),
        onSuccess: () => {
            // Optimistically update cache
            queryClient.setQueryData(['riders', user?.sub], (oldData: RiderResponse[] | undefined) => {
                if (!oldData) return [];
                return oldData.filter(r => r.id !== rider.id);
            });

            // Invalidate to ensure consistency
            queryClient.invalidateQueries({
                queryKey: ['riders', user?.sub],
                exact: true
            });

            Notifier.showNotification({
                title: "Rider deleted",
                description: "Rider deleted successfully.",
                Component: NotifierComponents.Alert,
                duration: 2000,
                componentProps: {
                    alertType: "success",
                },
            });
        },
        onError: (error) => {
            Notifier.showNotification({
                title: "Error deleting rider",
                description: `${error.message}`,
                Component: NotifierComponents.Alert,
                duration: 2000,
                componentProps: {
                    alertType: "error",
                },
            });
        }
    });

    return (
        <Card
            marginVertical={"$2"}
            borderWidth={StyleSheet.hairlineWidth}
            bordered
            width={"95%"}
            alignSelf="center"
        >
            <Card.Header>
                <XStack justifyContent="space-between">
                    <XStack gap={"$3"}>
                        <Avatar circular size={60}>
                            <Avatar.Image
                                accessibilityLabel="Rider"
                                src={rider?.profile_image_url || require("@/assets/images/profile.jpg")}
                            />
                            <Avatar.Fallback backgroundColor={"$blue10"} />
                        </Avatar>
                        <YStack alignItems="flex-start">
                            <Text>{rider.full_name}</Text>
                            <Text>{rider.phone_number}</Text>
                        </YStack>
                    </XStack>
                    <YStack gap={"$3.5"}>
                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname: "/profile/addRider",
                                    params: {
                                        riderParams: JSON.stringify(rider),
                                        isEditing: "true",
                                    },
                                })
                            }
                        >
                            <Edit color={theme.icon.val} size={20} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => mutate()}>
                            {isPending ? <LoadingIndicator size='small' /> : <Trash2 color={theme.icon.val} size={20} />}
                        </TouchableOpacity>
                    </YStack>
                </XStack>
            </Card.Header>
            <HDivider />
            <Card.Footer padded>
                <XStack justifyContent="space-between" width={"100%"}>
                    <YStack alignItems="center">
                        <Text
                            color={"$text"}
                            style={{ fontFamily: "Poppins-Medium", fontSize: 15 }}
                        >
                            {" "}
                            {rider?.stats?.total_deliveries}
                        </Text>
                        <Text
                            color={"$icon"}
                            style={{ fontFamily: "Poppins-Light", fontSize: 12 }}
                        >
                            Delivered
                        </Text>
                    </YStack>
                    <YStack alignItems="center">
                        <Text
                            color={"$text"}
                            style={{ fontFamily: "Poppins-Medium", fontSize: 15 }}
                        >
                            {" "}
                            {rider?.stats?.completed_deliveries}
                        </Text>
                        <Text
                            color={"$icon"}
                            style={{ fontFamily: "Poppins-Light", fontSize: 12 }}
                        >
                            Completed
                        </Text>
                    </YStack>
                    <YStack alignItems="center">
                        <Text
                            color={"$text"}
                            style={{ fontFamily: "Poppins-Medium", fontSize: 15 }}
                        >
                            {" "}
                            {rider?.stats?.pending_deliveries}
                        </Text>
                        <Text
                            color={"$icon"}
                            style={{ fontFamily: "Poppins-Light", fontSize: 12 }}
                        >
                            Pending
                        </Text>
                    </YStack>
                    <YStack alignItems="center">
                        <Text
                            color={"$text"}
                            style={{ fontFamily: "Poppins-Medium", fontSize: 15 }}
                        >
                            {" "}
                            {rider?.bike_number}
                        </Text>
                        <Text
                            color={"$icon"}
                            style={{ fontFamily: "Poppins-Light", fontSize: 12 }}
                        >
                            Bike No.
                        </Text>
                    </YStack>
                </XStack>
            </Card.Footer>
        </Card>
    );
};

export default RiderCard;

const styles = StyleSheet.create({});

const SwitchWithLabel = () => {
    return (
        <XStack width={200} gap={"$3"} alignItems="center" alignSelf="flex-end">
            <Label>Suspend</Label>
            <Switch
                id="rider"
                size={"$3"}
                backgroundColor={"$inputBackground"}
                defaultChecked
            >
                <Switch.Thumb backgroundColor={"$transparentBtnPrimaryColor"} />
            </Switch>
        </XStack>
    );
};
