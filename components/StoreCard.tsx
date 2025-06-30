import { CompanyProfile } from "@/types/user-types";
import { AntDesign } from "@expo/vector-icons";
import { RelativePathString, router, type Href } from "expo-router";
import { StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import { Card, Paragraph, YStack, XStack, useTheme, View } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from '@/context/authContext'
import { getCoordinatesFromAddress } from '@/utils/geocoding';
import { useLocationStore } from '@/store/locationStore';

const IMAGET_HEIGHT = Dimensions.get("window").height * 0.25;

const StoreCard = ({
    item,
    distance,
    pathName,
}: {
    distance?: number;
    item: CompanyProfile;
    pathName: Href;
}) => {
    const theme = useTheme();
    const { user } = useAuth()
    const { setOrigin } = useLocationStore();

    const handleStoreSelect = async () => {
        const address = item?.location;
        if (address) {
            const coords = await getCoordinatesFromAddress(address);
            if (coords) {
                setOrigin(address, [coords.lat, coords.lng]);
            }
        }
        router.push({
            pathname: pathName as RelativePathString,
            params: {
                storeId: item?.id,
                companyName: item?.company_name,
                backDrop: item?.backdrop_image_url,
                profileImage: item?.backdrop_image_url,
                openingHour: item?.opening_hour,
                closingHour: item?.closing_hour,
                address: item?.location,
                rating: item?.rating?.average_rating,
                numberOfReviews: item?.rating.number_of_reviews,
            },
        });
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleStoreSelect}
        >
            <Card
                width={"90%"}
                alignSelf="center"
                borderWidth={StyleSheet.hairlineWidth}
                borderColor="$cardBorder"
                overflow="hidden"
                marginVertical={5}
                height={IMAGET_HEIGHT}
                elevation={2}
            >

                {/* Background Image */}
                <Image
                    source={{ uri: item?.backdrop_image_url }}
                    style={styles.image}
                />

                {/* Gradient Overlay */}
                <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.7)"]}
                    style={styles.gradient}
                />

                {/* Rating Badge */}
                {parseInt(item?.rating.average_rating) > 0 && (
                    <View style={styles.ratingBadge}>
                        <Paragraph color="white" fontWeight="bold">
                            {item?.rating?.average_rating}
                        </Paragraph>
                        <AntDesign
                            name="star"
                            size={14}
                            color={theme.btnPrimaryColor.val}
                        />
                    </View>
                )}

                {/* Content */}
                <YStack
                    position="absolute"
                    bottom={0}
                    padding="$3"
                    width="100%"
                    gap="$1"
                >
                    {['restaurant_vendor', 'laundry_vendor', 'dispatch'].includes(user?.user_type || "") && user?.sub === item?.id ? <View
                        backgroundColor='rgba(0, 0, 255, 0.5)'
                        alignSelf={'flex-start'}
                        paddingHorizontal={'$2'}
                        paddingVertical={'$1.5'}
                        borderRadius={20}
                    >
                        <Paragraph
                            fontSize={16}
                            color="white"
                            numberOfLines={1}
                            style={{
                                fontFamily: "Poppins-Bold",
                            }}
                        >
                            🏪{item?.company_name}
                        </Paragraph>
                    </View>
                        :
                        <Paragraph
                            fontSize={16}
                            color="white"
                            numberOfLines={1}
                            style={{
                                fontFamily: "Poppins-Bold",
                            }}
                        >
                            {item?.company_name}
                        </Paragraph>}
                    <XStack alignItems="center" gap="$2">
                        <Paragraph
                            fontSize={12}
                            color="white"
                            opacity={0.9}
                            numberOfLines={1}
                        >
                            {item?.location}
                        </Paragraph>
                        {distance && (
                            <Paragraph color={"$icon"} fontSize={11}>
                                • {distance.toFixed(1)}km away
                            </Paragraph>
                        )}
                    </XStack>
                </YStack>
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    gradient: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
    },
    ratingBadge: {
        position: "absolute",
        top: 12,
        right: 12,
        flexDirection: "row",
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignItems: "center",
        gap: 4,
    },
});

export default StoreCard;
