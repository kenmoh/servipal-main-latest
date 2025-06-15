import { Dimensions, StyleSheet, Image } from 'react-native'
import { withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme, View, XStack, YStack, Heading, Paragraph } from 'tamagui';
import { useAuth } from '@/context/authContext';
import { useLocalSearchParams } from 'expo-router';
import { AntDesign, Feather } from "@expo/vector-icons";


const StoreTabs = withLayoutContext(createMaterialTopTabNavigator().Navigator);

const StoreHeader = () => {
    const theme = useTheme();
    const { user } = useAuth()
    const {
        backDrop,
        companyName,
        openingHour,
        closingHour,
        address,
        rating,
        reviews,
        profileImage,
    } = useLocalSearchParams();

    console.log('Backdrop: ', backDrop, 'Profile: ', profileImage)
    return (
        <View backgroundColor={theme.background.val}>
            <View backgroundColor={theme.cardBackground.val}>
                <Image
                    source={{ uri: backDrop || require("@/assets/images/Burge.jpg") }}
                    style={{
                        height: 150,
                        width: '100%',
                        objectFit: "cover",
                    }}
                />
                <View padding="$4" backgroundColor={'$cardBackground'}>
                    <View position="absolute" top={-35} left={20}>
                        <Image
                            source={{ uri: profileImage || require("@/assets/images/Burge.jpg") }}
                            style={{
                                height: 65,
                                width: 65,
                                borderRadius: 10,
                                objectFit: "cover",
                            }}
                        />
                    </View>

                    <View marginTop="$3">
                        <Heading
                            color={"$text"}
                            fontSize={16}
                            fontWeight={"bold"}
                            textTransform='capitalize'
                        >
                            {companyName}
                        </Heading>
                        <XStack justifyContent='space-between'>
                            <XStack alignItems="center" gap={"$2"} marginTop="$2">
                                <AntDesign name="staro" color={theme.btnPrimaryColor.val} />
                                <Paragraph
                                    color={"$icon"}
                                    fontFamily={"$body"}
                                    fontSize={"$2"}
                                >
                                    {rating}
                                </Paragraph>
                                <Paragraph
                                    color={"$icon"}
                                    fontFamily={"$body"}
                                    fontSize={"$2"}
                                >
                                    ({reviews} reviews)
                                </Paragraph>
                            </XStack>
                            <XStack alignItems="center" gap={"$2"} marginTop="$2">
                                <AntDesign name="clockcircleo" color={theme.icon.val} />
                                <Paragraph
                                    color={"$icon"}
                                    fontFamily={"$body"}
                                    fontSize={"$2"}
                                >
                                    {openingHour} - {closingHour}
                                </Paragraph>
                            </XStack>
                        </XStack>
                        <XStack alignItems="center" gap={"$2"} marginTop="$2">
                            <Feather name="map-pin" color={theme.icon.val} size={12} />
                            <Paragraph
                                color={"$icon"}
                                fontFamily={"$body"}
                                fontSize={"$2"}
                                flexShrink={1}
                            >
                                {address}
                            </Paragraph>
                        </XStack>

                    </View>
                </View>
            </View>
        </View>
    );
};

const StoreTabLayout = () => {
    const theme = useTheme()
    return (
        <>
            <StoreHeader />
            <StoreTabs
                initialRouteName="index"
                initialLayout={{ width: Dimensions.get('window').width }}
                screenOptions={{
                    tabBarLabelStyle: {
                        fontSize: 12,
                        textAlign: 'center',
                        textTransform: 'capitalize',
                        fontFamily: 'Poppins-Bold',
                    },
                    swipeEnabled: false,
                    tabBarActiveTintColor: theme.text.val,
                    tabBarInactiveTintColor: theme.borderColor.val,
                    tabBarAndroidRipple: { borderless: false },
                    tabBarPressOpacity: 0,
                    tabBarIndicatorStyle: {
                        backgroundColor: theme.btnPrimaryColor.val,
                        height: 3,
                    },
                    tabBarStyle: {
                        backgroundColor: theme.background.val,
                        borderBottomColor: theme.borderColor.val,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        elevation: 0,
                        shadowOpacity: 0,
                    }
                }}
            >
                <StoreTabs.Screen
                    name="index"
                    options={{
                        tabBarLabel: 'Menu',
                    }}
                />
                <StoreTabs.Screen
                    name="reviews"
                    options={{
                        tabBarLabel: 'Reviews',
                    }}
                />
            </StoreTabs>
        </>
    )
}

export default StoreTabLayout;