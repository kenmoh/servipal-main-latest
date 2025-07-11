import { useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { Notifier, NotifierComponents } from 'react-native-notifier';
import { View, YStack, Text } from 'tamagui';
import { useTheme } from 'tamagui';

const DeepLinkHandler = () => {
    const theme = useTheme();
    const params = useLocalSearchParams();

    useEffect(() => {


        // Parse URL parameters
        const urlParams = new URLSearchParams(params.url as string);
        const status = urlParams.get('status') || params.status as string;
        const txRef = urlParams.get('tx_ref') || params.txRef as string;
        const transactionId = urlParams.get('transaction_id') || params.transactionId as string;


        if (!status) {
            console.error('Deep Link Handler - Missing status parameter');
            Notifier.showNotification({
                title: 'Error',
                description: 'Missing payment status',
                Component: NotifierComponents.Alert,
                componentProps: { alertType: 'error' },
            });
            router.replace('/delivery');
            return;
        }

        // Convert status to lowercase for consistent comparison
        const normalizedStatus = status.toLowerCase();


        switch (normalizedStatus) {
            case 'successful':

                router.replace({
                    pathname: '/payment/payment-complete',
                    params: {
                        paymentStatus: 'success',
                        txRef,
                        transactionId
                    }
                });
                break;
            case 'failed':

                router.replace({
                    pathname: '/payment/payment-complete',
                    params: {
                        paymentStatus: 'failed',
                        txRef,
                        transactionId
                    }
                });
                break;
            case 'cancelled':

                router.replace({
                    pathname: '/payment/payment-complete',
                    params: {
                        paymentStatus: 'failed',
                        txRef,
                        transactionId
                    }
                });
                break;
            default:
                console.error('Deep Link Handler - Invalid payment status:', normalizedStatus);
                Notifier.showNotification({
                    title: 'Error',
                    description: 'Invalid payment status',
                    Component: NotifierComponents.Alert,
                    componentProps: { alertType: 'error' },
                });
                router.replace('/delivery');
                break;
        }
    }, [params]);

    return (
        <View flex={1} backgroundColor={theme.background.val} justifyContent="center" alignItems="center">
            <YStack space="$4" alignItems="center" padding="$4">
                <Text fontSize={16} textAlign="center">
                    Processing payment...
                </Text>
            </YStack>
        </View>
    );
};

export default DeepLinkHandler; 