import {
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
    Card,
    Text,
    XStack,
    Circle,
    Avatar,
    YStack,
    Paragraph,
    useTheme,
    Button,
    View,
} from "tamagui";
import { AntDesign, Feather, FontAwesome6 } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import {
    Phone,
    Wallet2Icon,
    MapPin,
    Wallet,
    Info,
    User,
    DollarSign,
} from "lucide-react-native";
import LoadingIndicator from "@/components/LoadingIndicator";
import { Status } from "@/components/ItemCard";
import { fetchDelivery } from "@/api/order";
import DeliveryWrapper from "@/components/DeliveryWrapper";
import { useAuth } from "@/context/authContext";
import AppModal from "@/components/AppModal";

const MAP_HEIGHT = Dimensions.get("window").height * 0.35;

const ItemDetails = () => {
    const { id } = useLocalSearchParams();
    const theme = useTheme();
    const { user } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["order", id],
        queryFn: () => fetchDelivery(id as string),
        enabled: !!id,
        // staleTime: 1000 * 60 * 3,
    });

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <>
            <DeliveryWrapper>
                <AppModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                    <Text>This is the modal content!</Text>
                    <TouchableOpacity
                        style={{
                            backgroundColor: theme.btnPrimaryColor.val,
                            height: 50,
                            width: "90%",
                            alignSelf: "center",
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text>Contact Rider</Text>
                    </TouchableOpacity>
                </AppModal>


                {user?.sub === data?.delivery.sender_id && (

                    <TouchableOpacity
                        style={{
                            backgroundColor: theme.cardDark.val,
                            borderColor: theme.borderColor.val,
                            borderWidth: 1,
                            height: 40,
                            width: "95%",
                            alignSelf: "center",
                            borderRadius: 8,
                            justifyContent: "center",
                            alignItems: "center",
                            marginVertical: 10,
                        }}
                        onPress={() =>
                            router.push({
                                pathname: "/user-details/[userId]",
                                params: { userId: 1 },
                            })
                        }
                    >
                        <XStack gap={10}>
                            <User color={"white"} size={20} />
                            <Text>CONTACT RIDER</Text>
                        </XStack>
                    </TouchableOpacity>
                )}
                {user?.sub === data?.delivery.sender_id &&
                    data?.order.order_payment_status !== "paid" && (
                        <Button
                            alignSelf="center"
                            marginVertical={"$2"}
                            variant="outlined"
                            width={"90%"}
                            icon={DollarSign}
                            color={"white"}
                            onPress={() =>
                                router.push({
                                    pathname: "/payment/[orderId]",
                                    params: {
                                        orderId: data?.order.id ?? "",
                                        deliveryFee: data?.delivery.delivery_fee,
                                        orderNumber: data?.order.order_number,
                                        deliveryType: data?.delivery.delivery_type,
                                        orderItems: JSON.stringify(data?.order.order_items ?? []),
                                        paymentLink: data?.order.payment_link,
                                    },
                                })
                            }
                        >
                            MAKE PAYMENT
                        </Button>
                    )}

                <Card
                    marginVertical={5}
                    width={"95%"}
                    paddingHorizontal={5}
                    alignSelf="center"
                    backgroundColor={"$profileCard"}
                    bordered
                    borderColor={"$inputBackground"}
                >
                    <Card.Header gap={5}>
                        <XStack
                            gap={5}
                            alignItems="baseline"
                            justifyContent="space-between"
                        >
                            <Text color={"$text"} fontSize={12} marginBottom={5}>
                                ORDER DETAILS
                            </Text>
                            <Status status={data?.delivery.delivery_status} />
                        </XStack>
                        <XStack gap={5}>
                            <Info color={theme.icon.val} size={15} />

                            <XStack justifyContent="space-between" width={"96%"}>
                                <Paragraph
                                    color={"$text"}
                                    fontFamily={"$body"}
                                    fontWeight={"300"}
                                    fontSize={11}
                                >
                                    Order ID
                                </Paragraph>
                                <Paragraph
                                    color={"$text"}
                                    fontFamily={"$body"}
                                    fontWeight={"500"}
                                    fontSize={12}
                                >
                                    #{data?.order.order_number}
                                </Paragraph>
                            </XStack>
                        </XStack>
                        <XStack gap={5}>
                            <Wallet color={theme.icon.val} size={15} />
                            <XStack justifyContent="space-between" width={"96%"}>
                                <Paragraph
                                    color={"$text"}
                                    fontFamily={"$body"}
                                    fontWeight={"300"}
                                    fontSize={11}
                                >
                                    Delivery fee(After commission)
                                </Paragraph>
                                <Paragraph
                                    color={"$text"}
                                    fontFamily={"$body"}
                                    fontWeight={"500"}
                                    fontSize={12}
                                >
                                    ₦ {Number(data?.delivery.amount_due_dispatch).toFixed(2)}
                                </Paragraph>
                            </XStack>
                        </XStack>
                        <XStack gap={5}>
                            <Phone color={theme.icon.val} size={15} />
                            <XStack justifyContent="space-between" width={"96%"}>
                                <Paragraph
                                    color={"$text"}
                                    fontFamily={"$body"}
                                    fontWeight={"300"}
                                    fontSize={11}
                                >
                                    Sender Phone
                                </Paragraph>
                                {/* <Paragraph color={'$text'} fontFamily={'$body'} fontWeight={'500'} fontSize={12}>{data?.order_owner_phone_number}</Paragraph> */}
                            </XStack>
                        </XStack>
                        {/* <XStack gap={5}>
                        <Phone color={theme.icon.val} size={15} />
                        <XStack justifyContent='space-between' width={'96%'}>
                            <Paragraph color={'$text'} fontFamily={'$body'} fontWeight={'300'} fontSize={11}>Recepient Phone</Paragraph>
                            <Paragraph color={'$text'} fontFamily={'$body'} fontWeight={'500'} fontSize={12}>{data?.order_owner_phone_number}</Paragraph>
                        </XStack>
                    </XStack> */}

                        <XStack gap={5}>
                            <MapPin color={theme.icon.val} size={15} />
                            <YStack>
                                <Paragraph
                                    color={"$text"}
                                    fontFamily={"$body"}
                                    fontWeight={"300"}
                                    fontSize={11}
                                >
                                    Delivery Address
                                </Paragraph>
                                <Paragraph
                                    color={"$text"}
                                    fontFamily={"$body"}
                                    fontWeight={"500"}
                                    fontSize={11}
                                >
                                    {data?.delivery.destination}
                                </Paragraph>
                            </YStack>
                        </XStack>
                    </Card.Header>
                    <View alignContent="center">
                        <Button
                            bottom={10}
                            size={"$4"}
                            backgroundColor={"$btnPrimaryColor"}
                            width={"90%"}
                            textAlign="center"
                            alignSelf="center"
                            fontSize={20}
                            fontFamily={"$body"}
                            color={"$text"}
                            fontWeight={"600"}
                            pressStyle={{ backgroundColor: "$transparentBtnPrimaryColor" }}
                        >
                            Accept
                        </Button>
                    </View>
                </Card>
            </DeliveryWrapper>
        </>
    );
};

export default ItemDetails;

const styles = StyleSheet.create({});
