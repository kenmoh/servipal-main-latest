import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
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

const NotificationDetails = () => {
    const { notificationId, reportTag, thread, complainantId, reportStatus } = useLocalSearchParams();
    const [messages, setMessages] = useState(DUMMY_THREAD);
    const [input, setInput] = useState('');
    const [inputHeight, setInputHeight] = useState(MIN_INPUT_HEIGHT);
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

    const handleInputFocus = () => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const renderItem = ({ item, index }: any) => {
        const isLastItem = index === messages.length - 1;
        // Calculate dynamic bottom margin based on current input height
        const dynamicMargin = isLastItem ? inputHeight + INPUT_PADDING + 24 : 24;
        
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
                            borderColor: roleColor[item?.sender?.role] || '#ccc', 
                            backgroundColor: '#23272f' 
                        }}
                    />
                </YStack>

                <YStack flex={1} marginLeft={0} padding={0}>
                    <XStack alignItems="center" gap={8}>
                        <Text style={{ 
                            fontWeight: 'bold', 
                            color: roleColor[item.sender.role] || '#fff', 
                            fontSize: 16 
                        }}>
                            {item?.sender?.role === 'admin' ? "ServiPal" : item?.sender?.name}
                        </Text>
                        <Text style={{ 
                            fontSize: 10, 
                            color: roleColor[item?.sender?.role] || '#aaa', 
                            fontWeight: '400', 
                            letterSpacing: 1, 
                            backgroundColor: '#23272f', 
                            borderRadius: 6, 
                            paddingHorizontal: 6, 
                            paddingVertical: 2, 
                            marginLeft: 2 
                        }}>
                            {item?.sender?.role.toUpperCase()}
                        </Text>
                    </XStack>
                    <Text style={{ 
                        fontSize: 11, 
                        color: '#aaa', 
                        marginTop: 2, 
                        marginBottom: 2, 
                        alignSelf: 'flex-start' 
                    }}>
                        {new Date(item.created_at).toLocaleString()}
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
            keyboardVerticalOffset={100}
            style={styles.content}
        >
            <View style={{ flex: 1, backgroundColor: theme.background.val }}>
                <FlatList
                    ref={flatListRef}
                    data={thread || []}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ 
                        padding: 20,
                        flexGrow: 1
                    }}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => {
                        // Auto-scroll to bottom when content changes
                        setTimeout(() => {
                            flatListRef.current?.scrollToEnd({ animated: true });
                        }, 100);
                    }}
                />

                {/* Input area fixed at the bottom */}
               { reportStatus !== 'resolved' && <View
                                   style={{
                                       position: "absolute",
                                       left: 10,
                                       right: 10,
                                       bottom: 10,
                                       backgroundColor: theme.cardDark.val,
                                       flexDirection: "row",
                                       alignItems: "flex-end",
                                       padding: 10,
                                       borderRadius: 25,
                                       borderColor: "#23272f",
                                       minHeight: MIN_INPUT_HEIGHT + INPUT_PADDING,
                                       paddingHorizontal: 15,
                                   }}
                               >
                                   <TextInput
                                       value={input}
                                       onChangeText={setInput}
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
                                   <TouchableOpacity
                                       onPress={handleSend}
                                       hitSlop={25}
                                       disabled={!input.trim()}
                                       style={{ 
                                           marginLeft: 8, 
                                           marginBottom: 8,
                                           padding: 8,
                                           borderRadius: 20,
                                           backgroundColor: !input.trim() ? 'transparent' : theme.transparentBtnPrimaryColor.val + '20'
                                       }}
                                   >
                                       <SendHorizonal
                                           color={!input.trim() ? theme.icon.val : theme.transparentBtnPrimaryColor.val}
                                           size={20}
                                       />
                                   </TouchableOpacity>
                               </View>}
            </View>
        </KeyboardAvoidingView>
    );
};

export default NotificationDetails;

const styles = StyleSheet.create({
    content: {
        flex: 1,
        maxHeight: 600,
    },
});