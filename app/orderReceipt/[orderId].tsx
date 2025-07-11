import {
    StyleSheet,
    Share,
    Platform,
    Dimensions,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import React from "react";
import {
    View,
    YStack,
    Text,
    XStack,
    Card,
    Paragraph,
    Button,
    useTheme,
} from "tamagui";
import { router, useLocalSearchParams } from "expo-router";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { fetchDelivery, riderAcceptDelivery, updateOrderStatus } from "@/api/order";
import LoadingIndicator from "@/components/LoadingIndicator";
import { format } from "date-fns";
import { Download, Share2 } from "lucide-react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Notifier, NotifierComponents } from "react-native-notifier";
import * as Print from "expo-print";
import { useAuth } from "@/context/authContext";

const OrderReceiptPage = () => {
    const { orderId, paymentStatus } = useLocalSearchParams();
    const screenWidth = Dimensions.get("window").width;
    const theme = useTheme();
    const { user } = useAuth()

    const { data, isLoading } = useQuery({
        queryKey: ["order", orderId],
        queryFn: () => fetchDelivery(orderId as string),
    });

    const handleGotoPayment = () => {
        router.push({
            pathname: "/payment/[orderId]",
            params: {
                orderId: data?.order.id ?? "",
                deliveryFee: data?.delivery?.delivery_fee,
                orderNumber: data?.order?.order_number,
                deliveryType: `${data?.order?.require_delivery === "delivery"
                    ? data?.delivery?.delivery_type
                    : data?.order?.order_type
                    }`,
                orderItems: JSON.stringify(data?.order.order_items ?? []),
                paymentLink: data?.order.payment_link,
                orderType: data?.order?.order_type || data?.delivery?.delivery_type,
            },
        })
    }

    const generateReceiptHTML = () => {
        if (!data) return "";

        // Function to truncate long text
        const truncateText = (text: string, maxLength: number = 150) => {
            if (!text) return "";
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + "...";
        };

        return `
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
                        
                        body { 
                            font-family: 'Poppins', sans-serif;
                            padding: 20px;
                            color: #333;
                            background-color: #fff;
                            margin: 0;
                            line-height: 1.6;
                            height: 100vh;
                            overflow-y: auto;
                        }
                        
                        .container {
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 20px;
                            min-height: 100%;
                        }
                        
                        .header { 
                            text-align: center; 
                            margin-bottom: 30px;
                            padding-bottom: 20px;
                            border-bottom: 2px solid #f0f0f0;
                        }

                        .logo {
                            width: 80px;
                            height: 80px;
                            margin: 0 auto 12px;
                            display: block;
                        }
                        
                        .header h1 {
                            color: #333;
                            margin: 0;
                            font-size: 24px;
                            font-weight: 600;
                        }
                        
                        .section { 
                            margin-bottom: 25px;
                            padding: 20px;
                            background-color: #f8f9fa;
                            border-radius: 12px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                        }
                        
                        .section h2 {
                            color: #444;
                            margin: 0 0 15px 0;
                            font-size: 18px;
                            font-weight: 500;
                        }
                        
                        .row { 
                            display: flex; 
                            justify-content: space-between; 
                            margin-bottom: 12px;
                            padding: 8px 0;
                            gap: 5px;
                            border-bottom: 1px solid #eee;
                        }
                        
                        .row:last-child {
                            border-bottom: none;
                        }
                        
                        .row span:first-child {
                            color: #666;
                            font-weight: 400;
                        }
                        
                        .row span:last-child {
                            font-weight: 500;
                        }
                        
                        .total { 
                            font-weight: 600;
                            font-size: 1.1em;
                            color: #000;
                            background-color: #f0f0f0;
                            padding: 10px;
                            border-radius: 6px;
                            margin-top: 10px;
                        }
                        
                        .status-paid {
                            color: #28a745;
                            font-weight: 600;
                        }
                        
                        .status-unpaid {
                            color: #dc3545;
                            font-weight: 600;
                        }
                        
                        .amount {
                            font-family: 'Poppins', monospace;
                            font-weight: 600;
                        }

                        .address-info {
                            display: flex;
                            flex-direction: column;
                            gap: 4px;
                            margin-bottom: 12px;
                        }

                        .address-label {
                            font-weight: 600;
                            color: #666;
                            font-size: 13px;
                        }

                        .address-value {
                            color: #4a4a4a;
                            font-size: 13px;
                            line-height: 1.4;
                            word-wrap: break-word;
                            overflow-wrap: break-word;
                            max-width: 100%;
                            padding: 8px;
                            background-color: #fff;
                            border-radius: 6px;
                            border: 1px solid #eee;
                        }
                        
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 2px solid #f0f0f0;
                            color: #666;
                            font-size: 12px;
                        }
                        
                        @media print {
                            body {
                                padding: 0;
                            }
                            .section {
                                break-inside: avoid;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            // <img src="android-icon.png" class="logo" alt="ServiPal Logo" />
                            <h1>Receipt</h1>
                        </div>
                        
                        <div class="section">
                            <div class="row">
                                <span>Order Number</span>
                                <span>#${data.order?.order_number}</span>
                            </div>
                            <div class="row">
                                <span>Date</span>
                                <span>${format(
            new Date(data.order?.created_at || ""),
            "PPP"
        )}</span>
                            </div>
                            ${data?.order.order_items.length > 0
                ? `
                                <div class="row">
                                    <span>Items Total</span>
                                    <span class="amount">₦${Number(
                    data.order?.total_price ||
                    0 -
                    Number(
                        data.delivery?.delivery_fee || 0
                    )
                ).toFixed(2)}</span>
                                </div>
                            `
                : ""
            }
                          
                            <div class="row total">
                                <span>Total Amount</span>
                                <span class="amount">₦${Number(
                data.order?.total_price
            ).toFixed(2)}</span>
                            </div>
                            <div class="row">
                                <span>Payment Status</span>
                                <span class="status-${data.order?.order_payment_status === "paid"
                ? "paid"
                : "unpaid"
            }">
                                    ${data.order?.order_payment_status?.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        ${data.order?.order_items &&
                data.order.order_items.length > 0
                ? `
                            <div class="section">
                                <h2>Order Items</h2>
                                ${data.order.order_items
                    .map(
                        (item: any) => `
                                    <div class="row">
                                        <span>${item.quantity}X  ${item.name
                            }</span>
                                        <span class="amount">₦${Number(
                                item.price * item.quantity
                            ).toFixed(2)}</span>
                                    </div>
                                `
                    )
                    .join("")}
                            </div>
                        `
                : ""
            }

                        <div class="section">
                            <h2>Delivery Details</h2>
                            <div class="address-info">
                                <div class="address-label">Delivery Type</div>
                                <div class="address-value">${truncateText(
                data.order?.require_delivery || ""
            )}</div>
                            </div>
                           
                            <div class="row" style="margin-top: 12px;">
                                <span>Status</span>
                                <span>${data.order?.order_status?.toUpperCase()}</span>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p>Thank you for using ServiPal</p>
                            <p>This is a computer-generated receipt and does not require a signature.</p>
                        </div>
                    </div>
                </body>
            </html>
        `;
    };

    const queryClient = new QueryClient()
    const vendorDeliveryMutation = useMutation({
        mutationFn: () => updateOrderStatus(data?.order?.id as string),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["order", orderId],
            });
            queryClient.invalidateQueries({
                queryKey: ["deliveries"],
            });
            queryClient.invalidateQueries({
                queryKey: ["deliveries", user?.sub],
            });

            Notifier.showNotification({
                title: "Success",
                description: "This order has been assigned to you. Drive carefully!",
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "success" },
            });
            router.back()
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
    const customerreceivedMutation = useMutation({
        mutationFn: () => updateOrderStatus(data?.order?.id as string),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["order", orderId],
            });
            queryClient.invalidateQueries({
                queryKey: ["deliveries"],
            });
            queryClient.invalidateQueries({
                queryKey: ["orders", data?.order?.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["deliveries", user?.sub],
            });

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

    const handleDownload = async () => {
        try {
            const html = generateReceiptHTML();
            const { uri } = await Print.printToFileAsync({
                html,
                width: screenWidth,
                height: screenWidth * 1.4,
                base64: false,
            });

            // Create a filename for the PDF
            const fileName = `Receipt_${data?.order?.order_number || "unknown"}.pdf`;
            const destinationUri = `${FileSystem.documentDirectory}${fileName}`;

            // Copy the PDF to the documents directory
            await FileSystem.copyAsync({
                from: uri,
                to: destinationUri,
            });

            Notifier.showNotification({
                title: "Success",
                description: "Receipt downloaded successfully",
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "success" },
            });
        } catch (error) {
            console.error("Download error:", error);
            Notifier.showNotification({
                title: "Error",
                description: "Failed to download receipt",
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "error" },
            });
        }
    };




    const handleShare = async () => {
        try {
            const html = generateReceiptHTML();
            const { uri } = await Print.printToFileAsync({
                html,
                width: screenWidth,
                height: screenWidth * 1.4,
                base64: false,
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, {
                    mimeType: "application/pdf",
                    dialogTitle: `Receipt #${data?.order?.order_number}`,
                    UTI: "com.adobe.pdf",
                });
            } else {
                Notifier.showNotification({
                    title: "Error",
                    description: "Sharing is not available on this device",
                    Component: NotifierComponents.Alert,
                    componentProps: { alertType: "error" },
                });
            }
        } catch (error) {
            Notifier.showNotification({
                title: "Error",
                description: "Failed to share receipt",
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "error" },
            });
        }
    };



    const getActionButton = () => {
        if (!data || !user) return null;

        // Vendor can mark order as delivered
        if (
            data?.order?.order_status === "pending" &&
            user?.sub === data?.order?.vendor_id
        ) {
            return {
                label: "Delivered",
                onPress: () => vendorDeliveryMutation.mutate(),
                loading: vendorDeliveryMutation.isPending,
            };
        }
        // Customer mark order received
        if (
            (data?.order?.order_status === "delivered" &&
                user?.sub === data?.order?.user_id)
        ) {
            return {
                label: "Confirm Received",
                onPress: () => customerreceivedMutation.mutate(),
                loading: customerreceivedMutation.isPending,
            };
        }


        return null;
    };

    const actionButton = getActionButton();

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: theme.background.val,
                alignContent: "center",
            }}
        >
            <YStack gap="$4" paddingHorizontal='$3' style={{ flex: 1, overflow: "scroll" }}>
                {/* <Text fontSize={20} fontWeight="bold" textAlign="center">Receipt</Text> */}

                <Card padding="$4" backgroundColor={"$cardBackground"} bordered>
                    <YStack gap="$3">
                        <XStack justifyContent="space-between">
                            <Text>Order Number</Text>
                            <Text fontWeight="bold">#{data?.order?.order_number}</Text>
                        </XStack>

                        <XStack justifyContent="space-between">
                            <Text>Date</Text>
                            <Text>
                                {format(new Date(data?.order?.created_at || ""), "PPP")}
                            </Text>
                        </XStack>

                        <XStack justifyContent="space-between">
                            <Text>Total Amount</Text>
                            <Text fontWeight="bold">
                                ₦{Number(data?.order?.total_price).toFixed(2)}
                            </Text>
                        </XStack>

                        <XStack justifyContent="space-between">
                            <Text>Payment Status</Text>
                            <Text
                                color={
                                    data?.order?.order_payment_status === "paid" ? "green" : "red"
                                }
                            >
                                {data?.order?.order_payment_status?.toUpperCase()}
                            </Text>
                        </XStack>
                    </YStack>
                </Card>

                {data?.order?.order_items && data.order.order_items.length > 0 && (
                    <Card padding="$4" backgroundColor={"$cardBackground"} bordered>
                        <YStack gap="$3">
                            <Text fontWeight="bold">Order Items</Text>
                            {data.order.order_items.map((item: any) => (
                                <XStack key={item.id} justifyContent="space-between">
                                    <Text>
                                        {item.quantity}X {item.name}
                                    </Text>
                                    <Text>₦{Number(item.price * item.quantity).toFixed(2)}</Text>
                                </XStack>
                            ))}
                        </YStack>
                    </Card>
                )}

                <Card padding="$4" backgroundColor={"$cardBackground"} bordered>
                    <YStack gap="$3">
                        <Text fontWeight="bold">Delivery Details</Text>

                        <XStack justifyContent="space-between">
                            <Text color="$gray11">Delivery Type</Text>
                            <Text numberOfLines={2} ellipsizeMode="tail">
                                {data?.order?.require_delivery?.toUpperCase()}
                            </Text>
                        </XStack>
                        <XStack justifyContent="space-between">
                            <Text>Status</Text>
                            <Text>{data?.order?.order_status?.toUpperCase()}</Text>
                        </XStack>
                    </YStack>
                </Card>

                {actionButton && paymentStatus === "paid" && <Button
                    size={"$4"}
                    backgroundColor={actionButton.loading ? "$cardDark" : "$btnPrimaryColor"}
                    width="90%"
                    alignSelf="center"
                    textAlign="center"
                    fontSize={16}
                    fontFamily={"$body"}
                    color={"$text"}
                    fontWeight={"500"}
                    disabled={actionButton.loading}
                    pressStyle={{ backgroundColor: "$cardDarkHover" }}
                    onPressIn={actionButton.onPress}
                >
                    {actionButton.loading ? <ActivityIndicator size={'small'} color={theme.text.val} /> : actionButton.label}

                </Button>}
                {paymentStatus !== "paid" && <Button
                    size={"$4"}
                    backgroundColor={"$btnPrimaryColor"}
                    width="90%"
                    alignSelf="center"
                    textAlign="center"
                    fontSize={16}
                    fontFamily={"$body"}
                    color={"$text"}
                    fontWeight={"500"}
                    pressStyle={{ backgroundColor: "$cardDarkHover" }}
                    onPressIn={handleGotoPayment}
                >
                    P A Y

                </Button>}

                <XStack
                    gap="$2"
                    justifyContent="space-between"
                    width={"90%"}
                    alignSelf="center"
                    marginBottom={"$3"}
                >
                    <Button
                        flex={1}
                        backgroundColor={"$transparentBtnPrimaryColor"}
                        icon={<Download color="white" />}
                        onPress={handleDownload}
                    >
                        Download PDF
                    </Button>
                    <Button
                        flex={1}
                        backgroundColor={"$cardDark"}
                        icon={<Share2 color="white" />}
                        onPress={handleShare}
                    >
                        Share PDF
                    </Button>
                </XStack>

            </YStack>
            <XStack
                marginTop="$4"
                gap="$2"
                width="90%"
                alignSelf="center"
                justifyContent="space-between"
            >
                <>
                    <Button
                        size={"$4"}
                        backgroundColor={"$cardDark"}
                        width="42.5%"
                        textAlign="center"
                        fontSize={12}
                        fontFamily={"$body"}
                        color={"$text"}
                        fontWeight={"500"}
                        pressStyle={{ backgroundColor: "$cardDarkHover" }}
                        onPressIn={() => {
                            router.push({
                                pathname: "/review/[deliveryId]",

                                params: {
                                    deliveryId: data?.order?.id as string,
                                    revieweeId: data?.order?.vendor_id as string,
                                    orderType: 'order',
                                    orderId: data?.order?.id as string,

                                },
                            });
                        }}
                    >
                        Review
                    </Button>

                    <Button
                        size={"$4"}
                        backgroundColor={"$cardDark"}
                        width="42.5%"
                        textAlign="center"
                        fontSize={12}
                        fontFamily={"$body"}
                        color={"$text"}
                        fontWeight={"500"}
                        pressStyle={{ backgroundColor: "$cardDarkHover" }}
                        onPressIn={() => {
                            router.push({
                                pathname: "/report/[deliveryId]",
                                params: { deliveryId: data?.order?.id as string },
                            });
                        }}
                    >
                        Report
                    </Button>
                </>
            </XStack>
        </ScrollView>
    );
};

export default OrderReceiptPage;
