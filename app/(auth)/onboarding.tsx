import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { onboardingSlides } from "@/constants/onboarding";

import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Image, useTheme } from "tamagui";

// const Onboarding = () => {
//     const theme = useTheme();

//     const swiperRef = useRef<Swiper>(null);
//     const [activeIndex, setActiveIndex] = useState(0)

//     const scale = useSharedValue(0.8);

//     const animatedStyle = useAnimatedStyle(() => {
//         return {
//             transform: [{ scale: scale.value }]
//         };
//     });
//     const handleIndexChanged = (index: number) => {
//         setActiveIndex(index);
//         scale.value = withTiming(1.2, { duration: 500 });
//     };

//     return (
//         <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.val }}>
//             <TouchableOpacity activeOpacity={0.6} onPress={() => router.replace('/(auth)/sign-in')}
//                 style={{
//                     width: 75, alignItems: 'center',
//                     position: 'absolute', top: 50, right: 25, zIndex: 999,
//                     backgroundColor: theme.transparentBtnPrimaryColor.val,
//                     paddingVertical: 5,
//                     paddingHorizontal: 15,
//                     borderRadius: 20
//                 }}>
//                 <Text style={{ color: theme.text.val, fontFamily: 'Poppins-Medium', fontSize: 14 }}>Skip</Text>

//             </TouchableOpacity>

//             <Swiper
//                 showsButtons
//                 buttonWrapperStyle={{ alignItems: 'flex-end' }}
//                 ref={swiperRef}
//                 loop={false}
//                 dot={
//                     <View
//                         style={[styles.dot, { backgroundColor: '#ddd', width: 10 }]}
//                     />

//                 }
//                 activeDot={
//                     <View
//                         style={[styles.dot, { backgroundColor: theme.btnPrimaryColor.val }]}
//                     />

//                 }
//                 // onIndexChanged={index => setActiveIndex(index)}
//                 onIndexChanged={handleIndexChanged}

//             >
//                 {onboardingSlides.map(slide => (
//                     <View key={slide.id} style={styles.container}>
//                         <Animated.View style={[styles.imageContainer, animatedStyle]}>
//                             <Image source={slide.image} style={styles.image} objectFit="contain" />
//                         </Animated.View>
//                         {/* <Image source={slide.image} style={styles.image} objectFit="contain" /> */}
//                         <View style={{ marginTop: 50, justifyContent: 'center', paddingHorizontal: 20 }}>
//                             <Text style={[styles.titleText, { color: theme.text.val }]}>{slide.name}</Text>
//                             <Text style={[styles.body, { color: theme.text.val }]}>{slide.description}</Text>
//                         </View>
//                     </View>
//                 ))}
//             </Swiper>
//             {activeIndex === onboardingSlides.length - 1 && (
//                 <TouchableOpacity activeOpacity={0.6} onPress={() => router.replace({ pathname: '/(auth)/sign-in' })} style={{
//                     position: 'absolute', bottom: 10, right: 15, zIndex: 999,
//                     backgroundColor: theme.btnPrimaryColor.val,
//                     paddingVertical: 5, paddingHorizontal: 20, borderRadius: 20
//                 }}>
//                     <AntDesign name="check" size={20} />
//                 </TouchableOpacity>
//             )}
//         </SafeAreaView>
//     );
// };

// export default Onboarding;

const Onboarding = () => {
    const theme = useTheme();
    const swiperRef = useRef<Swiper>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Create shared values for each slide's image and text
    const scales = onboardingSlides.map(() => ({
        image: useSharedValue(0.8),
        text: useSharedValue(0)
    }));

    // Animated style for image and text
    const getImageAnimatedStyle = (index: number) => {
        return useAnimatedStyle(() => ({
            transform: [{
                scale: withTiming(scales[index].image.value, {
                    duration: 500,
                    easing: Easing.ease
                })
            }],
            opacity: withTiming(scales[index].image.value === 1 ? 1 : 0.7, {
                duration: 500
            })
        }));
    };

    const getTextAnimatedStyle = (index: number) => {
        return useAnimatedStyle(() => ({
            transform: [{
                translateY: withTiming(scales[index].text.value * 20, {
                    duration: 500,
                    easing: Easing.ease
                })
            }],
            opacity: withTiming(scales[index].text.value, {
                duration: 500
            })
        }));
    };

    const handleIndexChanged = (index: number) => {
        setActiveIndex(index);

        // Reset all scales
        scales.forEach((scale, i) => {
            scale.image.value = i === index ? 1 : 0.8;
            scale.text.value = i === index ? 1 : 0;
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.val }}>
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => router.replace('/(auth)/sign-in')}
                style={{
                    width: 75,
                    alignItems: 'center',
                    position: 'absolute',
                    top: 50,
                    right: 25,
                    zIndex: 999,
                    backgroundColor: theme.transparentBtnPrimaryColor.val,
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                    borderRadius: 20
                }}
            >
                <Text style={{
                    color: theme.text.val,
                    fontFamily: 'Poppins-Medium',
                    fontSize: 14
                }}>
                    Skip
                </Text>
            </TouchableOpacity>

            <Swiper
                showsButtons
                buttonWrapperStyle={{ alignItems: 'flex-end' }}
                ref={swiperRef}
                loop={false}
                dot={
                    <View
                        style={[styles.dot, { backgroundColor: '#ddd', width: 10 }]}
                    />
                }
                activeDot={
                    <View
                        style={[styles.dot, { backgroundColor: theme.btnPrimaryColor.val }]}
                    />
                }
                onIndexChanged={handleIndexChanged}
            >
                {onboardingSlides.map((slide, index) => (
                    <View key={slide.id} style={styles.container}>
                        <Animated.View style={[styles.imageContainer, getImageAnimatedStyle(index)]}>
                            <Image
                                source={slide.image}
                                style={styles.image}
                                objectFit="contain"
                            />
                        </Animated.View>
                        <Animated.View style={[
                            {
                                marginTop: 50,
                                justifyContent: 'center',
                                paddingHorizontal: 20
                            },
                            getTextAnimatedStyle(index)
                        ]}>
                            <Text style={[
                                styles.titleText,
                                { color: theme.text.val }
                            ]}>
                                {slide.name}
                            </Text>
                            <Text style={[
                                styles.body,
                                { color: theme.text.val }
                            ]}>
                                {slide.description}
                            </Text>
                        </Animated.View>
                    </View>
                ))}
            </Swiper>

            {activeIndex === onboardingSlides.length - 1 && (
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => router.replace({ pathname: '/(auth)/sign-in' })}
                    style={{
                        position: 'absolute',
                        bottom: 10,
                        right: 15,
                        zIndex: 999,
                        backgroundColor: theme.btnPrimaryColor.val,
                        paddingVertical: 5,
                        paddingHorizontal: 20,
                        borderRadius: 20
                    }}
                >
                    <AntDesign name="check" size={20} />
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

export default Onboarding;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    dot: {
        width: 25,
        height: 10,
        borderRadius: 10,
        marginLeft: 10
    },
    image: {
        width: '100%',
        height: 300
    },
    titleText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20
    },
    body: {
        fontFamily: 'Poppins-Light',
        fontSize: 14,
        textAlign: 'justify'
    },
    imageContainer: {
        width: '100%',
        height: 300,
        justifyContent: 'center',
        alignItems: 'center'
    },
});