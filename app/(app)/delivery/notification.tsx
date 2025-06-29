import React from 'react';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { YStack, Text, Card, Spinner, View, Button, XStack } from 'tamagui';
import {
    fetchAllNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    fetchNotificationBadgeCount,
    fetchNotificationStatistics,
    fetchCurrentUserReports
} from '@/api/report';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useAuth } from "@/context/authContext";

const DUMMY_NOTIFICATIONS = [
    {
        id: '1',
        title: 'Welcome to Servipal!',
        content: 'Your account has been created successfully.',
        is_read: false,
        created_at: new Date().toISOString(),
    },
    {
        id: '2',
        title: 'Order Delivered',
        content: 'Your recent order has been delivered. Please rate your experience.',
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
        id: '3',
        title: 'Promo: 20% Off Laundry',
        content: 'Get 20% off your next laundry order. Use code CLEAN20.',
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
        id: '4',
        title: 'Wallet Funded',
        content: '₦5,000 has been added to your wallet.',
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
];

const NotificationScreen = () => {
    const queryClient = useQueryClient();
    const {user} = useAuth()

    // Fetch notifications
    const {
        data: notifications = [],
        isLoading,
        isRefetching,
        refetch,
    } = useQuery({
        queryKey: ['notifications', user?.sub],
        queryFn: () => fetchCurrentUserReports(user?.sub),
    });

    // Fetch badge count
    const { data: badgeData } = useQuery({
        queryKey: ['notification-badge'],
        queryFn: fetchNotificationBadgeCount,
    });

    // Fetch stats
    const { data: stats } = useQuery({
        queryKey: ['notification-stats'],
        queryFn: fetchNotificationStatistics,
    });

    // Mark as read mutation
    const markReadMutation = useMutation({
        mutationFn: markNotificationRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notification-badge'] });
        },
    });

    // Mark all as read mutation
    const markAllReadMutation = useMutation({
        mutationFn: markAllNotificationsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notification-badge'] });
        },
    });

    // Delete notification mutation (admin only, not shown in UI)
    const deleteMutation = useMutation({
        mutationFn: deleteNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const handleMarkRead = (id: string) => {
        markReadMutation.mutate(id);
    };

    const handleMarkAllRead = () => {
        markAllReadMutation.mutate();
    };

    // const handleDelete = (id: string) => {
    //   deleteMutation.mutate(id);
    // };

    if (isLoading) {
        return (
            <View flex={1} justifyContent="center" alignItems="center">
                <Spinner size="large" />
            </View>
        );
    }

    // Use dummy data if no real notifications
    const notificationData = notifications.length > 0 ? notifications : DUMMY_NOTIFICATIONS;

    return (
        <YStack flex={1} backgroundColor="$background" padding="$3">
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                <Text fontWeight="bold" fontSize={18}>Notifications</Text>
                <Button size="$2" onPress={handleMarkAllRead} disabled={markAllReadMutation.isPending}>
                    {markAllReadMutation.isPending ? 'Marking...' : 'Mark all as read'}
                </Button>
            </XStack>
            <XStack gap="$3" marginBottom="$2">
                <Text color="$icon">Unread: {badgeData?.unread_notifications ?? 0}</Text>
                {stats && (
                    <Text color="$icon">Total: {stats.total_notifications}</Text>
                )}
            </XStack>
            <FlatList
                data={notifications || []}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => router.push({ pathname: '/notification-detail/[notificationId]',
                     params: { 
                     	notificationId: item?.id,
                     	reportTag: item?.report_tag,
                     	thread: JSON.stringify(item?.thread),
                     	complainantId: item?.complainant_id,
                     	reportStatus: item?.report_status,
                    } })}>

                        <Card marginBottom="$3" padding="$3" backgroundColor={item.is_read ? '$cardDark' : '$yellow2'}>
                            <XStack justifyContent="space-between" alignItems="center">
                                <Text fontWeight="bold" fontSize={16}>{item.title || 'Report'}</Text>
                                {!item.is_read && (
                                    <Button size="$1" onPress={() => handleMarkRead(item.id)} disabled={markReadMutation.isPending}>
                                        {markReadMutation.isPending ? 'Marking...' : 'Mark as read'}
                                    </Button>
                                )}
                            </XStack>
                            <Text color="$icon" marginTop="$2">{item.description}</Text>
                            <Text color="$gray8" fontSize={12} marginTop="$1">
                                {new Date(item.created_at).toLocaleString()}
                            </Text>
                            {/* Uncomment below for admin delete */}
                            {/* <Button size="$1" onPress={() => handleDelete(item.id)} marginTop="$2" backgroundColor="$red10">Delete</Button> */}
                        </Card>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text textAlign="center" color="$icon" marginTop="$10">
                        No notifications yet.
                    </Text>
                }
            />
        </YStack>
    );
};

export default NotificationScreen;
