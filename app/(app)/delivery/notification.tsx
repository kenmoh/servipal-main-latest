import { ScrollView, StyleSheet } from "react-native";
import React from "react";
import {
    Text,
    View,
    YStack,
    XStack,
    Avatar,
    Paragraph,
    Separator,
    Accordion,
    useTheme,
} from "tamagui";
import {
    ChevronDown,
    Megaphone,
    AlertTriangle,
    Circle,
} from "lucide-react-native";
import Animated from "react-native-reanimated";

const demoNotifications = [
    {
        id: "1",
        type: "broadcast",
        read: false,
        sender: {
            name: "Admin",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        date: "2024-06-01",
        title: "Welcome to ServiPal",
        content:
            "Your one-stop app for item delivery, food ordering, laundry services, and secure online peer-to-peer shopping.",
    },
    {
        id: "2",
        type: "report",
        read: true,
        thread: [
            {
                sender: {
                    name: "Jane Smith",
                    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                },
                role: "reporter",
                date: "2024-06-02",
                content: "I received the wrong item in my order. Please assist.",
                read: true,
            },
            {
                sender: {
                    name: "John Doe",
                    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
                },
                role: "reportee",
                date: "2024-06-02",
                content:
                    "Sorry for the mix-up! I will arrange a replacement immediately.Sorry for the mix-up! I will arrange a replacement immediately.",
                read: false,
            },
            {
                sender: {
                    name: "Admin",
                    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                },
                role: "admin",
                date: "2024-06-02",
                content:
                    "We are monitoring this report and will ensure it is resolved promptly.",
                read: false,
            },
        ],
        title: "Order Issue Report",
    },
    {
        id: "3",
        type: "broadcast",
        read: true,
        sender: {
            name: "Admin",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        date: "2024-06-03",
        title: "Quick & Reliable Delivery",
        content: "Send and receive packages with ease, anywhere, anytime.",
    },
];

const Badge = ({
    color,
    icon,
    children,
}: {
    color: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) => (
    <XStack
        backgroundColor={color}
        paddingHorizontal={8}
        paddingVertical={2}
        borderRadius={15}
        alignItems="center"
        gap={4}
    >
        {icon}
        <Text color="white" fontSize={12} fontWeight="600">
            {children}
        </Text>
    </XStack>
);

const NotificationAccordion = ({ notification }: { notification: any }) => {
    const theme = useTheme();
    if (notification.type === "broadcast") {
        return (
            <Accordion
                overflow="hidden"
                width="100%"
                borderRadius={16}
                borderWidth={0}
                alignSelf="center"
                type="multiple"
            >
                <Accordion.Item value={notification.id}>
                    <Accordion.Trigger borderWidth={0}>
                        {({ open }: { open: boolean }) => (
                            <XStack
                                alignItems="center"
                                gap="$3"
                                padding={14}
                                backgroundColor={
                                    notification.read ? theme.cardBackground.val : theme.blue2.val
                                }
                                borderRadius={16}
                                shadowColor="#000"
                                shadowOpacity={0.08}
                                shadowRadius={6}
                            >
                                {!notification.read && (
                                    <Circle
                                        size={10}
                                        color={theme.blue10.val}
                                        fill={theme.blue10.val}
                                        style={{ marginRight: 4 }}
                                    />
                                )}
                                <Avatar circular size="$4">
                                    <Avatar.Image source={{ uri: notification.sender.avatar }} />
                                    <Avatar.Fallback backgroundColor="$gray5" />
                                </Avatar>
                                <YStack flex={1}>
                                    <XStack alignItems="center" gap="$2">
                                        <Text
                                            fontWeight={notification.read ? "700" : "900"}
                                            color="$text"
                                        >
                                            {notification.sender.name}
                                        </Text>
                                        <Badge
                                            color={theme.blue10.val}
                                            icon={<Megaphone size={14} color="white" />}
                                        >
                                            Broadcast
                                        </Badge>
                                    </XStack>
                                    <Text
                                        fontSize={15}
                                        color="$gray11"
                                        fontWeight={notification.read ? "400" : "700"}
                                    >
                                        {notification.title}
                                    </Text>
                                    <Text fontSize={12} color="$gray10">
                                        {notification.date}
                                    </Text>
                                </YStack>
                                <Animated.View style={{ marginLeft: 8 }}>
                                    <ChevronDown
                                        size={22}
                                        color={open ? theme.blue10.val : theme.gray10.val}
                                        style={{
                                            transform: [{ rotate: open ? "180deg" : "0deg" }],
                                        }}
                                    />
                                </Animated.View>
                            </XStack>
                        )}
                    </Accordion.Trigger>
                    <Accordion.HeightAnimator>
                        <Accordion.Content exitStyle={{ opacity: 0 }}>
                            <YStack
                                padding={18}
                                backgroundColor={theme.cardDark.val}
                                borderBottomLeftRadius={16}
                                borderBottomRightRadius={16}
                            >
                                <Paragraph color="$gray11">{notification.content}</Paragraph>
                            </YStack>
                        </Accordion.Content>
                    </Accordion.HeightAnimator>
                </Accordion.Item>
            </Accordion>
        );
    }
    // Report thread
    return (
        <Accordion
            overflow="hidden"
            width="90%"
            borderRadius={16}
            borderWidth={0}
            marginVertical={0}
            alignSelf="center"
            type="multiple"
            backgroundColor={'$cardDark'}
        >
            <Accordion.Item value={notification.id}>
                <Accordion.Trigger borderWidth={0} width={'100%'} backgroundColor={'$cardDark'}>
                    {({ open }: { open: boolean }) => (
                        <XStack
                            alignItems="center"
                            gap="$3"
                            padding={14}
                            backgroundColor={
                                notification.read ? theme.cardBackground.val : theme.red2.val
                            }
                            borderRadius={16}
                            shadowColor="#000"
                            shadowOpacity={0.08}
                            shadowRadius={6}
                        >
                            {!notification.read && (
                                <Circle
                                    size={10}
                                    color={theme.red10.val}
                                    fill={theme.red10.val}
                                    style={{ marginRight: 4 }}
                                />
                            )}
                            <Avatar circular size="$4">
                                <Avatar.Image
                                    source={{ uri: notification.thread[0].sender.avatar }}
                                />
                                <Avatar.Fallback backgroundColor="$gray5" />
                            </Avatar>
                            <YStack flex={1}>
                                <XStack alignItems="center" gap="$2">
                                    <Text
                                        fontWeight={notification.read ? "700" : "900"}
                                        color="$text"
                                    >
                                        {notification.thread[0].sender.name}
                                    </Text>
                                    <Badge

                                        color={'rgba(255, 0, 0, 0.4)'}
                                        icon={<AlertTriangle size={14} color="white" />}
                                    >
                                        Report
                                    </Badge>
                                </XStack>
                                <Text
                                    fontSize={15}
                                    color="$gray11"
                                    fontWeight={notification.read ? "400" : "700"}
                                >
                                    {notification.title}
                                </Text>
                                <Text fontSize={12} color="$gray10">
                                    {notification.thread[0].date}
                                </Text>
                            </YStack>
                            <Animated.View style={{ marginLeft: 8 }}>
                                <ChevronDown
                                    size={22}
                                    color={open ? theme.red10.val : theme.gray10.val}
                                    style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
                                />
                            </Animated.View>
                        </XStack>
                    )}
                </Accordion.Trigger>
                <Accordion.HeightAnimator>
                    <Accordion.Content
                        exitStyle={{ opacity: 0 }}
                        padding={0}
                        backgroundColor="$cardBackground"
                        marginTop='$-2'

                    >
                        <YStack
                            gap="$3"
                            paddingHorizontal={'$5'}
                            marginLeft={15}
                            paddingBottom={14}
                            backgroundColor={
                                notification.read ? theme.cardBackground.val : theme.red2.val
                            }
                            borderBottomLeftRadius={16}
                            borderBottomRightRadius={16}
                        >
                            <Separator marginBottom={2} marginTop={-8} opacity={0.15} />
                            {notification.thread.map((msg: any, idx: number) => (
                                <XStack
                                    key={idx}
                                    alignItems="flex-start"
                                    gap="$3"
                                    position="relative"
                                >
                                    {/* Thread line for all but last message */}

                                    <YStack alignItems="center" minWidth={40}>
                                        <Avatar circular size="$3">
                                            <Avatar.Image source={{ uri: msg.sender.avatar }} />
                                            <Avatar.Fallback backgroundColor="$gray5" />
                                        </Avatar>
                                    </YStack>
                                    <YStack flex={1}>
                                        <XStack alignItems="center" gap="$2">
                                            {!msg.read && (
                                                <Circle
                                                    size={8}
                                                    color={theme.red10.val}
                                                    fill={theme.red10.val}
                                                    style={{ marginRight: 2 }}
                                                />
                                            )}
                                            <Text fontWeight={msg.read ? "700" : "900"} color="$text">
                                                {msg.sender.name}
                                            </Text>
                                            <Text
                                                fontSize={12}
                                                color={
                                                    msg.role === "admin"
                                                        ? theme.blue10.val
                                                        : msg.role === "reporter"
                                                            ? theme.red10.val
                                                            : theme.green10.val
                                                }
                                            >
                                                {msg.role.charAt(0).toUpperCase() + msg.role.slice(1)}
                                            </Text>
                                        </XStack>
                                        <YStack
                                            backgroundColor={theme.cardBackground.val}
                                            borderRadius={10}
                                            padding={12}
                                            marginTop={4}
                                        >
                                            <Paragraph color="$gray11">{msg.content}</Paragraph>
                                        </YStack>
                                        <Text fontSize={11} color="$gray10" marginTop={2}>
                                            {msg.date}
                                        </Text>
                                    </YStack>
                                </XStack>
                            ))}
                        </YStack>
                    </Accordion.Content>
                </Accordion.HeightAnimator>
            </Accordion.Item>
        </Accordion>
    );
};

const NotificationScreen = () => {
    return (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <YStack paddingVertical={18} gap="$2">
                {demoNotifications.map((notification) => (
                    <NotificationAccordion
                        key={notification.id}
                        notification={notification}
                    />
                ))}
            </YStack>
        </ScrollView>
    );
};

export default NotificationScreen;
