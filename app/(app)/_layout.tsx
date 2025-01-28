import { StyleSheet } from 'react-native'
import React, { ReactNode } from 'react'
import { Tabs } from 'expo-router'
import { useTheme, View } from 'tamagui'
import { BikeIcon, CookingPotIcon, Store, UserRound, Wallet, WashingMachine } from 'lucide-react-native'



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
            tabBarStyle: {
                height: 55
            },
            tabBarItemStyle: {
                padding: 15,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                backgroundColor: theme.background.val,
            },



        }}


        >
            <Tabs.Screen name='delivery' options={{
                title: '',
                tabBarIcon: ({ color, focused }) => (
                    <CustomTabBarIcon focused={focused}>
                        <BikeIcon size={TAB_BAR_ICON_SIZE} color={color} />
                    </CustomTabBarIcon>
                ),
            }} />
            <Tabs.Screen name='food' options={{
                title: '',
                tabBarIcon: ({ color, focused }) => (
                    <CustomTabBarIcon focused={focused}>
                        <CookingPotIcon
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
                        <WashingMachine
                            size={TAB_BAR_ICON_SIZE}
                            color={color}
                        />
                    </CustomTabBarIcon>
                ),
            }} />
            <Tabs.Screen name='(marketplace)' options={{
                title: '',
                tabBarIcon: ({ color, focused }) => (
                    <CustomTabBarIcon focused={focused}>
                        <Store size={TAB_BAR_ICON_SIZE} color={color} />

                    </CustomTabBarIcon>
                ),
            }} />
            <Tabs.Screen name='wallet' options={{
                title: '',
                tabBarIcon: ({ color, focused }) => (
                    <CustomTabBarIcon focused={focused}>
                        <Wallet size={TAB_BAR_ICON_SIZE} color={color} />
                    </CustomTabBarIcon>
                ),
            }} />
            <Tabs.Screen name='(profile)' options={{
                title: '',
                tabBarIcon: ({ color, focused }) => (
                    <CustomTabBarIcon focused={focused}>
                        <UserRound size={TAB_BAR_ICON_SIZE} color={color} />
                    </CustomTabBarIcon>
                ),
            }} />

        </Tabs>
    )
}

export default TabBarLayout

const styles = StyleSheet.create({})