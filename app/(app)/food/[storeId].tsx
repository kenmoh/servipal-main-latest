// import { Dimensions, StyleSheet, View as NativeView } from "react-native";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   useAnimatedScrollHandler,
//   interpolate,
// } from "react-native-reanimated";
// import { router, useLocalSearchParams } from "expo-router";
// import {
//   Button,
//   Heading,
//   Image,
//   Paragraph,
//   ScrollView,
//   Text,
//   useTheme,
//   View,
//   XStack,
//   YStack,
// } from "tamagui";
// import { AntDesign, Feather } from "@expo/vector-icons";
// import HDivider from "@/components/HDivider";
// import Category from "@/components/Category";
// import FoodCard from "@/components/FoodCard";
// import { Plus } from "lucide-react-native";
// import AddItemBtn from "@/components/AddItemBtn";

// const groups = [
//   { id: 1, name: "Starters" },
//   { id: 2, name: "Main Course" },
//   { id: 3, name: "Desserts" },
//   { id: 4, name: "Others" },
// ];

// const IMAGET_HEIGHT = Dimensions.get("window").height * 0.18;
// const TOP_SECTION_HEIGHT = Dimensions.get("window").height * 0.4;
// const HEADER_HEIGHT = 100;
// const CATEGORY_HEIGHT = 55;

// const StoreDetails = () => {
//   const theme = useTheme();
//   const scrollY = useSharedValue(0);
//   const {
//     companyName,
//     backDrop,
//     openingHour,
//     closingHour,
//     address,
//     rating,
//     reviews,
//   } = useLocalSearchParams();

//   const scrollHandler = useAnimatedScrollHandler({
//     onScroll: (event) => {
//       scrollY.value = event.contentOffset.y;
//     },
//   });

//   const categoryStyle = useAnimatedStyle(() => {
//     const translateY = interpolate(
//       scrollY.value,
//       [0, IMAGET_HEIGHT],
//       [0, -IMAGET_HEIGHT],
//       "clamp",
//     );
//     return {
//       transform: [{ translateY }],
//       position: scrollY.value > TOP_SECTION_HEIGHT ? "absolute" : "relative",
//       top: scrollY.value > TOP_SECTION_HEIGHT ? 0 : undefined,
//       zIndex: scrollY.value > TOP_SECTION_HEIGHT ? 1 : 0,
//     };
//   });
//   // const headerStyle = useAnimatedStyle(() => {
//   //     const opacity = interpolate(
//   //         scrollY.value,
//   //         [1, TOP_SECTION_HEIGHT],
//   //         [0, 1],
//   //         'clamp'
//   //     )
//   //     return {
//   //         opacity
//   //     }
//   // })

//   const headerStyle = useAnimatedStyle(() => {
//     const opacity = interpolate(
//       scrollY.value,
//       [0, TOP_SECTION_HEIGHT],
//       [0, 1],
//       "clamp",
//     );
//     const translateY = interpolate(
//       scrollY.value,
//       [0, TOP_SECTION_HEIGHT],
//       [-HEADER_HEIGHT, 0],
//       "clamp",
//     );
//     return {
//       opacity,
//       transform: [{ translateY }],
//     };
//   });

//   // Top section scale animation
//   const topSectionStyle = useAnimatedStyle(() => {
//     const scale = interpolate(
//       scrollY.value,
//       [0, TOP_SECTION_HEIGHT],
//       [1, 0],
//       "clamp",
//     );
//     return {
//       transform: [{ scale }],
//     };
//   });

//   return (
//     <View flex={1} backgroundColor={"$background"}>
//       {/* HEADER SECTION */}

//       <Animated.View
//         style={[
//           styles.header,
//           {
//             backgroundColor: theme.background.val,
//             width: "100%",
//             zIndex: 1000,
//           },
//           headerStyle,
//         ]}
//       >
//         <Heading
//           color={"$text"}
//           fontSize={18}
//           fontWeight={"bold"}
//           alignSelf="center"
//         >
//           {companyName}
//         </Heading>
//       </Animated.View>

//       <Animated.ScrollView
//         stickyHeaderIndices={[1]}
//         showsVerticalScrollIndicator={false}
//         onScroll={scrollHandler}
//         scrollEventThrottle={16}
//       >
//         {/* TOP SECTION */}

//         <Animated.View
//           style={[
//             {
//               height: TOP_SECTION_HEIGHT,
//               backgroundColor: theme.cardBackground.val,
//             },
//             topSectionStyle,
//           ]}
//         >
//           <View gap={10}>
//             <Image
//               src={require("@/assets/images/Burge.jpg")}
//               height={IMAGET_HEIGHT}
//               objectFit="cover"
//             />

//             <View>
//               <Image
//                 src={require("@/assets/images/Pizza.jpeg")}
//                 height={65}
//                 width={65}
//                 borderRadius={10}
//                 objectFit="cover"
//                 position="absolute"
//                 top={-35}
//                 left={20}
//               />
//             </View>

//             <XStack alignItems="baseline" justifyContent="space-between">
//               <YStack marginTop={"$7"} paddingHorizontal={10}>
//                 <Heading
//                   letterSpacing={0}
//                   color={"$text"}
//                   fontSize={22}
//                   fontWeight={"bold"}
//                 >
//                   {companyName}
//                 </Heading>
//                 <XStack alignItems="center" gap={"$2"}>
//                   <AntDesign name="staro" color={theme.btnPrimaryColor.val} />
//                   <Paragraph
//                     color={"$icon"}
//                     fontFamily={"$body"}
//                     fontSize={"$2"}
//                   >
//                     {rating}
//                   </Paragraph>
//                   <Paragraph
//                     color={"$icon"}
//                     fontFamily={"$body"}
//                     fontSize={"$2"}
//                   >
//                     ( 300 reviews)
//                   </Paragraph>
//                 </XStack>
//                 <XStack alignItems="center" gap={"$2"}>
//                   <Feather name="map-pin" color={theme.icon.val} size={12} />
//                   <Paragraph
//                     color={"$icon"}
//                     fontFamily={"$body"}
//                     fontSize={"$2"}
//                   >
//                     {address}
//                   </Paragraph>
//                 </XStack>
//                 <XStack alignItems="center" gap={"$2"}>
//                   <AntDesign name="clockcircleo" color={theme.icon.val} />
//                   <Paragraph
//                     color={"$icon"}
//                     fontFamily={"$body"}
//                     fontSize={"$2"}
//                   >
//                     {openingHour}
//                   </Paragraph>
//                   <Paragraph
//                     color={"$icon"}
//                     fontFamily={"$body"}
//                     fontSize={"$2"}
//                   >
//                     {closingHour}
//                   </Paragraph>
//                 </XStack>
//               </YStack>
//               <AddItemBtn
//                 onPress={() => router.push({ pathname: "/(app)/food/addMenu" })}
//               />
//             </XStack>
//             <HDivider />
//           </View>
//         </Animated.View>

//         {/* CATEGORY */}
//         <Animated.View
//           style={[
//             {
//               backgroundColor: theme.cardBackground.val,
//               alignItems: "center",
//               justifyContent: "center",
//               height: CATEGORY_HEIGHT,
//             },
//             categoryStyle,
//           ]}
//         >
//           <Category categories={groups} />
//         </Animated.View>

//         <YStack>
//           <FoodCard />
//           <FoodCard />
//           <FoodCard />
//           <FoodCard />
//           <FoodCard />
//           <FoodCard />
//           <FoodCard />
//         </YStack>
//       </Animated.ScrollView>
//     </View>
//   );
// };

// export default StoreDetails;

// const styles = StyleSheet.create({
//   header: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     height: HEADER_HEIGHT,
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//     elevation: 1000,
//   },
// });

import { Dimensions, StyleSheet, View as NativeView } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";
import {
  Button,
  Heading,
  Image,
  Paragraph,
  ScrollView,
  Text,
  useTheme,
  View,
  XStack,
  YStack,
} from "tamagui";
import { AntDesign, Feather } from "@expo/vector-icons";
import HDivider from "@/components/HDivider";
import Category from "@/components/Category";
import FoodCard from "@/components/FoodCard";
import { Plus } from "lucide-react-native";
import AddItemBtn from "@/components/AddItemBtn";
import { useState } from "react";

const groups = [
  { id: 1, name: "Starters" },
  { id: 2, name: "Main Course" },
  { id: 3, name: "Desserts" },
  { id: 4, name: "Others" },
];

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.25;
const TOP_SECTION_HEIGHT = SCREEN_HEIGHT * 0.45;
const HEADER_HEIGHT = 90;
const CATEGORY_HEIGHT = 60;
const PARALLAX_FACTOR = 0.5;

const StoreDetails = () => {
  const theme = useTheme();
  const scrollY = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  const {
    companyName,
    backDrop,
    openingHour,
    closingHour,
    address,
    rating,
    reviews,
  } = useLocalSearchParams();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;

      // Smooth header visibility toggle
      const shouldShowHeader =
        event.contentOffset.y > TOP_SECTION_HEIGHT - HEADER_HEIGHT;
      if (shouldShowHeader !== isHeaderVisible) {
        runOnJS(setIsHeaderVisible)(shouldShowHeader);
      }
    },
  });

  // Modern header animation with slide-in effect
  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [
        TOP_SECTION_HEIGHT - HEADER_HEIGHT - 50,
        TOP_SECTION_HEIGHT - HEADER_HEIGHT,
      ],
      [0, 1],
      Extrapolation.CLAMP,
    );

    const translateY = interpolate(
      scrollY.value,
      [
        TOP_SECTION_HEIGHT - HEADER_HEIGHT - 30,
        TOP_SECTION_HEIGHT - HEADER_HEIGHT,
      ],
      [-20, 0],
      Extrapolation.CLAMP,
    );

    return {
      opacity: withTiming(opacity, { duration: 200 }),
      transform: [{ translateY: withTiming(translateY, { duration: 300 }) }],
    };
  });

  // Sticky category with smooth transition
  const categoryStyle = useAnimatedStyle(() => {
    const isSticky = scrollY.value > TOP_SECTION_HEIGHT - HEADER_HEIGHT;

    return {
      position: isSticky ? "absolute" : "relative",
      top: isSticky ? HEADER_HEIGHT : 0,
      left: 0,
      right: 0,
      zIndex: isSticky ? 999 : 1,
      elevation: isSticky ? 8 : 0,
      shadowOpacity: withTiming(isSticky ? 0.1 : 0, { duration: 200 }),
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
    };
  });

  // Parallax effect for background image
  const imageStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, IMAGE_HEIGHT],
      [0, -scrollY.value * PARALLAX_FACTOR],
      Extrapolation.EXTEND,
    );

    const scale = interpolate(
      scrollY.value,
      [-100, 0],
      [1.2, 1],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  // Smooth fade-out for top section content
  const topContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, TOP_SECTION_HEIGHT * 0.3],
      [1, 0],
      Extrapolation.CLAMP,
    );

    const translateY = interpolate(
      scrollY.value,
      [0, TOP_SECTION_HEIGHT * 0.3],
      [0, -20],
      Extrapolation.CLAMP,
    );

    return {
      opacity: withTiming(opacity, { duration: 150 }),
      transform: [{ translateY: withTiming(translateY, { duration: 200 }) }],
    };
  });

  // Logo scale animation
  const logoStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.8],
      Extrapolation.CLAMP,
    );

    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, 10],
      Extrapolation.CLAMP,
    );

    return {
      transform: [
        { scale: withTiming(scale, { duration: 200 }) },
        { translateY: withTiming(translateY, { duration: 200 }) },
      ],
    };
  });

  return (
    <View flex={1} backgroundColor={"$background"}>
      {/* MODERN HEADER WITH BACKDROP BLUR EFFECT */}
      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: theme.background.val + "F5", // Semi-transparent
            backdropFilter: "blur(20px)",
          },
          headerStyle,
        ]}
      >
        <XStack
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal={20}
        >
          <Heading
            color={"$text"}
            fontSize={18}
            fontWeight={"700"}
            letterSpacing={-0.5}
          >
            {companyName}
          </Heading>
          {/* Optional: Add share/favorite buttons */}
        </XStack>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        bounces={true}
      >
        {/* TOP SECTION WITH PARALLAX */}
        <View style={{ height: TOP_SECTION_HEIGHT }}>
          {/* Background Image with Parallax */}
          <Animated.View style={[{ height: IMAGE_HEIGHT }, imageStyle]}>
            <Image
              src={require("@/assets/images/Burge.jpg")}
              height={IMAGE_HEIGHT + 100} // Extra height for parallax
              width={SCREEN_WIDTH}
              objectFit="cover"
            />
            {/* Gradient overlay */}
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 80,
                backgroundColor: `linear-gradient(transparent, ${theme.cardBackground.val})`,
              }}
            />
          </Animated.View>

          {/* Content Section */}
          <View
            style={{
              backgroundColor: theme.cardBackground.val,
              flex: 1,
              paddingTop: 10,
            }}
          >
            {/* Restaurant Logo */}
            <Animated.View style={[logoStyle]}>
              <Image
                src={require("@/assets/images/Pizza.jpeg")}
                height={75}
                width={75}
                borderRadius={15}
                objectFit="cover"
                position="absolute"
                top={-45}
                left={20}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              />
            </Animated.View>

            <Animated.View style={[topContentStyle]}>
              <XStack
                alignItems="baseline"
                justifyContent="space-between"
                paddingTop={20}
              >
                <YStack marginTop={"$4"} paddingHorizontal={20} flex={1}>
                  <Heading
                    letterSpacing={-0.8}
                    color={"$text"}
                    fontSize={26}
                    fontWeight={"800"}
                    marginBottom={8}
                  >
                    {companyName}
                  </Heading>

                  <XStack alignItems="center" gap={"$2"} marginBottom={6}>
                    <AntDesign
                      name="star"
                      color={theme.btnPrimaryColor.val}
                      size={16}
                    />
                    <Paragraph
                      color={"$text"}
                      fontFamily={"$body"}
                      fontSize={"$3"}
                      fontWeight={"600"}
                    >
                      {rating}
                    </Paragraph>
                    <Paragraph
                      color={"$icon"}
                      fontFamily={"$body"}
                      fontSize={"$3"}
                    >
                      (300+ reviews)
                    </Paragraph>
                  </XStack>

                  <XStack alignItems="center" gap={"$2"} marginBottom={4}>
                    <Feather name="map-pin" color={theme.icon.val} size={14} />
                    <Paragraph
                      color={"$icon"}
                      fontFamily={"$body"}
                      fontSize={"$3"}
                      flex={1}
                    >
                      {address}
                    </Paragraph>
                  </XStack>

                  <XStack alignItems="center" gap={"$2"}>
                    <AntDesign
                      name="clockcircleo"
                      color={theme.icon.val}
                      size={14}
                    />
                    <Paragraph
                      color={theme.green10?.val || theme.btnPrimaryColor.val}
                      fontFamily={"$body"}
                      fontSize={"$3"}
                      fontWeight={"500"}
                    >
                      Open • {openingHour} - {closingHour}
                    </Paragraph>
                  </XStack>
                </YStack>

                <AddItemBtn
                  onPress={() =>
                    router.push({ pathname: "/(app)/food/addMenu" })
                  }
                />
              </XStack>

              <View paddingHorizontal={20} paddingTop={20}>
                <HDivider />
              </View>
            </Animated.View>
          </View>
        </View>

        {/* STICKY CATEGORY SECTION */}
        <Animated.View
          style={[
            {
              backgroundColor: theme.cardBackground.val,
              height: CATEGORY_HEIGHT,
              justifyContent: "center",
              borderBottomWidth: 1,
              borderBottomColor: theme.borderColor?.val || theme.gray4?.val,
            },
            categoryStyle,
          ]}
        >
          <Category categories={groups} />
        </Animated.View>

        {/* CONTENT SECTION */}
        <YStack backgroundColor={"$background"} paddingTop={10}>
          <FoodCard />
          <FoodCard />
          <FoodCard />
          <FoodCard />
          <FoodCard />
          <FoodCard />
          <FoodCard />
          {/* Add extra padding for the last item */}
          <View height={100} />
        </YStack>
      </Animated.ScrollView>
    </View>
  );
};

export default StoreDetails;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    justifyContent: "center",
    zIndex: 1000,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
