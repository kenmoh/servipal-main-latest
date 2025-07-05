import { StyleSheet } from 'react-native'
import React, { ReactNode, memo } from 'react'
import { Tabs } from 'expo-router'

import { useTheme, View } from 'tamagui'
import { Bell, BikeIcon, Settings, Store, Utensils, WashingMachine } from 'lucide-react-native'
import { useAuth } from '@/context/authContext';


const TAB_BAR_ICON_SIZE = 25;




const CustomTabBarIcon = memo(({
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
});

CustomTabBarIcon.displayName = 'CustomTabBarIcon';

const TabBarLayout = () => {
    const theme = useTheme()
    const { user } = useAuth()

    // Memoize theme values to prevent re-renders
    const activeColor = theme.btnPrimaryColor.val;
    const iconColor = theme.icon.val;

    return (
        <Tabs
            screenOptions={{

                tabBarActiveTintColor: activeColor,
                headerShown: false,
                headerTitleAlign: "center",
                headerTintColor: theme.text.val,
                tabBarShowLabel: false,
                tabBarHideOnKeyboard: true,
                tabBarStyle: {
                    height: 110,
                    // marginBottom: 18,
                    backgroundColor: theme.background.val
                },
                tabBarItemStyle: {
                    padding: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    backgroundColor: theme.background.val,
                },
                tabBarBadgeStyle: {
                    position: 'absolute',
                    top: -12,
                    backgroundColor: theme.btnPrimaryColor.val,
                    color: 'white'
                }



            }}


        >
            <Tabs.Screen name='delivery' options={{

                // headerShown: false,
                title: '',

                tabBarIcon: ({ focused }) => (
                    <CustomTabBarIcon focused={focused}>
                        <BikeIcon size={TAB_BAR_ICON_SIZE} color={focused ? 'white' : iconColor} />
                    </CustomTabBarIcon>
                ),
            }} />
            <Tabs.Screen name='food' options={{
                title: '',
                href: user?.user_type === 'dispatch' || user?.user_type === 'rider' ? null : undefined,
                tabBarIcon: ({ focused }) => (
                    <CustomTabBarIcon focused={focused}>
                        <Utensils
                            size={TAB_BAR_ICON_SIZE}
                            color={focused ? 'white' : iconColor}
                        />
                    </CustomTabBarIcon>
                ),
            }} />
            <Tabs.Screen name='laundry' options={{
                title: '',
                href: user?.user_type === 'dispatch' || user?.user_type === 'rider' ? null : undefined,


                tabBarIcon: ({ focused }) => (
                    <CustomTabBarIcon focused={focused}>
                        <WashingMachine
                            size={TAB_BAR_ICON_SIZE}
                            color={focused ? 'white' : iconColor}
                        />
                    </CustomTabBarIcon>
                ),
            }} />




            <Tabs.Screen name='profile' options={{
                title: '',
                tabBarIcon: ({ focused }) => (
                    <CustomTabBarIcon focused={focused}>
                        <Settings size={TAB_BAR_ICON_SIZE} color={focused ? 'white' : iconColor} />
                    </CustomTabBarIcon>
                ),
            }} />


        </Tabs>
    )
}




export default TabBarLayout

const styles = StyleSheet.create({})