import { StyleSheet } from 'react-native'
import React, { ReactNode, memo } from 'react'
import { Tabs } from 'expo-router'

import { useTheme, View } from 'tamagui'
import { Bell, BikeIcon, Settings, Store, Utensils, WashingMachine } from 'lucide-react-native'
import { useAuth } from '@/context/authContext';


const TabBarLayout = () => {

    const { user } = useAuth()
    const activeColor = 'orange';
    const iconColor = "#9BA1A6"
    const text = "#ddd"

    return (
        <Tabs
            screenOptions={{

                tabBarActiveTintColor: activeColor,
                headerShown: false,
                headerTitleAlign: "center",
                headerTintColor: text,
                tabBarShowLabel: false,
                tabBarHideOnKeyboard: true,
                tabBarStyle: {
                    height: 110,
                    // marginBottom: 18,
                    backgroundColor: "#18191c"
                },
                tabBarItemStyle: {
                    padding: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    backgroundColor: "#18191c",
                },
                tabBarBadgeStyle: {
                    position: 'absolute',
                    top: -12,
                    backgroundColor: 'orange',
                    color: 'white'
                }



            }}


        >
            <Tabs.Screen name='delivery' options={{
                // headerShown: false,
                title: '',

                tabBarIcon: ({ focused, size }) => (
                    <BikeIcon size={size} color={focused ? activeColor : iconColor} />
                ),
            }} />
            <Tabs.Screen name='food' options={{
                title: '',
                href: user?.user_type === 'dispatch' || user?.user_type === 'rider' ? null : undefined,

                tabBarIcon: ({ focused, size }) => (
                    <Utensils size={size} color={focused ? activeColor : iconColor} />
                ),
            }} />
            <Tabs.Screen name='laundry' options={{
                title: '',
                href: user?.user_type === 'dispatch' || user?.user_type === 'rider' ? null : undefined,

                tabBarIcon: ({ focused, size }) => (
                    <WashingMachine size={size} color={focused ? activeColor : iconColor} />
                ),
            }} />




            <Tabs.Screen name='profile' options={{
                title: '',

                tabBarIcon: ({ focused, size }) => (
                    <Settings size={size} color={focused ? activeColor : iconColor} />
                ),
            }} />


        </Tabs>
    )
}




export default TabBarLayout

const styles = StyleSheet.create({})