import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    Easing,
} from "react-native-reanimated";
import { useTheme } from 'tamagui'

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface ViewCartBtnProps {
    totalCost: string;
    label: string;
    totalItem: number;
    onPress: () => void;
}

const CartInfoBtn = ({ totalCost, totalItem, onPress, label }: ViewCartBtnProps) => {
    const theme = useTheme();
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(100);

    useEffect(() => {
        if (totalItem > 0) {
            opacity.value = withTiming(1, {
                duration: 800,
                easing: Easing.out(Easing.exp),
            });
            translateY.value = withSpring(0, {
                damping: 20,
                stiffness: 90,
            });
        }
    }, [totalItem]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    if (totalItem === 0) return null;

    return (
        <AnimatedTouchableOpacity
            onPress={onPress}
            activeOpacity={0.9}
            style={[styles.container, animatedStyle, { backgroundColor: theme.borderColor.val }]}
        >
            <View style={styles.costContainer}>
                <Text style={[styles.cost, { color: theme.text.val }]}>
                    ₦{totalCost}
                </Text>
            </View>

            <View style={[styles.buttonContainer, { backgroundColor: theme.background.val }]}>
                <Text style={[styles.buttonText, { color: theme.text.val }]}>
                    {label} • {totalItem}
                </Text>
            </View>
        </AnimatedTouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: "92%",
        bottom: Platform.OS === 'ios' ? 40 : 55,
        flexDirection: 'row',
        borderRadius: 12,
        zIndex: 999,
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    costContainer: {
        justifyContent: 'center',
    },
    cost: {
        fontFamily: "Poppins-Bold",
        fontSize: 18,
    },
    buttonContainer: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    buttonText: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 14,
    },
});

export default CartInfoBtn;
