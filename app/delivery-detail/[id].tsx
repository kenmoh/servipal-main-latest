import {
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
    Card,
    Text,
    XStack,
    Circle,
    Avatar,
    YStack,
    Paragraph,
    useTheme,
    Button,
    View,
} from "tamagui";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Phone,
    MapPin,
    Wallet,
    Info,
    User,
    DollarSign,
} from "lucide-react-native";
import LoadingIndicator from "@/components/LoadingIndicator";
import { Status } from "@/components/ItemCard";
import {
    fetchDelivery,
    senderConfirmDeliveryReceived,
    riderAcceptDelivery,
    riderMarkDelivered,
    cancelDelivery,
    markLaundryReceived,
} from "@/api/order";
import DeliveryWrapper from "@/components/DeliveryWrapper";
import { useAuth } from "@/context/authContext";

const ItemDetails = () => {
    const { id } = useLocalSearchParams();
    const theme = useTheme();
    const { user } = useAuth();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["delivery", id],
        queryFn: () => fetchDelivery(id as string),
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });

    const queryClient = useQueryClient();

    const confirmReceivedMutation = useMutation({
        mutationFn: () =>
            senderConfirmDeliveryReceived(data?.delivery?.id as string),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["delivery", id],
                exact: false,
            });
            queryClient.invalidateQueries({
                queryKey: ["deliveries"],
                exact: false,
            });

            queryClient.invalidateQueries({
                queryKey: ["deliveries", user?.sub],
                exact: false,
            });

            queryClient.refetchQueries({ queryKey: ["deliveries"], exact: false });
            queryClient.refetchQueries({
                queryKey: ["deliveries", user?.sub],
                exact: false,
            });

            refetch();
            router.back();
            router.back();

            Notifier.showNotification({
                title: "Success",
                description: "Delivery confirmed as received!",
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "success" },
            });
        },
        onError: (error: Error) => {
            Notifier.showNotification({
                title: "Error",
                description: `${error.message}`,
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "error" },
            });
        },
    });

    const laundryReceivedMutation = useMutation({
        mutationFn: () => markLaundryReceived(data?.delivery?.id as string),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["delivery", id],
                exact: false,
            });
            queryClient.invalidateQueries({
                queryKey: ["deliveries"],
                exact: false,
            });

            queryClient.invalidateQueries({
                queryKey: ["deliveries", user?.sub],
                exact: false,
            });
            refetch();
            router.back();

            queryClient.refetchQueries({ queryKey: ["deliveries"], exact: false });
            queryClient.refetchQueries({
                queryKey: ["deliveries", user?.sub],
                exact: false,
            });

            Notifier.showNotification({
                title: "Success",
                description: "Laundry item received.",
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "success" },
            });
        },
        onError: (error: Error) => {
            Notifier.showNotification({
                title: "Error",
                description: `${error.message}`,
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "error" },
            });
        },
    });

    const acceptDeliveryMutation = useMutation({
        mutationFn: () => riderAcceptDelivery(data?.delivery?.id as string),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["delivery", id],
                exact: false,
            });
            queryClient.invalidateQueries({
                queryKey: ["deliveries"],
                exact: false,
            });
            queryClient.invalidateQueries({
                queryKey: ["deliveries", user?.sub],
                exact: false,
            });

            queryClient.refetchQueries({ queryKey: ["deliveries"], exact: false });
            queryClient.refetchQueries({
                queryKey: ["deliveries", user?.sub],
                exact: false,
            });

            refetch();
            router.back();

            Notifier.showNotification({
                title: "Success",
                description: "This order has been assigned to you. Drive carefully!",
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "success" },
            });
        },
        onError: (error: Error) => {
            Notifier.showNotification({
                title: "Error",
                description: `${error.message}`,
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "error" },
            });
        },
    });

    const markDeliveredMutation = useMutation({
        mutationFn: () => riderMarkDelivered(data?.delivery?.id as string),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["delivery", id],
                exact: false,
            });
            queryClient.invalidateQueries({
                queryKey: ["deliveries"],
                exact: false,
            });
            queryClient.invalidateQueries({
                queryKey: ["deliveries", user?.sub],
                exact: false,
            });

            queryClient.refetchQueries({ queryKey: ["deliveries"], exact: false });
            queryClient.refetchQueries({
                queryKey: ["deliveries", user?.sub],
                exact: false,
            });

            refetch();
            router.back();

            Notifier.showNotification({
                title: "Success",
                description: "Item delivered.",
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "success" },
            });
        },
        onError: (error: Error) => {
            Notifier.showNotification({
                title: "Error",
                description: `${error.message}`,
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "error" },
            });
        },
    });

    const cancelDeliveryMutation = useMutation({
        mutationFn: () => cancelDelivery(data?.delivery?.id as string),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["delivery", id],
                exact: false,
            });
            queryClient.invalidateQueries({
                queryKey: ["deliveries"],
                exact: false,
            });
            queryClient.invalidateQueries({
                queryKey: ["deliveries", user?.sub],
                exact: false,
            });

            queryClient.refetchQueries({ queryKey: ["deliveries"], exact: false });
            queryClient.refetchQueries({
                queryKey: ["deliveries", user?.sub],
                exact: false,
            });

            refetch();
            router.back();

            Notifier.showNotification({
                title: "Success",
                description: "Delivery cancelled!",
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "success" },
            });
        },
        onError: (error: Error) => {
            Notifier.showNotification({
                title: "Error",
                description: `${error.message}`,
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "error" },
            });
        },
    });

    const getActionButton = () => {
        if (!data || !user) return null;

        // Rider can accept if order is pending and they are not assigned yet
        if (
            data?.delivery?.delivery_status === "pending" &&
            !data?.delivery?.rider_id &&
            user?.sub !== data?.delivery?.sender_id
        ) {
            return {
                label: "Accept Delivery",
                onPress: () => {
                    acceptDeliveryMutation.mutate();
                },
                loading: acceptDeliveryMutation.isPending,
            };
        }

        // Sender can confirm received if delivered
        if (
            data?.delivery?.delivery_status === "delivered" &&
            user?.sub === data?.delivery?.sender_id
        ) {
            return {
                label: "Confirm Received",
                onPress: () => confirmReceivedMutation.mutate(),
                loading: confirmReceivedMutation.isPending,
            };
        }
        // Rider mark order delivered
        if (
            (data?.delivery?.delivery_status === "accepted" &&
                user?.sub === data?.delivery?.rider_id) ||
            data?.delivery?.dispatch_id
        ) {
            return {
                label: "Delivered",
                onPress: () => markDeliveredMutation.mutate(),
                loading: markDeliveredMutation.isPending,
            };
        }
        // Laundry vendour mark received
        if (
            data?.delivery?.delivery_status === "delivered" &&
            data?.delivery?.delivery_type === "laundry" &&
            user?.sub === data?.order?.vendor_id &&
            user?.user_type === "laundry_vendor"
        ) {
            return {
                label: "Item Received",
                onPress: () => laundryReceivedMutation.mutate(),
                loading: laundryReceivedMutation.isPending,
            };
        }
        if (data?.delivery?.delivery_status === "received") {
            return {
                label: "Received",
            };
        }

        return null;
    };

    const actionButton = getActionButton();
    const showFullBtnSize =
        data?.delivery?.delivery_status === "pending" &&
        user?.sub === data?.delivery?.sender_id;
    const showCancel =
        (user?.sub === data?.delivery?.sender_id ||
            user?.sub === data?.delivery?.rider_id) &&
        ["accepted", "pending"].includes(data?.delivery?.delivery_status as string);

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <>
            <DeliveryWrapper>
                {user?.sub === data?.delivery?.sender_id &&
                    data?.delivery?.sender_id &&
                    data?.delivery?.delivery_status !== "pending" &&
                    data?.delivery?.delivery_status !== "received" && (
                        <TouchableOpacity
                            style={{
                                backgroundColor: theme.cardDark.val,
                                borderColor: theme.borderColor.val,
                                borderWidth: 1,
                                height: 40,
                                width: "85%",
                                alignSelf: "center",
                                borderRadius: 8,
                                justifyContent: "center",
                                alignItems: "center",
                                marginVertical: 10,
                            }}
                            onPressIn={() =>
                                router.push({
                                    pathname: "/user-details/[userId]",
                                    params: {
                                        userId: data?.delivery?.rider_id!,
                                    },
                                })
                            }
                        >
                            <XStack gap={10}>
                                <User color={"white"} size={20} />
                                <Text>CONTACT RIDER</Text>
                            </XStack>
                        </TouchableOpacity>
                    )}
                {user?.sub === data?.delivery?.sender_id &&
                    data?.order.order_payment_status !== "paid" && (
                        <Button
                            alignSelf="center"
                            marginVertical={"$2"}
                            variant="outlined"
                            width={"85%"}
                            icon={DollarSign}
                            color={"white"}
                            borderColor={"$borderColor"}
                            borderWidth={1}
                            onPressIn={() =>
                                router.push({
                                    pathname: "/payment/[orderId]",
                                    params: {
                                        orderId: data?.order.id ?? "",
                                        deliveryFee: data?.delivery?.delivery_fee,
                                        orderNumber: data?.order?.order_number,
                                        deliveryType: `${data?.order?.require_delivery === "delivery"
                                                ? data?.delivery?.delivery_fee
                                                : data?.order?.order_type
                                            }`,
                                        orderItems: JSON.stringify(data?.order.order_items ?? []),
                                        paymentLink: data?.order.payment_link,
                                        orderType: data?.order?.order_type,
                                    },
                                })
                            }
                        >
                            MAKE PAYMENT
                        </Button>
                    )}

                <Card
                    marginVertical={5}
                    width={"95%"}
                    paddingHorizontal={5}
                    alignSelf="center"
                    flex={1}
                    backgroundColor={"$background"}
                    height={"100%"}
                >
                    <Card.Header gap={5}>
                        <XStack
                            gap={5}
                            alignItems="baseline"
                            justifyContent="space-between"
                        >
                            <Text color={"$text"} fontSize={12} marginBottom={5}>
                                ORDER DETAILS
                            </Text>
                            <Status status={data?.delivery?.delivery_status} />
                        </XStack>
                        <XStack gap={5}>
                            <Info color={theme.icon.val} size={15} />

                            <XStack justifyContent="space-between" width={"96%"}>
                                <Paragraph
                                    color={"$text"}
                                    fontFamily={"$body"}
                                    fontWeight={"300"}
                                    fontSize={11}
                                >
                                    Order ID
                                </Paragraph>
                                <Paragraph
                                    color={"$text"}
                                    fontFamily={"$body"}
                                    fontWeight={"500"}
                                    fontSize={12}
                                >
                                    #{data?.order?.order_number}
                                </Paragraph>
                            </XStack>
                        </XStack>
                        <XStack gap={5}>
                            <Wallet color={theme.icon.val} size={15} />
                            <XStack justifyContent="space-between" width={"96%"}>
                                <Paragraph
                                    color={"$text"}
                                    fontFamily={"$body"}
                                    fontWeight={"300"}
                                    fontSize={11}
                                >
                                    Delivery fee(After commission)
                                </Paragraph>
                                <Paragraph
                                    color={"$text"}
                                    fontFamily={"$body"}
                                    fontWeight={"500"}
                                    fontSize={12}
                                >
                                    ₦ {Number(data?.delivery?.amount_due_dispatch).toFixed(2)}
                                </Paragraph>
                            </XStack>
                        </XStack>
                        {(user?.sub === data?.delivery?.sender_id ||
                            user?.sub === data?.delivery?.rider_id ||
                            user?.sub === data?.delivery?.dispatch_id) && (
                                <XStack gap={5}>
                                    <Phone color={theme.icon.val} size={15} />
                                    <XStack justifyContent="space-between" width={"96%"}>
                                        <Paragraph
                                            color={"$text"}
                                            fontFamily={"$body"}
                                            fontWeight={"300"}
                                            fontSize={11}
                                        >
                                            Sender Phone
                                        </Paragraph>
                                        <Paragraph
                                            color={"$text"}
                                            fontFamily={"$body"}
                                            fontWeight={"500"}
                                            fontSize={12}
                                        >
                                            {data?.delivery?.sender_phone_number}
                                        </Paragraph>
                                    </XStack>
                                </XStack>
                            )}

                        <XStack gap={5}>
                            <MapPin color={theme.icon.val} size={15} />
                            <YStack>
                                <Paragraph
                                    color={"$text"}
                                    fontFamily={"$body"}
                                    fontWeight={"300"}
                                    fontSize={11}
                                >
                                    Delivery Address
                                </Paragraph>
                                <Paragraph
                                    color={"$text"}
                                    fontFamily={"$body"}
                                    fontWeight={"500"}
                                    fontSize={11}
                                >
                                    {data?.delivery?.destination}
                                </Paragraph>
                            </YStack>
                        </XStack>
                    </Card.Header>
                    <XStack
                        justifyContent="center"
                        alignItems="center"
                        gap="$3"
                        alignSelf="center"
                        marginTop="$3"
                    >
                        {actionButton && (
                            <Button
                                size={"$4"}
                                backgroundColor={
                                    data?.delivery?.delivery_status === "received"
                                        ? "$cardDark"
                                        : "$btnPrimaryColor"
                                }
                                width={showCancel ? "50%" : "90%"}
                                textAlign="center"
                                fontSize={16}
                                fontFamily={"$body"}
                                color={"$text"}
                                fontWeight={"600"}
                                pressStyle={{ backgroundColor: "$transparentBtnPrimaryColor" }}
                                onPressIn={actionButton.onPress}
                                disabled={
                                    (data?.delivery?.sender_id === user?.sub &&
                                        data?.delivery?.delivery_status !== "delivered") ||
                                    (data?.delivery?.rider_id === user?.sub &&
                                        data?.delivery?.delivery_status === "delivered") ||
                                    data?.delivery?.delivery_status === "received" ||
                                    actionButton?.loading
                                }
                            >
                                {actionButton.loading ? (
                                    <ActivityIndicator color="#ccc" />
                                ) : (
                                    actionButton.label
                                )}
                            </Button>
                        )}

                        {showCancel && (
                            <>
                                <Button
                                    size={"$3.5"}
                                    borderColor={"$red10"}
                                    borderWidth={1}
                                    width={showFullBtnSize ? "90%" : "40%"}
                                    textAlign="center"
                                    fontSize={14}
                                    fontFamily={"$body"}
                                    color={"#fff"}
                                    fontWeight={"600"}
                                    pressStyle={{ backgroundColor: "$red8" }}
                                    onPressIn={() => cancelDeliveryMutation.mutate()}
                                    disabled={cancelDeliveryMutation.isPending}
                                >
                                    {cancelDeliveryMutation.isPending ? (
                                        <ActivityIndicator color="#ccc" />
                                    ) : (
                                        "Cancel"
                                    )}
                                </Button>
                            </>
                        )}
                    </XStack>

                    {/* Additional Action Buttons */}
                    <XStack
                        marginTop="$4"
                        gap="$2"
                        width="90%"
                        alignSelf="center"
                        justifyContent="space-between"
                    >
                        {/* Review Button - Hide for package deliveries */}
                        {data?.order?.order_type !== "package" &&
                            (data?.order?.order_status === "received" ||
                                data?.delivery?.delivery_status === "delivered" ||
                                data?.delivery?.delivery_status === "received") && (
                                <Button
                                    size={"$4"}
                                    backgroundColor={"$cardDark"}
                                    width="32%"
                                    textAlign="center"
                                    fontSize={12}
                                    fontFamily={"$body"}
                                    color={"$text"}
                                    fontWeight={"500"}
                                    pressStyle={{ backgroundColor: "$cardDarkHover" }}
                                    onPressIn={() => {
                                        router.push({
                                            pathname: "/review/[deliveryId]",
                                            params: { deliveryId: data?.order?.id },
                                        });
                                    }}
                                >
                                    Review
                                </Button>
                            )}

                        {/* Report Button - Show for all delivery types */}
                        {(data?.order?.order_status === "received" ||
                            data?.delivery?.delivery_status === "delivered" ||
                            data?.delivery?.delivery_status === "received") && (
                                <Button
                                    size={"$4"}
                                    backgroundColor={"$cardDark"}
                                    width="32%"
                                    textAlign="center"
                                    fontSize={12}
                                    fontFamily={"$body"}
                                    color={"$text"}
                                    fontWeight={"500"}
                                    pressStyle={{ backgroundColor: "$cardDarkHover" }}
                                    onPressIn={() => {
                                        router.push({
                                            pathname: "/report/[deliveryId]",
                                            params: { deliveryId: id as string },
                                        });
                                    }}
                                >
                                    Report
                                </Button>
                            )}

                        {data?.order?.order_payment_status === "paid" &&
                            (data?.order?.owner_id === user?.sub ||
                                data?.order?.vendor_id === user?.sub) && (
                                <Button
                                    size={"$4"}
                                    backgroundColor={"$cardDark"}
                                    width={
                                        data?.delivery?.delivery_status === "received"
                                            ? "32%"
                                            : "100%"
                                    }
                                    textAlign="center"
                                    fontSize={12}
                                    fontFamily={"$body"}
                                    color={"$text"}
                                    fontWeight={"500"}
                                    pressStyle={{ backgroundColor: "$cardDarkHover" }}
                                    onPressIn={() => {
                                        router.push({
                                            pathname: "/receipt/[deliveryId]",
                                            params: { deliveryId: id as string },
                                        });
                                    }}
                                >
                                    Receipt
                                </Button>
                            )}
                    </XStack>
                </Card>
            </DeliveryWrapper>
        </>
    );
};

export default ItemDetails;

const styles = StyleSheet.create({});
