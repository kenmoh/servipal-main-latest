import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import React, { useRef, useState } from 'react';
import { XStack, YStack, Card, Button, Image, useTheme } from 'tamagui';
import { Send, SendHorizonal } from 'lucide-react-native';
import ChatInput from '@/components/ChatInput';

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
        content: 'I delivered as instructed. Please clarify the issue.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    },
    {
        id: '4',
        sender: {
            name: 'Jane Doe',
            role: 'reporter',
            avatar: 'https://ui-avatars.com/api/?name=Jane+Doe',
        },
        content: 'The package was wet when I received it.',
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
];

const roleColor: any = {
    reporter: '#4F8EF7',
    admin: '#F7B731',
    reportee: '#20BF6B',
};

const NotificationDetails = () => {
    const { notificationId } = useLocalSearchParams();
    const [messages, setMessages] = useState(DUMMY_THREAD);
    const [input, setInput] = useState('');
    const [inputHeight, setInputHeight] = useState(40);
    const flatListRef = useRef<FlatList>(null);
    const theme = useTheme()

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([
            ...messages,
            {
                id: (messages.length + 1).toString(),
                sender: {
                    name: 'You',
                    role: 'reporter',
                    avatar: 'https://ui-avatars.com/api/?name=You',
                },
                content: input,
                created_at: new Date().toISOString(),
            },
        ]);
        setInput('');
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const renderItem = ({ item, index }: any) => (
        <XStack alignItems="flex-start" marginBottom={index === messages.length - 1 ? 0 : 24}>
            <YStack alignItems="center" width={44}>
                <Image
                    source={{ uri: item.sender.avatar }}
                    style={{ width: 32, objectFit: 'cover', height: 32, borderRadius: 16, borderWidth: 2, borderColor: roleColor[item.sender.role] || '#ccc', backgroundColor: '#23272f' }}

                />

            </YStack>

            <YStack flex={1} marginLeft={0} padding={0}>
                <XStack alignItems="center" gap={8}>
                    <Text style={{ fontWeight: 'bold', color: roleColor[item.sender.role] || '#fff', fontSize: 16 }}>{item.sender.name}</Text>
                    <Text style={{ fontSize: 10, color: roleColor[item.sender.role] || '#aaa', fontWeight: '400', letterSpacing: 1, backgroundColor: '#23272f', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 2 }}>{item.sender.role.toUpperCase()}</Text>
                </XStack>
                <Text style={{ fontSize: 11, color: '#aaa', marginTop: 2, marginBottom: 2, alignSelf: 'flex-start' }}>{new Date(item.created_at).toLocaleString()}</Text>
                <Card elevate size="$4" backgroundColor="#23272f" padding={12} marginTop={2} borderRadius={12}>
                    <Text style={{ color: '#eaeaea', fontSize: 15, lineHeight: 22 }}>{item.content}</Text>
                </Card>
            </YStack>
        </XStack>
    );

    return (

        <>
            <View style={{ flex: 1, backgroundColor: theme.background.val, }}>
                <YStack padding={0}>
                    <FlatList
                        ref={flatListRef}
                        scrollEnabled={false}
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
                        showsVerticalScrollIndicator={false}
                    />
                </YStack>

                <XStack alignItems="flex-end" gap={10}>
                    <TextInput
                        value={input}
                        onChangeText={setInput}
                        placeholder="Type a message..."
                        placeholderTextColor="#888"
                        multiline
                        style={{
                            flex: 1,
                            minHeight: 44,
                            maxHeight: 120,
                            color: 'white',
                            paddingHorizontal: 18,
                            paddingBottom: 12,
                            fontSize: 14,
                            borderBottomWidth: 1,
                            borderColor: '#23272f',

                        }}
                        onContentSizeChange={e => setInputHeight(Math.min(120, Math.max(44, e.nativeEvent.contentSize.height)))}
                    />
                    <ChatInput onChange={setInput} value={input} placeholder="Type a message..." />

                </XStack>
                <TouchableOpacity
                    onPress={handleSend}
                    hitSlop={25}
                    disabled={!input.trim()}
                >

                    <SendHorizonal color={!input.trim() ? theme.icon.val : theme.transparentBtnPrimaryColor.val} size={'20'} style={{ position: 'absolute', right: 16, bottom: 12 }} />
                </TouchableOpacity>

            </View>
        </>

    );
};

export default NotificationDetails;

