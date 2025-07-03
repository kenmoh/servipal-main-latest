import { StyleSheet, Share, Platform, Dimensions, ScrollView } from "react-native";
import React from "react";
import { View, YStack, Text, XStack, Card, Paragraph, Button, useTheme } from "tamagui";
import { router, useLocalSearchParams } from "expo-router";
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
    const theme = useTheme()

    const { data, isLoading } = useQuery({
        queryKey: ["delivery", deliveryId],
        queryFn: () => fetchDelivery(deliveryId as string),
    });

    const generateReceiptHTML = () => {
        if (!data) return '';

        // Function to truncate long text
        const truncateText = (text: string, maxLength: number = 150) => {
            if (!text) return '';
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + '...';
        };

        // Calculate total: sum of items total and delivery fee if present
        const itemsTotal = Number(data.order?.total_price || 0);
        const deliveryFee = Number(data.delivery?.delivery_fee || 0);
        const total = itemsTotal + deliveryFee;

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
                                <span>${format(new Date(data.delivery?.created_at || ""), "PPP")}</span>
                            </div>
                            ${data.order?.order_items && data.order.order_items.length > 0 ? `
                                <div class="row">
                                    <span>Items Total</span>
                                    <span class="amount">₦${itemsTotal.toFixed(2)}</span>
                                </div>
                            ` : ''}
                            ${data.delivery?.delivery_fee ? `
                                <div class="row">
                                    <span>Delivery Fee</span>
                                    <span class="amount">₦${deliveryFee.toFixed(2)}</span>
                                </div>
                            ` : ''}
                            <div class="row total">
                                <span>Total Amount</span>
                                <span class="amount">₦${total.toFixed(2)}</span>
                            </div>
                            <div class="row">
                                <span>Payment Status</span>
                                <span class="status-${data.order?.order_payment_status === 'paid' ? 'paid' : 'unpaid'}">
                                    ${data.order?.order_payment_status?.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        ${data.order?.order_items && data?.order?.order_type !== 'package' && data.order.order_items.length > 0 ? `
                            <div class="section">
                                <h2>Order Items</h2>
                                ${data.order.order_items.map((item: any) => `
                                    <div class="row">
                                        <span>${item.quantity}X  ${item.name}</span>
                                        <span class="amount">₦${Number(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}

                        <div class="section">
                            <h2>Delivery Details</h2>
                            <div class="address-info">
                                <div class="address-label">From</div>
                                <div class="address-value">${truncateText(data.delivery?.origin || '')}</div>
                            </div>
                            <div class="address-info">
                                <div class="address-label">To</div>
                                <div class="address-value">${truncateText(data.delivery?.destination || '')}</div>
                            </div>
                            <div class="row" style="margin-top: 12px;">
                                <span>Status</span>
                                <span>${data.delivery?.delivery_status?.toUpperCase()}</span>
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

    const handleDownload = async () => {
        try {
            const html = generateReceiptHTML();
            const { uri } = await Print.printToFileAsync({
                html,
                width: screenWidth,
                height: screenWidth * 1.4,
                base64: false
            });

            // Create a filename for the PDF
            const fileName = `Receipt_${data?.order?.order_number || 'unknown'}.pdf`;
            const destinationUri = `${FileSystem.documentDirectory}${fileName}`;

            // Copy the PDF to the documents directory
            await FileSystem.copyAsync({
                from: uri,
                to: destinationUri
            });

            Notifier.showNotification({
                title: "Success",
                description: "Receipt downloaded successfully",
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "success" },
            });
        } catch (error) {
            console.error('Download error:', error);
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
                description: "Failed to share receipt",
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "error" },
            });
        }
    };

    if (isLoading) {
        return <LoadingIndicator />;
    }

    if (!data) {
        return null;
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: theme.background.val, alignContent: 'center' }} >
            <YStack gap="$4" style={{ flex: 1, overflow: 'scroll' }}>
                {/* <Text fontSize={20} fontWeight="bold" textAlign="center">Receipt</Text> */}

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

                        {data?.order?.order_items && data?.order?.order_type !== 'package' && data.order.order_items.length > 0 && (
                            <XStack justifyContent="space-between">
                                <Text>Items Total</Text>
                                <Text>₦{(Number(data.order?.total_price || 0)).toFixed(2)}</Text>
                            </XStack>
                        )}

                        {data?.delivery?.delivery_fee && (
                            <XStack justifyContent="space-between">
                                <Text>Delivery Fee</Text>
                                <Text>₦{Number(data.delivery.delivery_fee).toFixed(2)}</Text>
                            </XStack>
                        )}

                        <XStack justifyContent="space-between">
                            <Text>Total Amount</Text>
                            <Text fontWeight="bold">₦{(
                                (Number(data.order?.total_price || 0) + Number(data.delivery?.delivery_fee || 0))).toFixed(2)}</Text>
                        </XStack>

                        <XStack justifyContent="space-between">
                            <Text>Payment Status</Text>
                            <Text color={data?.order?.order_payment_status === "paid" ? "green" : "red"}>
                                {data?.order?.order_payment_status?.toUpperCase()}
                            </Text>
                        </XStack>
                    </YStack>
                </Card>

                {data?.order?.order_items && data?.order?.order_type !== 'package' && data.order.order_items.length > 0 && (
                    <Card padding="$4" backgroundColor={"$cardBackground"}>
                        <YStack gap="$3">
                            <Text fontWeight="bold">Order Items</Text>
                            {data.order.order_items.map((item: any) => (
                                <XStack key={item.id} justifyContent="space-between">
                                    <Text>{item.quantity}X {item.name}</Text>
                                    <Text>₦{Number(item.price * item.quantity).toFixed(2)}</Text>
                                </XStack>
                            ))}
                        </YStack>
                    </Card>
                )}

                <Card padding="$4" backgroundColor={"$cardBackground"}>
                    <YStack gap="$3">
                        <Text fontWeight="bold">Delivery Details</Text>

                        <YStack gap="$2">
                            <Text color="$gray11">From</Text>
                            <Text numberOfLines={2} ellipsizeMode="tail">{data?.delivery?.origin}</Text>
                        </YStack>

                        <YStack gap="$2">
                            <Text color="$gray11">To</Text>
                            <Text numberOfLines={2} ellipsizeMode="tail">{data?.delivery?.destination}</Text>
                        </YStack>

                        <XStack justifyContent="space-between">
                            <Text>Status</Text>
                            <Text>{data?.delivery?.delivery_status?.toUpperCase()}</Text>
                        </XStack>
                    </YStack>
                </Card>

                <XStack gap="$2" justifyContent="space-between" width={'90%'} alignSelf="center" marginBottom={'$3'}>
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
                    <Button
                        flex={1}
                        backgroundColor={"$cardDark"}
                        icon={<Share2 color="white" />}
                        onPress={() => router.push('/payment/transfer-detail')}
                    >
                        Share PDF
                    </Button>
                </XStack>


            </YStack>
        </ScrollView>
    );
};

export default ReceiptPage; 