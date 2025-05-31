import { Dimensions, StyleSheet, Text } from 'react-native'
import { withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from 'tamagui';

const DeliveryTabs = withLayoutContext(createMaterialTopTabNavigator().Navigator);

const DeliveryLayout = () => {
    const theme = useTheme()
    return (
        <>

            <DeliveryTabs
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
                <DeliveryTabs.Screen
                    name="index"
                    options={{
                        tabBarLabel: 'Delivery',
                    }}
                />
                <DeliveryTabs.Screen
                    name="orders"
                    options={{
                        tabBarLabel: 'My Orders',
                    }}
                />
            </DeliveryTabs>
        </>
    )
}

export default DeliveryLayout