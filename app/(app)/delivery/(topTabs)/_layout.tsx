import { StyleSheet, Text, View } from 'react-native'
import { withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from 'tamagui';

const DeliveryTabs = withLayoutContext(createMaterialTopTabNavigator().Navigator);

const DeliveryLayout = () => {
    const theme = useTheme()
    return (
        <DeliveryTabs screenOptions={{
            tabBarLabelStyle: {
                color: theme.tabIconDefault.val,
                fontSize: 12,
                textAlign: 'center',
                textTransform: 'capitalize',
                fontFamily: 'Poppins-Bold',

            },
            swipeEnabled: false,
            tabBarActiveTintColor: theme.text.val,
            tabBarInactiveTintColor: theme.icon.val,
            tabBarAndroidRipple: { borderless: false, color: theme.icon.val },

            tabBarIndicatorStyle: {
                backgroundColor: theme.btnPrimaryColor.val,
                height: StyleSheet.hairlineWidth
            },
            tabBarContentContainerStyle: {
                backgroundColor: theme.background.val,
            },
            tabBarStyle: {
                borderBottomColor: theme.borderColor.val,
                borderBottomWidth: StyleSheet.hairlineWidth,
                elevation: 0,
                shadowOpacity: 0,
                backgroundColor: theme.background.val,

            },

        }}>
            <DeliveryTabs.Screen name="index" options={{ title: 'Delivery' }} />
            <DeliveryTabs.Screen name="sendItem" options={{ title: 'Send Item' }} />
            <DeliveryTabs.Screen name="orders" options={{ title: 'My Orders' }} />


        </DeliveryTabs>
    )
}

export default DeliveryLayout

const styles = StyleSheet.create({})