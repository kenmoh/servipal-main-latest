import { StyleSheet, Share, Platform, Dimensions } from "react-native";
import React from "react";
import { View, YStack, Text, XStack, Card, Paragraph, Button } from "tamagui";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchDelivery } from "@/api/order";
import LoadingIndicator from "@/components/LoadingIndicator";
import { format } from "date-fns";
import { Download, Share2 } from "lucide-react-native";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Notifier, NotifierComponents } from "react-native-notifier";
import * as Print from 'expo-print';

const ReceiptPage = () => {
    const { deliveryId } = useLocalSearchParams();
    const screenWidth = Dimensions.get('window').width;

    const { data, isLoading } = useQuery({
        queryKey: ["delivery", deliveryId],
        queryFn: () => fetchDelivery(deliveryId as string),
    });

    const generateReceiptHTML = () => {
        if (!data) return '';

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
                        }
                        
                        .container {
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        
                        .header { 
                            text-align: center; 
                            margin-bottom: 30px;
                            padding-bottom: 20px;
                            border-bottom: 2px solid #f0f0f0;
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
                            <h1>Receipt</h1>
                        </div>
                        
                        <div class="section">
                            <div class="row">
                                <span>Order Number</span>
                                <span>#${data.order?.order_number}</span>
                            </div>
                            <div class="row">
                                <span>Date</span>
                                <span>${format(new Date(data.delivery?.created_at || ""), "PPP")}</span>
                            </div>
                            <div class="row">
                                <span>Delivery Fee</span>
                                <span class="amount">₦${Number(data.delivery?.delivery_fee).toFixed(2)}</span>
                            </div>
                            <div class="row total">
                                <span>Total Amount</span>
                                <span class="amount">₦${Number(data.order?.total_price).toFixed(2)}</span>
                            </div>
                            <div class="row">
                                <span>Payment Status</span>
                                <span class="status-${data.order?.order_payment_status === 'paid' ? 'paid' : 'unpaid'}">
                                    ${data.order?.order_payment_status?.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div class="section">
                            <h2>Delivery Details</h2>
                            <div class="row">
                                <span>From</span>
                                <span>${data.delivery?.origin}</span>
                            </div>
                            <div class="row">
                                <span>To</span>
                                <span>${data.delivery?.destination}</span>
                            </div>
                            <div class="row">
                                <span>Status</span>
                                <span>${data.delivery?.delivery_status?.toUpperCase()}</span>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p>Thank you for using Servipal</p>
                            <p>This is a computer-generated receipt and does not require a signature.</p>
                        </div>
                    </div>
                </body>
            </html>
        `;
    };

    const handleDownload = async () => {
        try {
            const html = generateReceiptHTML();
            const { uri } = await Print.printToFileAsync({
                html,
                width: screenWidth,
                height: screenWidth * 1.4,
                base64: false
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, {
                    mimeType: 'application/pdf',
                    dialogTitle: `Receipt #${data?.order?.order_number}`,
                    UTI: 'com.adobe.pdf'
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
                description: "Failed to generate PDF",
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
                base64: false
            });

            await Share.share({
                url: uri,
                title: `Receipt #${data?.order?.order_number}`,
            });
        } catch (error) {
            Notifier.showNotification({
                title: "Error",
                description: "Failed to share receipt",
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "error" },
            });
        }
    };

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <View backgroundColor={"$background"} flex={1} padding="$4">
            <YStack gap="$4">
                <Text fontSize={20} fontWeight="bold" textAlign="center">Receipt</Text>

                <Card padding="$4" backgroundColor={"$cardBackground"}>
                    <YStack gap="$3">
                        <XStack justifyContent="space-between">
                            <Text>Order Number</Text>
                            <Text fontWeight="bold">#{data?.order?.order_number}</Text>
                        </XStack>

                        <XStack justifyContent="space-between">
                            <Text>Date</Text>
                            <Text>{format(new Date(data?.delivery?.created_at || ""), "PPP")}</Text>
                        </XStack>

                        <XStack justifyContent="space-between">
                            <Text>Delivery Fee</Text>
                            <Text>₦{Number(data?.delivery?.delivery_fee).toFixed(2)}</Text>
                        </XStack>

                        <XStack justifyContent="space-between">
                            <Text>Total Amount</Text>
                            <Text fontWeight="bold">₦{Number(data?.order?.total_price).toFixed(2)}</Text>
                        </XStack>

                        <XStack justifyContent="space-between">
                            <Text>Payment Status</Text>
                            <Text color={data?.order?.order_payment_status === "paid" ? "green" : "red"}>
                                {data?.order?.order_payment_status?.toUpperCase()}
                            </Text>
                        </XStack>
                    </YStack>
                </Card>

                <Card padding="$4" backgroundColor={"$cardBackground"}>
                    <YStack gap="$3">
                        <Text fontWeight="bold">Delivery Details</Text>

                        <XStack justifyContent="space-between">
                            <Text>From</Text>
                            <Text>{data?.delivery?.origin}</Text>
                        </XStack>

                        <XStack justifyContent="space-between">
                            <Text>To</Text>
                            <Text>{data?.delivery?.destination}</Text>
                        </XStack>

                        <XStack justifyContent="space-between">
                            <Text>Status</Text>
                            <Text>{data?.delivery?.delivery_status?.toUpperCase()}</Text>
                        </XStack>
                    </YStack>
                </Card>

                <XStack gap="$2" justifyContent="space-between">
                    <Button
                        flex={1}
                        backgroundColor={"$btnPrimaryColor"}
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
        </View>
    );
};

export default ReceiptPage; 