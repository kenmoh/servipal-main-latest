import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { YStack, XStack, Card, Button, useTheme, Text } from 'tamagui';
import { CheckCircle, Copy, Info } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import type { InitBankTransferResponse } from '../../types/payment';

// Example dummy data for preXStack
const dummyTransfer: InitBankTransferResponse = {
    status: 'success',
    message: 'Bank transfer account generated',
    transfer_reference: 'TRF-20250703-123456',
    account_expiration: '2025-07-04T12:00:00Z',
    transfer_acount: '1234567890',
    transfer_bank: 'Zenith Bank',
    transfer_amount: '5000',
    transfer_note: 'SP-ORDER-20250703',
    mode: 'manual',
};

const TransferDetailScreen = ({ transfer = dummyTransfer }: { transfer?: InitBankTransferResponse }) => {
    const theme = useTheme();

    const handleCopy = async (value: string) => {
        await Clipboard.setStringAsync(value);
    };

    return (
        <YStack flex={1} backgroundColor={theme.background.val} paddingVertical={24} paddingHorizontal={'$3'} gap={18}>
            <Card bordered elevate size="$5" backgroundColor={theme.cardBackground.val} padding={22} borderRadius={18}>
                <XStack alignItems="center" gap={10} marginBottom={18}>
                    <CheckCircle color={theme.green10.val} size={28} />
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: theme.green10.val }}>
                        {transfer.status === 'success' ? 'Transfer Account Created' : 'Transfer Pending'}
                    </Text>
                </XStack>
                <Text color={'$text'} fontSize={'$4'}>{transfer.message}</Text>
                <YStack gap={14} marginTop={'$5'}>
                    <XStack alignItems="center" justifyContent="space-between">
                        <Text style={styles.label}>Bank</Text>
                        <Text color={'$text'}>{transfer.transfer_bank}</Text>
                    </XStack>
                    <XStack alignItems="center" justifyContent="space-between">
                        <Text style={styles.label}>Account Number</Text>
                        <XStack gap={'$1'}>
                            <Text color={'$text'}>{transfer.transfer_acount}</Text>
                            <TouchableOpacity onPress={() => handleCopy(transfer.transfer_acount)}>
                                <Copy size={18} color={theme.icon.val} />
                            </TouchableOpacity>
                        </XStack>
                    </XStack>
                    <XStack alignItems="center" justifyContent="space-between">
                        <Text style={styles.label}>Amount</Text>
                        <Text color={'$btnPrimaryColor'} fontSize={'$4'}>₦{transfer.transfer_amount}</Text>
                    </XStack>
                    <XStack alignItems="center" justifyContent="space-between">
                        <Text style={styles.label}>Reference</Text>
                        <XStack >
                            <Text color={'$text'}>{transfer.transfer_reference}</Text>
                            <TouchableOpacity onPress={() => handleCopy(transfer.transfer_reference)}>
                                <Copy size={18} color={theme.icon.val} />
                            </TouchableOpacity>
                        </XStack>
                    </XStack>
                    <XStack alignItems="center" justifyContent="space-between">
                        <Text style={styles.label}>Note</Text>
                        <XStack>
                            <Text color={'$text'}>{transfer.transfer_note}</Text>
                            <TouchableOpacity onPress={() => handleCopy(transfer.transfer_note)}>
                                <Copy size={18} color={theme.icon.val} />
                            </TouchableOpacity>
                        </XStack>
                    </XStack>
                    <XStack alignItems="center" justifyContent="space-between">
                        <Text style={styles.label}>Expires</Text>
                        <Text color={'$red10'}>{new Date(transfer.account_expiration).toLocaleString()}</Text>
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
