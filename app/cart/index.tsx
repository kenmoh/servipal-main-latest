import AppTextInput from "@/components/AppInput";
import AppModal from "@/components/AppModal";
import Item from "@/components/CartItem";
import GoogleTextInput from "@/components/GoogleTextInput";
import { useCartStore } from "@/store/cartStore";
import { useLocationStore } from "@/store/locationStore";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
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
    const { setDeliveryOption, cart, setAdditionalInfo } = useCartStore();
    const { require_delivery } = useCartStore((state) => state.cart);
    const { setOrigin, setDestination, origin, destination } = useLocationStore();

    console.log(cart, cart.additional_info);

    const handleNext = () => {
        setAdditionalInfo(infoText)
        setModalVisible(false)
    }

    const handleSwitchToggle = (isChecked: boolean) => {
        // Set delivery option in store
        setDeliveryOption(isChecked ? "delivery" : "pickup");
        // Only open modal if switching to delivery
        if (isChecked) {
            setModalVisible(true);
        }
    };

    // Fetch distance and duration when origin or destination changes
    useEffect(() => {
        const fetchAndUseTravelInfo = async () => {
            // Only proceed if we have both origin and destination
            if (origin || destination) {
                return;
            }

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


                }
            } catch (error) {
                console.error("Failed to fetch distance matrix:", error);
            }
        };

        fetchAndUseTravelInfo();
    }, [origin, destination]);


    return (

        <View flex={1} backgroundColor={theme.background.val}>
            <ScrollView

                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: 20,
                }}
            >

                {
                    cart.order_items.map(item => <Item key={item?.item_id} item={item} />)
                }


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
                <Card padded width={'95%'} alignSelf="center" bordered marginBottom='$5'>
                    {/* DELIVERY INFO */}
                    <Paragraph
                        style={{
                            fontFamily: "Poppins-Regular",
                            fontSize: 11,
                            color: theme.text.val,
                        }}
                    >
                        Origin:{" "} {origin}
                    </Paragraph>
                    <Paragraph
                        style={{
                            fontFamily: "Poppins-Regular",
                            fontSize: 11,
                            color: theme.text.val,
                        }}
                    >
                        Destination:{" "} {destination}
                    </Paragraph>
                    <Paragraph
                        style={{
                            fontFamily: "Poppins-Regular",
                            fontSize: 11,
                            color: theme.text.val,
                        }}
                    >
                        Duration:{" "} {duration}
                    </Paragraph>
                    <Paragraph
                        style={{
                            fontFamily: "Poppins-Regular",
                            fontSize: 11,
                            color: theme.text.val,
                        }}
                    >
                        Distance:{" "} {distance}
                    </Paragraph>
                    <XStack>
                        <Text
                            style={{
                                fontFamily: "Poppins-Regular",
                                fontSize: 11,
                                color: theme.text.val,
                            }}
                        >
                            Additional Info:{" "}
                        </Text>
                        <Paragraph
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
                </Card>
            </ScrollView>
            <AppModal visible={modalVisible} onClose={() => setModalVisible(false)}>

                <GoogleTextInput
                    placeholder="Pickup Location"
                    errorMessage={error.origin}
                    disableScroll={true}
                    value={origin}
                    onChangeText={() => { }}
                    handlePress={(lat, lng, address) => {
                        setOrigin(address, [lat, lng]);
                        setError((prev) => ({ ...prev, origin: "" }));
                    }}
                />

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

                <AppTextInput
                    placeholder="Additional Information"
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
        </View>
    );
};

export default Cart;

const styles = StyleSheet.create({});
