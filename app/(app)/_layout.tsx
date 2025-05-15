import { StyleSheet } from 'react-native'
import React, { ReactNode } from 'react'
import { withLayoutContext } from 'expo-router'
import {
    createNativeBottomTabNavigator,
    NativeBottomTabNavigationOptions,
    NativeBottomTabNavigationEventMap,
} from '@bottom-tabs/react-navigation';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { useTheme, View } from 'tamagui'
import { Bell, BikeIcon, CookingPotIcon, Store, UserRound, Wallet, WashingMachine } from 'lucide-react-native'



const TAB_BAR_ICON_SIZE = 25;

const BottomTabNavigator = createNativeBottomTabNavigator().Navigator

const Tabs = withLayoutContext<
    NativeBottomTabNavigationOptions,
    typeof BottomTabNavigator,
    TabNavigationState<ParamListBase>,
    NativeBottomTabNavigationEventMap
>(BottomTabNavigator);


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
        <Tabs
            tabBarStyle={{
                backgroundColor: theme.background.val,

            }}
            // labeled
            tabLabelStyle={{
                fontFamily: 'Poppins-Light'
            }}

            screenOptions={{

                tabBarActiveTintColor: theme.btnPrimaryColor.val,

                // headerShown: false,





                // headerShown: false,
                // headerTitleAlign: "center",
                // headerTintColor: theme.text.val,
                // tabBarShowLabel: false,
                // tabBarHideOnKeyboard: true,
                // tabBarStyle: {
                //     height: 55
                // },
                // tabBarItemStyle: {
                //     padding: 15,
                //     justifyContent: 'center',
                //     alignItems: 'center',
                //     flexDirection: 'column',
                //     backgroundColor: theme.background.val,
                // },
                // tabBarBadgeStyle: {
                //     position: 'absolute',
                //     top: -12,
                //     backgroundColor: theme.btnPrimaryColor.val,
                //     color: 'white'
                // }



            }}


        >
            <Tabs.Screen name='delivery' options={{

                // headerShown: false,
                tabBarIcon: () => require('@/assets/images/bike.svg')
                // tabBarIcon: ({ focused }) => (
                //     <CustomTabBarIcon focused={focused}>
                //         <BikeIcon size={TAB_BAR_ICON_SIZE} color={focused ? 'white' : theme.icon.val} />
                //     </CustomTabBarIcon>
                // ),
            }} />
            <Tabs.Screen name='food' options={{
                title: '',
                tabBarLabel: 'Restau...',
                tabBarIcon: () => require('@/assets/images/utensils.svg')

                // tabBarIcon: ({ focused }) => (
                //     <CustomTabBarIcon focused={focused}>
                //         <CookingPotIcon
                //             size={TAB_BAR_ICON_SIZE}
                //             color={focused ? 'white' : theme.icon.val}
                //         />
                //     </CustomTabBarIcon>
                // ),
            }} />
            <Tabs.Screen name='laundry' options={{
                title: '',
                tabBarLabel: 'Laundry',
                tabBarIcon: () => require('@/assets/images/washing-machine.svg')
                // tabBarIcon: ({ focused }) => (
                //     <CustomTabBarIcon focused={focused}>
                //         <WashingMachine
                //             size={TAB_BAR_ICON_SIZE}
                //             color={focused ? 'white' : theme.icon.val}
                //         />
                //     </CustomTabBarIcon>
                // ),
            }} />
            <Tabs.Screen name='(marketplace)' options={{
                title: '',
                tabBarLabel: 'Store',

                tabBarIcon: () => require('@/assets/images/store.svg')
                // tabBarIcon: ({ focused }) => (
                //     <CustomTabBarIcon focused={focused}>
                //         <Store size={TAB_BAR_ICON_SIZE} color={focused ? 'white' : theme.icon.val} />

                //     </CustomTabBarIcon>
                // ),
            }} />
            <Tabs.Screen name='wallet' options={{
                title: '',
                tabBarLabel: 'Wallet',
                tabBarIcon: () => require('@/assets/images/wallet.svg')
                // tabBarIcon: ({ focused }) => (
                //     <CustomTabBarIcon focused={focused}>
                //         <Wallet size={TAB_BAR_ICON_SIZE} color={focused ? 'white' : theme.icon.val} />
                //     </CustomTabBarIcon>
                // ),
            }} />
            {/* <Tabs.Screen name='(profile)' options={{
                title: '',
                tabBarIcon: () => require('@/assets/images/user-round.svg')
                
            }} /> */}

            <Tabs.Screen name='notification' options={{
                title: '',
                tabBarBadge: '3',
                tabBarLabel: 'Notifi..',
                tabBarIcon: () => require('@/assets/images/bell.svg')

                // tabBarIcon: ({ focused }) => (
                //     <CustomTabBarIcon focused={focused}>
                //         <Bell size={TAB_BAR_ICON_SIZE} color={focused ? 'white' : theme.icon.val} />
                //     </CustomTabBarIcon>
                // ),
            }} />

        </Tabs>
    )
}

export default TabBarLayout

const styles = StyleSheet.create({})