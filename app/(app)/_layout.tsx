import { StyleSheet } from 'react-native'
import React, { ReactNode } from 'react'
import { Tabs } from 'expo-router'
import { Text, useTheme, View } from 'tamagui'
import { AntDesign, Entypo, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';


const TAB_BAR_ICON_SIZE = 25;


const CustomTabBarIcon = ({
    children,
    focused,

}: {
    children: ReactNode;
    focused: boolean;

}) => {

    return (
        <>
            <View

                backgroundColor={focused ? '$btnPrimaryColor' : '$background'}
                style={{

                    padding: 5,
                    borderRadius: 80,
                    height: 40,
                    width: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: 'center',
                    marginTop: -18
                }}
            >
                {children}
            </View>

        </>
    );
};

const TabBarLayout = () => {
    const theme = useTheme()
    return (
        <Tabs screenOptions={{

            tabBarActiveTintColor: theme.text.val,
            headerShown: false,
            headerTitleAlign: "center",
            headerTintColor: theme.text.val,
            tabBarShowLabel: false,
            tabBarHideOnKeyboard: true,
            tabBarItemStyle: {
                padding: 15,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                backgroundColor: theme.background.val,
                borderTopColor: theme.btnPrimaryColor.val,
                borderTopWidth: StyleSheet.hairlineWidth,
            },



        }}


        >
            <Tabs.Screen name='delivery' options={{
                title: '',
                tabBarIcon: ({ color, focused }) => (
                    <CustomTabBarIcon focused={focused}>
                        <AntDesign name="home" size={TAB_BAR_ICON_SIZE} color={color} />
                    </CustomTabBarIcon>
                ),
            }} />
            <Tabs.Screen name='food' options={{
                title: '',
                tabBarIcon: ({ color, focused }) => (
                    <CustomTabBarIcon focused={focused}>
                        <MaterialIcons
                            name="restaurant"
                            size={TAB_BAR_ICON_SIZE}
                            color={color}
                        />
                    </CustomTabBarIcon>
                ),
            }} />
            <Tabs.Screen name='laundry' options={{
                title: '',
                tabBarIcon: ({ color, focused }) => (
                    <CustomTabBarIcon focused={focused}>
                        <MaterialCommunityIcons
                            name="washing-machine"
                            size={TAB_BAR_ICON_SIZE}
                            color={color}
                        />
                    </CustomTabBarIcon>
                ),
            }} />
            <Tabs.Screen name='marketplace' options={{
                title: '',
                tabBarIcon: ({ color, focused }) => (
                    <CustomTabBarIcon focused={focused}>
                        <Entypo name="shop" size={TAB_BAR_ICON_SIZE} color={color} />
                    </CustomTabBarIcon>
                ),
            }} />
            <Tabs.Screen name='wallet' options={{
                title: '',
                tabBarIcon: ({ color, focused }) => (
                    <CustomTabBarIcon focused={focused}>
                        <Entypo name="wallet" size={TAB_BAR_ICON_SIZE} color={color} />
                    </CustomTabBarIcon>
                ),
            }} />
            <Tabs.Screen name='profile' options={{
                title: '',
                tabBarIcon: ({ color, focused }) => (
                    <CustomTabBarIcon focused={focused}>
                        <AntDesign name="user" size={TAB_BAR_ICON_SIZE} color={color} />
                    </CustomTabBarIcon>
                ),
            }} />

        </Tabs>
    )
}

export default TabBarLayout

const styles = StyleSheet.create({})