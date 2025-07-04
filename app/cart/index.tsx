import { createOrder } from "@/api/order";
import AppTextInput from "@/components/AppInput";
import AppModal from "@/components/AppModal";
import Item from "@/components/CartItem";
import GoogleTextInput from "@/components/GoogleTextInput";
import { useAuth } from "@/context/authContext";
import { useCartStore } from "@/store/cartStore";
import { useLocationStore } from "@/store/locationStore";
import { OrderFoodOLaundry } from "@/types/order-types";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { ShoppingCart, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { Notifier, NotifierComponents } from "react-native-notifier";
import {
    Text,
    useTheme,
    Switch,
    Paragraph,
    XStack,
    Button,
    Card,
    Label,
    View,
} from "tamagui";

const Cart = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [duration, setDuration] = useState("");
    const [distance, setDistance] = useState(0);
    const [error, setError] = useState({ origin: "", destination: "" });
    const [infoText, setInfoText] = useState("");
    const theme = useTheme();
    const { user } = useAuth();
    const {
        setDeliveryOption,
        cart,
        updateDuration,
        updateDistance,
        setAdditionalInfo,
        // prepareOrderForServer,
        totalCost,
    } = useCartStore();
    const {
        require_delivery,
        duration: storeDelivery,
        distance: storeDistance,
    } = useCartStore((state) => state.cart);
    const {
        setOrigin,
        setDestination,
        origin,
        destination,
        originCoords,
        destinationCoords,
    } = useLocationStore();

    const handleNext = () => {
        setAdditionalInfo(infoText);
        setModalVisible(false);
    };

    const handleSwitchToggle = (isChecked: boolean) => {
        // Set delivery option in store
        setDeliveryOption(isChecked ? "delivery" : "pickup");
        // Only open modal if switching to delivery
        if (isChecked) {
            setModalVisible(true);
        }
    };

    const prepareOrderForServer = (): OrderFoodOLaundry => {
        return {
            order_items: cart.order_items.map((item) => ({
                vendor_id: item.vendor_id,
                item_id: item.item_id,
                quantity: item.quantity,
            })),
            pickup_coordinates: originCoords || [0, 0],
            dropoff_coordinates: destinationCoords || [0, 0],
            distance: cart.distance,
            require_delivery: cart.require_delivery,
            duration: cart.duration,
            origin: origin ?? undefined,
            destination: destination ?? undefined,
            ...(cart.additional_info && { additional_info: cart.additional_info }),
        };
    };

    const orderData = prepareOrderForServer();

    const { mutate, data, isPending } = useMutation({
        mutationKey: ["createOrder", user?.sub],
        mutationFn: () => createOrder(cart.order_items[0].vendor_id, orderData),
        onSuccess: (data) => {
            router.push({
                pathname: "/payment/[orderId]",
                params: {
                    orderNumber: data?.order?.order_number,
                    deliveryType: data?.delivery?.delivery_type,
                    orderType: data?.order?.order_type,
                    paymentLink: data?.order?.payment_link,
                    orderId: data?.order?.id,
                    deliveryFee: data?.delivery?.delivery_fee,
                    orderItems: JSON.stringify(data?.order?.order_items),
                },
            });
        },
        onError: (error) => {
            Notifier.showNotification({
                title: "Error",
                description: `${error.message}`,
                Component: NotifierComponents.Alert,
                componentProps: {
                    alertType: "error",
                },
            });
        },
    });


    // Fetch distance and duration when origin or destination changes
    useEffect(() => {
        const fetchAndUseTravelInfo = async () => {
            // Only proceed if we have both origin and destination
            if (!origin || !destination) {
                return;
            }

            // Use origin from store for originQuery
            const originQuery = encodeURIComponent(origin);
            const destinationQuery = encodeURIComponent(destination);

            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destinationQuery}&origins=${originQuery}&units=metric&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY}`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                const distanceText = data?.rows?.[0]?.elements?.[0]?.distance?.text;
                const durationText = data?.rows?.[0]?.elements?.[0]?.duration?.text;

                if (distanceText && durationText) {
                    const distanceValue = parseFloat(
                        distanceText.replace(/[^0-9.]/g, "")
                    );

                    setDistance(distanceValue);
                    setDuration(durationText);
                    updateDistance(distanceValue);
                    updateDuration(durationText);
                }
            } catch (error) {
                console.error("Failed to fetch distance matrix:", error);
            }
        };

        fetchAndUseTravelInfo();
    }, [origin, destination]);

    return (
        <>

            {cart?.order_items.length === 0 ? (
                <View
                    flex={1}
                    backgroundColor={"$background"}
                    justifyContent="center"
                    alignItems="center"
                >
                    <ShoppingCart color={theme.icon.val} size={100} />
                    <Text fontSize={12} color={'$icon'} textAlign="center">Your cart is empty!</Text>
                </View>
            ) : (
                <>
                    <View marginVertical={'$2.5'} />
                    <ScrollView
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingBottom: 20,
                        }}
                    >
                        {cart.order_items.map((item) => (
                            <Item key={item?.item_id} item={item} />
                        ))}

                        <Card
                            padded
                            width={"90%"}
                            flexDirection="row"
                            justifyContent="space-between"
                            alignSelf="center"
                            bordered
                            marginTop="$5"
                        >
                            <Text color={"$icon"}>Total</Text>
                            <Text fontWeight={"bold"}>₦ {totalCost}</Text>
                        </Card>

                        <Button
                            disabled={isPending}
                            width={"90%"}
                            marginVertical={"$5"}
                            alignSelf="center"
                            backgroundColor={isPending ? '$cardDark' : "$btnPrimaryColor"}
                            onPress={() => mutate()}
                        >
                            {isPending ? <ActivityIndicator size="large" color="white" /> : 'PROCEED TO PAYMENT'}
                        </Button>
                        <XStack
                            gap={"$3"}
                            alignSelf={"center"}
                            backgroundColor="$borderColor"
                            alignItems="center"
                            justifyContent="center"
                            paddingHorizontal={"$5"}
                            borderRadius={"$10"}
                            marginVertical={"$5"}
                        >
                            <Label>PICKUP</Label>
                            <Switch
                                checked={require_delivery === "delivery"}
                                onCheckedChange={handleSwitchToggle}
                            >
                                <Switch.Thumb
                                    backgroundColor={
                                        require_delivery === "delivery"
                                            ? "$btnPrimaryColor"
                                            : "$cardLight"
                                    }
                                />
                            </Switch>
                            <Label>DELIVERY</Label>
                        </XStack>
                        {require_delivery === "delivery" && (
                            <Card
                                padded
                                width={"90%"}
                                alignSelf="center"
                                bordered
                                marginBottom="$15"

                            >
                                {/* DELIVERY INFO */}
                                <XStack>
                                    <Text width={'25%'}
                                        style={{
                                            fontFamily: "Poppins-Regular",
                                            fontSize: 11,
                                            color: theme.text.val,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Origin:{" "}
                                    </Text>
                                    <Paragraph
                                        width={'75%'}
                                        style={{
                                            fontFamily: "Poppins-Regular",
                                            fontSize: 11,
                                            color: theme.text.val,
                                        }}
                                    >
                                        {origin}
                                    </Paragraph>
                                </XStack>

                                <XStack>
                                    <Text
                                        width={'25%'}
                                        style={{
                                            fontFamily: "Poppins-Regular",
                                            fontSize: 11,
                                            color: theme.text.val,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Destination:{" "}
                                    </Text>
                                    <Paragraph
                                        width={'75%'}
                                        style={{
                                            fontFamily: "Poppins-Regular",
                                            fontSize: 11,
                                            color: theme.text.val,
                                        }}
                                    >
                                        {destination}
                                    </Paragraph>
                                </XStack>


                                <XStack>
                                    <Text
                                        width={'25%'}

                                        style={{
                                            fontFamily: "Poppins-Regular",
                                            fontSize: 11,
                                            color: theme.text.val,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Duration:   {" "}
                                    </Text>
                                    <Paragraph
                                        width={'75%'}
                                        style={{
                                            fontFamily: "Poppins-Regular",
                                            fontSize: 11,
                                            color: theme.text.val,
                                        }}
                                    >
                                        {storeDelivery}
                                    </Paragraph>
                                </XStack>
                                <XStack>
                                    <Text
                                        width={'25%'}
                                        style={{
                                            fontFamily: "Poppins-Regular",
                                            fontSize: 11,
                                            color: theme.text.val,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Distance:{" "}
                                    </Text>
                                    <Paragraph
                                        width={'75%'}
                                        style={{
                                            fontFamily: "Poppins-Regular",
                                            fontSize: 11,
                                            color: theme.text.val,
                                        }}
                                    >
                                        {storeDistance} Km
                                    </Paragraph>
                                </XStack>

                                <XStack>
                                    <Text
                                        width={'25%'}
                                        style={{
                                            fontFamily: "Poppins-Regular",
                                            fontSize: 11,
                                            color: theme.text.val,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Additional Info:
                                    </Text>
                                    <Paragraph
                                        width={'75%'}
                                        flex={1}
                                        flexWrap="wrap"
                                        style={{
                                            fontFamily: "Poppins-Regular",
                                            fontSize: 11,
                                            color: theme.text.val,
                                        }}
                                    >
                                        {cart.additional_info}
                                    </Paragraph>
                                </XStack>
                                <Text
                                    style={{
                                        fontFamily: "Poppins-Regular",
                                        fontSize: 11,
                                        color: theme.text.val,
                                    }}
                                >
                                    Delivery Option: {require_delivery.toUpperCase()}
                                </Text>
                            </Card>
                        )}
                    </ScrollView>

                    <AppModal
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        height="90%"
                    >

                        <AppTextInput
                            label="Pickup Location"
                            value={origin || ""}
                            editable={false}
                        />
                        <View marginVertical='$1.5' />
                        <GoogleTextInput
                            placeholder="Destination"
                            disableScroll={true}
                            value={destination}
                            errorMessage={error.destination}
                            onChangeText={() => { }}
                            handlePress={(lat, lng, address) => {
                                setDestination(address, [lat, lng]);
                                setError((prev) => ({ ...prev, destination: "" }));
                            }}
                        />
                        <View marginVertical='$1.5' />
                        <AppTextInput
                            label="Additional Information"
                            value={infoText}
                            onChangeText={(e) => setInfoText(e)}
                        />

                        <Button
                            width={"90%"}
                            marginVertical={"$5"}
                            backgroundColor={"$btnPrimaryColor"}
                            alignSelf="center"
                            onPress={handleNext}
                        >
                            Ok
                        </Button>
                    </AppModal>

                </>
            )}
        </>
    );
};

export default Cart;

const styles = StyleSheet.create({});
