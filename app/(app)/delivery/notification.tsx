import React from 'react';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { YStack, Text, Card, Spinner, View, Button, XStack } from 'tamagui';
import {
    markReportRead,
    markAllNotificationsRead,
    deleteNotification,
    fetchNotificationBadgeCount,
    fetchNotificationStatistics,
    fetchCurrentUserReports
} from '@/api/report';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useAuth } from "@/context/authContext";
import LoadingIndicator from '@/components/LoadingIndicator';

const NotificationScreen = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth()

    // Fetch notifications
    const {
        data: notifications = [],
        isLoading,
        isRefetching,
        refetch,
    } = useQuery({
        queryKey: ['notifications', user?.sub],
        queryFn: () => fetchCurrentUserReports(user?.sub as string),
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
        mutationFn: markReportRead,
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



    if (isLoading) {
        return <LoadingIndicator />;
    }

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
                    <TouchableOpacity onPress={() => {
                        router.push({
                            pathname: '/notification-detail/[notificationId]',
                            params: {
                                notificationId: item?.id,
                            }
                        });
                        handleMarkRead(item.id);
                    }}>

                        <Card marginBottom="$3" padding="$3" backgroundColor={item.is_read ? '$cardDark' : 'rgba(255, 255, 255, 0.17)'}>
                            <XStack justifyContent="space-between" alignItems="center">
                                <Text fontWeight="bold" fontSize={16} color={item.is_read ? '$text' : 'white'}>{item.report_type || 'Report'}</Text>
                                {!item.report_status && (
                                    <Button size="$1" onPress={() => handleMarkRead(item.id)} disabled={markReadMutation.isPending}>
                                        {markReadMutation.isPending ? 'Marking...' : 'Mark as read'}
                                    </Button>
                                )}
                            </XStack>
                            <Text color={item.is_read ? '$icon' : 'white'} marginTop="$2">{item.description}</Text>
                            <Text color={item.is_read ? '$gray8' : 'rgba(255,255,255,0.7)'} fontSize={12} marginTop="$1">
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
