import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { YStack, XStack, Card, Button, useTheme, Text } from 'tamagui';
import { CheckCircle, Copy, Info } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import type { InitBankTransferResponse } from '../../types/payment';
import { useLocalSearchParams } from 'expo-router';

// Example dummy data for preXStack
const dummyTransfer: InitBankTransferResponse = {
    status: 'success',
    message: 'Bank transfer account generated',
    transfer_reference: 'TRF-20250703-123456',
    account_expiration: '2025-07-04T12:00:00Z',
    transfer_account: '1234567890',
    transfer_bank: 'Zenith Bank',
    transfer_amount: '5000',
    transfer_note: 'SP-ORDER-20250703',
    mode: 'manual',
};

const ProgressBar = ({ status }: { status: string }) => {
    const isSuccess = status === 'success';
    const progress = useSharedValue(0);

    useEffect(() => {
        if (!isSuccess) {
            progress.value = withRepeat(
                withTiming(1, { duration: 1800, easing: Easing.linear }),
                -1,
                false
            );
        } else {
            progress.value = withTiming(1, { duration: 400 });
        }
    }, [isSuccess]);

    const animatedStyle = useAnimatedStyle(() => {
        return !isSuccess
            ? {
                width: progress.value * 160, // progress bar grows from 0 to 100%
            }
            : { width: 160 };
    });

    return (
        <View style={{ width: '90%', alignSelf: 'center', height: 18, marginBottom: 18, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <View style={{ width: 160, height: 2, backgroundColor: '#e5e7eb', borderRadius: 8, overflow: 'hidden', position: 'relative', flexDirection: 'row', alignItems: 'center' }}>
                <Animated.View
                    style={[
                        {
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: 2,
                            borderRadius: 8,
                            backgroundColor: '#20BF6B',
                        },
                        animatedStyle,
                    ]}
                />
            </View>
            {isSuccess && (
                <CheckCircle size={18} color="#20BF6B" style={{ marginLeft: 8 }} />
            )}
        </View>
    );
};

const TransferDetailScreen = ({ transfer = dummyTransfer }: { transfer?: InitBankTransferResponse }) => {
    const theme = useTheme();
    const { data } = useLocalSearchParams()

    const parsedData = data ? JSON.parse(data as string) as InitBankTransferResponse : null;


    const handleCopy = async (value: string) => {
        await Clipboard.setStringAsync(value);
    };

    return (
        <YStack flex={1} backgroundColor={theme.background.val} paddingVertical={24} paddingHorizontal={'$3'} gap={18}>
            <ProgressBar status={'success'} />
            <Card bordered elevate size="$5" backgroundColor={theme.cardBackground.val} padding={22} borderRadius={18}>
                <XStack alignItems="center" gap={10} marginBottom={18}>
                    <CheckCircle color={theme.green10.val} size={22} />
                    <Text style={{ fontWeight: 'bold', fontSize: 14, color: theme.green10.val }}>
                        {parsedData?.status === 'success' ? `${parsedData?.message}` : 'Transfer Pending'}
                    </Text>
                </XStack>

                <YStack gap={14} marginTop={'$5'}>
                    <XStack alignItems="center" justifyContent="space-between">
                        <Text style={styles.label}>Bank</Text>
                        <Text color={'$text'}>{parsedData?.transfer_bank}</Text>
                    </XStack>
                    <XStack alignItems="center" justifyContent="space-between">
                        <Text style={styles.label}>Account Number</Text>
                        <XStack gap={'$2'}>
                            <Text color={'$text'}>{parsedData?.transfer_account}</Text>
                            <TouchableOpacity onPress={() => handleCopy(parsedData?.transfer_account ?? '')}>
                                <Copy size={18} color={theme.icon.val} />
                            </TouchableOpacity>
                        </XStack>
                    </XStack>
                    <XStack alignItems="center" justifyContent="space-between">
                        <Text style={styles.label}>Amount</Text>
                        <Text color={'$btnPrimaryColor'} fontSize={'$4'}>₦{parsedData?.transfer_amount}</Text>
                    </XStack>
                    <XStack alignItems="center" justifyContent="space-between">
                        <Text style={styles.label}>Reference</Text>
                        <XStack gap='$2'>
                            <Text color={'$text'}>{parsedData?.transfer_reference}</Text>
                            <TouchableOpacity onPress={() => handleCopy(parsedData?.transfer_reference ?? '')}>
                                <Copy size={18} color={theme.icon.val} />
                            </TouchableOpacity>
                        </XStack>
                    </XStack>
                    <XStack alignItems="center" justifyContent="space-between">
                        <Text style={styles.label}>Mode</Text>
                        <XStack>
                            <Text color={'$text'}>{parsedData?.mode}</Text>

                        </XStack>
                    </XStack>
                    <XStack alignItems="center" justifyContent="space-between">
                        <Text style={styles.label}>Note</Text>
                        <XStack>
                            <Text color={'$text'}>{parsedData?.transfer_note}</Text>
                            {/* <TouchableOpacity onPress={() => handleCopy(parsedData?.transfer_note ?? '')}>
                                <Copy size={18} color={theme.icon.val} />
                            </TouchableOpacity> */}
                        </XStack>
                    </XStack>
                    <XStack alignItems="center" justifyContent="space-between">
                        <Text style={styles.label}>Expires</Text>
                        <Text color={'$red10'}>
                            {parsedData?.account_expiration &&
                                (() => {
                                    // Try to parse with Date, fallback to manual parsing
                                    const raw = parsedData.account_expiration;
                                    let dateObj = new Date(raw);
                                    if (isNaN(dateObj.getTime())) {
                                        // Try to convert 'YYYY-MM-DD h:mm:ss AM/PM' to ISO
                                        const match = raw.match(/(\d{4}-\d{2}-\d{2}) (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)/);
                                        if (match) {
                                            let [_, ymd, h, m, s, ap] = match;
                                            let hour = parseInt(h, 10);
                                            if (ap === 'PM' && hour < 12) hour += 12;
                                            if (ap === 'AM' && hour === 12) hour = 0;
                                            // Pad hour
                                            const hourStr = hour.toString().padStart(2, '0');
                                            const iso = `${ymd}T${hourStr}:${m}:${s}`;
                                            dateObj = new Date(iso);
                                        }
                                    }
                                    return !isNaN(dateObj.getTime()) ? dateObj.toLocaleString() : '--';
                                })()
                            }
                        </Text>
                    </XStack>
                </YStack>
                <YStack marginTop={24} gap={8}>
                    <XStack alignItems="center" gap={8}>
                        <Info size={18} color={theme.yellow10.val} />
                        <Text style={{ color: theme.yellow10.val, fontSize: 13, fontWeight: 'bold' }}>Important</Text>
                    </XStack>
                    <Text style={{ color: theme.gray10.val, fontSize: 14 }}>
                        Please transfer the exact amount to the above account. Use the reference and note as provided. The account will expire at the stated time.
                    </Text>
                </YStack>
                <Button marginTop={24} size="$4" fontSize={'$2'} backgroundColor={'$btnPrimaryColor'} color="white" borderRadius={12}>
                    I have made the transfer
                </Button>
            </Card>
        </YStack>
    );
};

const styles = StyleSheet.create({
    label: {
        color: '#888',
        fontSize: 14,
        fontWeight: '500',
    },
    value: {
        color: '#222',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default TransferDetailScreen;
