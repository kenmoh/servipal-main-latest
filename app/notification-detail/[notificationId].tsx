import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import React, { useRef, useState } from 'react';
import { XStack, YStack, Card, Button, Image, useTheme } from 'tamagui';
import { Send, SendHorizonal } from 'lucide-react-native';
import ChatInput from '@/components/ChatInput';
import { ReposrtResponse, ThreadMessage } from '@/types/review-types';
import { useAuth } from '@/context/authContext';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Notifier, NotifierComponents } from 'react-native-notifier';
import { addMessage, createReport, fetchReport } from '@/api/report';
import AppTextInput from '@/components/AppInput';

const DUMMY_THREAD = [
    {
        id: '1',
        sender: {
            name: 'Jane Doe',
            role: 'reporter',
            avatar: 'https://ui-avatars.com/api/?name=Jane+Doe',
        },
        content: 'There was an issue with my delivery.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
        id: '2',
        sender: {
            name: 'Admin',
            role: 'admin',
            avatar: 'https://ui-avatars.com/api/?name=Admin',
        },
        content: 'Thank you for reporting. Can you provide more details?',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
    },
    {
        id: '3',
        sender: {
            name: 'John Smith',
            role: 'reportee',
            avatar: 'https://ui-avatars.com/api/?name=John+Smith',
        },
        content: 'I delivered as instructed. Please clarify the issue. I want to understand what went wrong so I can improve my service. I followed all the delivery instructions provided and delivered the package on time to the specified location.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    },
    {
        id: '4',
        sender: {
            name: 'Jane Doe',
            role: 'reporter',
            avatar: 'https://ui-avatars.com/api/?name=Jane+Doe',
        },
        content: 'The package was wet when I received it. It seems like it was left in the rain or got exposed to water during transport. The contents inside were also damaged due to the moisture. This is very disappointing as the items were expensive and now they are ruined.',
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
];

const roleColor: any = {
    reporter: '#4F8EF7',
    admin: '#F7B731',
    reportee: '#20BF6B',
};

const MIN_INPUT_HEIGHT = 40;
const MAX_INPUT_HEIGHT = 120;
const INPUT_PADDING = 20; // Total padding around input area

const messageSchema = z.object({
    content: z.string().min(1, "Message cannot be empty").max(500, "Message too long"),
});

type MessageFormData = z.infer<typeof messageSchema>;

const NotificationDetails = () => {
    const { notificationId, reportTag, thread, complainantId, reportStatus } = useLocalSearchParams();
    const [input, setInput] = useState('');
    const [inputHeight, setInputHeight] = useState(MIN_INPUT_HEIGHT);
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const theme = useTheme()
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const threadData = JSON.parse(thread as string) as ThreadMessage[]

    // Fetch thread data for real-time updates
    const { data: messages, refetch: refetchThread, isFetching } = useQuery({
        queryKey: ['thread', notificationId],
        queryFn: () => fetchReport(notificationId as string),
        initialData: threadData,
        refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
        enabled: !!notificationId,
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<MessageFormData>({
        resolver: zodResolver(messageSchema),
        mode: "onBlur",
        defaultValues: {
            content: "",
        },
    });

    const sendMessageMutation = useMutation({
        mutationFn: (data: MessageFormData) =>
            addMessage(notificationId as string, {
                content: data.content,
            }),
        onSuccess: (data) => {
            // Refetch thread data immediately
            refetchThread();

            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['reports'] });

            Notifier.showNotification({
                title: "Success",
                description: "Message sent successfully",
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "success" },
            });
        },
        onError: (error: any) => {
            reset()
            Notifier.showNotification({
                title: "Error",
                description: error?.message || "Failed to send message",
                Component: NotifierComponents.Alert,
                componentProps: { alertType: "error" },
            });
        },
    });

    const onSubmit = (data: MessageFormData) => {
        reset()
        setIsTyping(false);
        sendMessageMutation.mutate(data);
    };

    const handleInputFocus = () => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleInputChange = (text: string) => {
        setIsTyping(text.length > 0);
    };

    const renderItem = ({ item, index }: any) => {
        const isLastItem = index === (messages?.length ?? 0) - 1;
        // Calculate dynamic bottom margin based on current input height
        const dynamicMargin = isLastItem ? inputHeight + INPUT_PADDING + 80 : 24;

        return (
            <XStack
                alignItems="flex-start"
                marginBottom={dynamicMargin}
            >
                <YStack alignItems="center" width={44}>
                    <Image
                        source={{ uri: item?.sender?.avatar }}
                        style={{
                            width: 32,
                            objectFit: 'cover',
                            height: 32,
                            borderRadius: 16,
                            borderWidth: 2,
                            borderColor: roleColor[item?.role] || '#ccc',
                            backgroundColor: '#23272f'
                        }}
                    />
                </YStack>

                <YStack flex={1} marginLeft={0} padding={0}>
                    <XStack alignItems="center" gap={8}>
                        <Text style={{
                            fontWeight: 'bold',
                            color: roleColor[item?.role] || '#fff',
                            fontSize: 16
                        }}>
                            {item?.role === 'admin' ? "ServiPal" : item?.sender?.name}
                        </Text>
                        <Text style={{
                            fontSize: 10,
                            color: roleColor[item?.role] || '#aaa',
                            fontWeight: '400',
                            letterSpacing: 1,
                            backgroundColor: '#23272f',
                            borderRadius: 6,
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            marginLeft: 2
                        }}>
                            {item?.role?.toUpperCase()}
                        </Text>
                    </XStack>
                    <Text style={{
                        fontSize: 11,
                        color: '#aaa',
                        marginTop: 2,
                        marginBottom: 2,
                        alignSelf: 'flex-start'
                    }}>
                        {new Date(item.date).toLocaleString()}
                    </Text>
                    <Card
                        elevate
                        size="$4"
                        backgroundColor="#23272f"
                        padding={12}
                        marginTop={2}
                        borderRadius={12}
                    >
                        <Text style={{
                            color: '#eaeaea',
                            fontSize: 15,
                            lineHeight: 22
                        }}>
                            {item.content}
                        </Text>
                    </Card>
                </YStack>
            </XStack>
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={"padding"}
            keyboardVerticalOffset={50}
            style={styles.content}
        >
            <View style={{ flex: 1, backgroundColor: theme.background.val, width: '95%', alignSelf: 'center' }}>
                <FlatList
                    ref={flatListRef}
                    data={messages || []}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{
                        padding: 20,
                        flexGrow: 1
                    }}
                    showsVerticalScrollIndicator={false}
                    refreshing={isFetching}
                    onRefresh={refetchThread}
                    onContentSizeChange={() => {
                        // Auto-scroll to bottom when content changes
                        setTimeout(() => {
                            flatListRef.current?.scrollToEnd({ animated: true });
                        }, 100);
                    }}
                />

                {/* Typing Indicator */}
                {isTyping && (
                    <View
                        style={{
                            position: "absolute",
                            left: 10,
                            right: 10,
                            bottom: 120, // Position above the input area
                            zIndex: 1,
                        }}
                    >
                        <XStack
                            alignItems="flex-start"
                            marginBottom={24}
                            paddingHorizontal={20}
                        >
                            <YStack alignItems="center" width={44}>
                                <Image
                                    source={{ uri: 'https://ui-avatars.com/api/?name=You' }}
                                    style={{
                                        width: 32,
                                        objectFit: 'cover',
                                        height: 32,
                                        borderRadius: 16,
                                        borderWidth: 2,
                                        borderColor: roleColor['reporter'] || '#ccc',
                                        backgroundColor: '#23272f'
                                    }}
                                />
                            </YStack>
                            <YStack flex={1} marginLeft={0} padding={0}>
                                <XStack alignItems="center" gap={8}>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        color: roleColor['reporter'] || '#fff',
                                        fontSize: 16
                                    }}>
                                        You
                                    </Text>
                                    <Text style={{
                                        fontSize: 10,
                                        color: roleColor['reporter'] || '#aaa',
                                        fontWeight: '400',
                                        letterSpacing: 1,
                                        backgroundColor: '#23272f',
                                        borderRadius: 6,
                                        paddingHorizontal: 6,
                                        paddingVertical: 2,
                                        marginLeft: 2
                                    }}>
                                        REPORTER
                                    </Text>
                                </XStack>
                                <Card
                                    elevate
                                    size="$4"
                                    backgroundColor="#23272f"
                                    padding={12}
                                    marginTop={2}
                                    borderRadius={12}
                                >
                                    <XStack gap={4} alignItems="center">
                                        <Text style={{ color: '#eaeaea', fontSize: 15 }}>typing</Text>
                                        <XStack gap={2}>
                                            <View style={{
                                                width: 4,
                                                height: 4,
                                                borderRadius: 2,
                                                backgroundColor: '#eaeaea',
                                                opacity: 0.6
                                            }} />
                                            <View style={{
                                                width: 4,
                                                height: 4,
                                                borderRadius: 2,
                                                backgroundColor: '#eaeaea',
                                                opacity: 0.8
                                            }} />
                                            <View style={{
                                                width: 4,
                                                height: 4,
                                                borderRadius: 2,
                                                backgroundColor: '#eaeaea',
                                                opacity: 1
                                            }} />
                                        </XStack>
                                    </XStack>
                                </Card>
                            </YStack>
                        </XStack>
                    </View>
                )}

                {/* Input area fixed at the bottom */}
                {reportStatus !== 'resolved' && (
                    <View
                        style={{
                            position: "absolute",
                            left: 10,
                            right: 10,
                            bottom: 50,
                            backgroundColor: theme.backgroundFocus.val,
                            flexDirection: "row",
                            alignItems: "flex-end",
                            padding: 10,
                            borderRadius: 20,
                            borderColor: "#23272f",
                            minHeight: MIN_INPUT_HEIGHT + INPUT_PADDING,
                            paddingHorizontal: 15,
                        }}
                    >
                        <Controller
                            control={control}
                            name="content"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    value={value}
                                    onChangeText={(text) => {
                                        onChange(text);
                                        handleInputChange(text);
                                    }}
                                    onBlur={onBlur}
                                    placeholder="Type a message..."
                                    placeholderTextColor="#888"
                                    multiline
                                    style={{
                                        flex: 1,
                                        minHeight: MIN_INPUT_HEIGHT,
                                        maxHeight: MAX_INPUT_HEIGHT,
                                        height: inputHeight,
                                        color: "white",
                                        fontSize: 14,
                                        textAlignVertical: "top",
                                        paddingTop: 10,
                                        paddingBottom: 10,
                                    }}
                                    onFocus={handleInputFocus}
                                    onContentSizeChange={(e) => {
                                        const newHeight = Math.min(
                                            MAX_INPUT_HEIGHT,
                                            Math.max(MIN_INPUT_HEIGHT, e.nativeEvent.contentSize.height)
                                        );
                                        setInputHeight(newHeight);
                                    }}
                                />
                            )}
                        />
                        <TouchableOpacity
                            onPress={handleSubmit(onSubmit)}
                            hitSlop={25}
                            disabled={sendMessageMutation.isPending}
                            style={{
                                padding: 8,
                                borderRadius: 20,
                                backgroundColor: sendMessageMutation.isPending
                                    ? 'transparent'
                                    : theme.transparentBtnPrimaryColor.val + '20'
                            }}
                        >
                            <SendHorizonal
                                color={sendMessageMutation.isPending
                                    ? theme.icon.val
                                    : theme.transparentBtnPrimaryColor.val}
                                size={20}
                            />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

export default NotificationDetails;

const styles = StyleSheet.create({
    content: {
        flex: 1,
        // maxHeight: 600,
    },
});