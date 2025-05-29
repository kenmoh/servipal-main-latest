
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect } from "react";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from "react-native-reanimated";
import {useTheme} from 'tamagui'


const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

type ViewCartBtnType = {
    totalCost: string;
    label: string;
    totalItem: number;
    onPress: () => void;
};

const CartInfoBtn = ({ totalCost, totalItem, onPress, label }: ViewCartBtnType) => {
    const theme  = useTheme();

    const opacity = useSharedValue(0);


    useEffect(() => {
        if (totalItem > 0) {
            opacity.value = withTiming(1, {
                duration: 1500,
                easing: Easing.out(Easing.exp),
            });

        }
    }, [totalItem]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,

        };
    });

    if (totalItem === 0) return null;

    return (
        <AnimatedTouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[
                styles.container,

                animatedStyle,
            ]}
        >
            <Text style={[styles.text, { color: theme.text.val, fontSize: 20, alignSelf: 'flex-end' }]}>
                ₦ {totalCost}
            </Text>
            <View
                style={{

                    alignItems: "center",
                    backgroundColor: theme.btnPrimaryColor.val,
                    paddingVertical: 10,
                    paddingHorizontal: 35,
                    borderRadius: 35
                }}
            >
                <Text style={[styles.text, { color: theme.text.val }]}>
                    {label} ({totalItem})
                </Text>

            </View>
        </AnimatedTouchableOpacity>
    );
};

export default CartInfoBtn;

const styles = StyleSheet.create({
    container: {
        width: "90%",
        bottom: 25,
        flexDirection: 'row',
        borderRadius: 7.5,
        zIndex: 999,
        justifyContent: 'space-between',
        paddingVertical: 5,
        alignSelf: 'center'

    },

    text: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 14,
    },
});