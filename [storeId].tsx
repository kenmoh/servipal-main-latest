// import { Dimensions, StyleSheet, Image, FlatList } from "react-native";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   useAnimatedScrollHandler,
//   interpolate,
//   runOnJS,
// } from "react-native-reanimated";
// import { router, useLocalSearchParams } from "expo-router";
// import {
//   Heading,
//   Paragraph,
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
// import AddItemBtn from "@/components/AddItemBtn";
// import CartInfoBtn from "@/components/CartInfoBtn";

// import { useAuth } from "@/context/authContext";
// import { useCallback, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { fetchVendorItems } from "@/api/item";
// import { MenuItem } from "@/types/item-types";
// import { useCartStore } from "@/store/cartStore";
// import { Plus } from "lucide-react-native";

// const groups = [
//   { id: '1', name: "Starters", category_type: 'food' },
//   { id: '2', name: "Main Course", category_type: 'food' },
//   { id: '3', name: "Desserts", category_type: 'food' },
//   { id: '4', name: "Others", category_type: 'food' },
// ];

// const IMAGET_HEIGHT = Dimensions.get("window").height * 0.18;
// const TOP_SECTION_HEIGHT = Dimensions.get("window").height * 0.4;
// const HEADER_HEIGHT = 100;
// const CATEGORY_HEIGHT = 55;

// const StoreDetails = () => {
//   const theme = useTheme();
//   const { user } = useAuth();
//   const {
//     backDrop,
//     storeId,
//     companyName,
//     openingHour,
//     closingHour,
//     address,
//     rating,
//     reviews,
//     screenType
//   } = useLocalSearchParams();

//   const scrollY = useSharedValue(0);
//   const [showStickyCategory, setShowStickyCategory] = useState(false);
//   const { cart, addItem, totalCost, removeItem } = useCartStore();
//   const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

//   const { data } = useQuery({
//     queryKey: ["storeItems", storeId],
//     queryFn: () => fetchVendorItems(storeId as string),
//   });


//   const handleAddToCart = useCallback((item: MenuItem) => {
//     setCheckedItems(prev => {
//       const newChecked = new Set(prev);
//       if (newChecked.has(item.id)) {
//         newChecked.delete(item.id);
//         removeItem(item.id);
//       } else {
//         newChecked.add(item.id);
//         addItem(
//           storeId as string,
//           item.id,
//           1,
//           {
//             name: item.name,
//             price: Number(item.price),
//             image: item.images[0]?.url || ''
//           }
//         );
//       }
//       return newChecked;
//     });
//   }, [addItem, removeItem]);

//   const scrollHandler = useAnimatedScrollHandler({
//     onScroll: (event) => {
//       scrollY.value = event.contentOffset.y;
//       runOnJS(setShowStickyCategory)(
//         event.contentOffset.y > TOP_SECTION_HEIGHT
//       );
//     },
//   });

//   const categoryStyle = useAnimatedStyle(() => {
//     const translateY = interpolate(
//       scrollY.value,
//       [0, IMAGET_HEIGHT],
//       [0, -IMAGET_HEIGHT],
//       "clamp"
//     );
//     return {
//       transform: [{ translateY }],
//       position: scrollY.value > TOP_SECTION_HEIGHT ? "absolute" : "relative",
//       top: scrollY.value > TOP_SECTION_HEIGHT ? HEADER_HEIGHT + 10 : undefined,
//       zIndex: scrollY.value > TOP_SECTION_HEIGHT ? 1 : 0,
//       width: "100%",
//     };
//   });

//   const headerStyle = useAnimatedStyle(() => {
//     const opacity = interpolate(
//       scrollY.value,
//       [0, TOP_SECTION_HEIGHT],
//       [0, 1],
//       "clamp"
//     );
//     const translateY = interpolate(
//       scrollY.value,
//       [0, TOP_SECTION_HEIGHT],
//       [-HEADER_HEIGHT, 0],
//       "clamp"
//     );
//     return {
//       opacity,
//       transform: [{ translateY }],
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
//           marginTop={30}
//         >
//           {companyName}
//         </Heading>
//       </Animated.View>
//       {screenType === 'RESTAURANT' && showStickyCategory && (
//         <View
//           style={{
//             position: "absolute",
//             top: HEADER_HEIGHT,
//             left: 0,
//             right: 0,
//             zIndex: 999,
//             backgroundColor: theme.backgroundDark.val,
//             height: CATEGORY_HEIGHT,
//             justifyContent: "center",
//             alignItems: "center",
//             width: "100%",
//           }}
//         >
//           {/* <Category categories={groups} /> */}
//         </View>
//       )}

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
//           ]}
//         >
//           <View gap={10}>
//             <Image
//               source={{ uri: backDrop || require("@/assets/images/Burge.jpg") }}
//               height={IMAGET_HEIGHT}
//               style={{
//                 objectFit: "cover",
//               }}
//             />

//             <View>
//               <Image
//                 source={{
//                   uri: backDrop || require("@/assets/images/Pizza.jpeg"),
//                 }}
//                 height={65}
//                 width={65}
//                 borderRadius={10}
//                 style={{
//                   objectFit: "cover",
//                   position: "absolute",
//                   top: -35,
//                   left: 20,
//                 }}
//               />
//             </View>

//             <XStack alignItems="baseline" justifyContent="space-between">
//               <YStack flex={1} marginTop={"$7"} paddingHorizontal={10}>
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
//                     flexShrink={1}
//                   // alignSelf={'flex-shrink'}
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
//                     {openingHour} {'-'}
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
//                 label="Add Item"
//                 icon={<Plus color={theme.btnPrimaryColor.val} size={20} />}
//                 isDisabled={
//                   user?.user_type !== "vendor" && (data && user?.sub !== data[0]?.user_id)
//                 }
//                 onPress={() =>
//                   router.push({ pathname: "/store-detail/addMenu" })
//                 }
//               />
//             </XStack>
//             <HDivider />
//           </View>
//         </Animated.View>

//         {/* CATEGORY */}
//         {screenType === 'RESTAURANT' &&
//           <Animated.View
//             style={[
//               {
//                 backgroundColor: theme.cardBackground.val,
//                 alignItems: "center",
//                 justifyContent: "center",
//                 height: CATEGORY_HEIGHT,
//                 marginTop: 10,
//               },
//               categoryStyle,
//             ]}
//           >
//             {/* <Category categories={groups} /> */}
//           </Animated.View>
//         }

//         {/* RENDER SECTION */}



//         <YStack flex={1}>
//           <FlatList
//             data={data ?? []}
//             keyExtractor={(item) => item?.id}
//             renderItem={({ item }: { item: MenuItem }) => (
//               <FoodCard item={item} screenType={screenType as "RESTAURANT" | "LAUNDRY"} onPress={() => handleAddToCart(item)} />
//             )}
//             scrollEnabled={false}
//             removeClippedSubviews={true}
//             maxToRenderPerBatch={10}
//             updateCellsBatchingPeriod={50}
//             initialNumToRender={10}
//             windowSize={10}
//           // refreshing={isFetching}
//           // onRefresh={handleRefresh}
//           />
//         </YStack>
//       </Animated.ScrollView>
//       <CartInfoBtn
//         label="View Cart"
//         totalCost={totalCost?.toString()!}
//         totalItem={cart.order_items.length}
//         onPress={() => router.push({ pathname: "/cart" })}
//       />
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


import { Dimensions, StyleSheet, Image, FlatList } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";
import {
  Heading,
  Paragraph,
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
import AddItemBtn from "@/components/AddItemBtn";
import CartInfoBtn from "@/components/CartInfoBtn";

import { useAuth } from "@/context/authContext";
import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchVendorItems } from "@/api/item";
import { MenuItem } from "@/types/item-types";
import { useCartStore } from "@/store/cartStore";
import { Plus } from "lucide-react-native";

const groups = [
  { id: '1', name: "Starters", category_type: 'food' },
  { id: '2', name: "Main Course", category_type: 'food' },
  { id: '3', name: "Desserts", category_type: 'food' },
  { id: '4', name: "Others", category_type: 'food' },
];

const IMAGET_HEIGHT = Dimensions.get("window").height * 0.18;
const TOP_SECTION_HEIGHT = Dimensions.get("window").height * 0.4;
const HEADER_HEIGHT = 100;
const CATEGORY_HEIGHT = 55;

const StoreDetails = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const {
    backDrop,
    storeId,
    companyName,
    openingHour,
    closingHour,
    address,
    rating,
    reviews,
    screenType
  } = useLocalSearchParams();

  const scrollY = useSharedValue(0);
  const [showStickyCategory, setShowStickyCategory] = useState(false);
  const { cart, addItem, totalCost, removeItem } = useCartStore();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const { data } = useQuery({
    queryKey: ["storeItems", storeId],
    queryFn: () => fetchVendorItems(storeId as string),
  });


  const handleAddToCart = useCallback((item: MenuItem) => {
    setCheckedItems(prev => {
      const newChecked = new Set(prev);
      if (newChecked.has(item.id)) {
        newChecked.delete(item.id);
        removeItem(item.id);
      } else {
        newChecked.add(item.id);
        addItem(
          storeId as string,
          item.id,
          1,
          {
            name: item.name,
            price: Number(item.price),
            image: item.images[0]?.url || ''
          }
        );
      }
      return newChecked;
    });
  }, [addItem, removeItem]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      runOnJS(setShowStickyCategory)(
        event.contentOffset.y > TOP_SECTION_HEIGHT
      );
    },
  });

  const categoryStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, IMAGET_HEIGHT],
      [0, -IMAGET_HEIGHT],
      "clamp"
    );
    return {
      transform: [{ translateY }],
      position: scrollY.value > TOP_SECTION_HEIGHT ? "absolute" : "relative",
      top: scrollY.value > TOP_SECTION_HEIGHT ? HEADER_HEIGHT + 10 : undefined,
      zIndex: scrollY.value > TOP_SECTION_HEIGHT ? 1 : 0,
      width: "100%",
    };
  });

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, TOP_SECTION_HEIGHT],
      [0, 1],
      "clamp"
    );
    const translateY = interpolate(
      scrollY.value,
      [0, TOP_SECTION_HEIGHT],
      [-HEADER_HEIGHT, 0],
      "clamp"
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <View flex={1} backgroundColor={"$background"}>
      {/* HEADER SECTION */}

      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: theme.background.val,
            width: "100%",
            zIndex: 1000,
          },
          headerStyle,
        ]}
      >
        <Heading
          color={"$text"}
          fontSize={18}
          fontWeight={"bold"}
          alignSelf="center"
          marginTop={30}
        >
          {companyName}
        </Heading>
      </Animated.View>
      <View
        style={[
          {
            height: TOP_SECTION_HEIGHT,
            backgroundColor: theme.cardBackground.val,
          },
        ]}
      >
        <View gap={10}>
          <Image
            source={{ uri: backDrop || require("@/assets/images/Burge.jpg") }}
            height={IMAGET_HEIGHT}
            style={{
              objectFit: "cover",
            }}
          />

          <View>
            <Image
              source={{
                uri: backDrop || require("@/assets/images/Pizza.jpeg"),
              }}
              height={65}
              width={65}
              borderRadius={10}
              style={{
                objectFit: "cover",
                position: "absolute",
                top: -35,
                left: 20,
              }}
            />
          </View>

          <XStack alignItems="baseline" justifyContent="space-between">
            <YStack flex={1} marginTop={"$7"} paddingHorizontal={10}>
              <Heading
                letterSpacing={0}
                color={"$text"}
                fontSize={22}
                fontWeight={"bold"}
              >
                {companyName} Kenneth
              </Heading>
              <XStack alignItems="center" gap={"$2"}>
                <AntDesign name="staro" color={theme.btnPrimaryColor.val} />
                <Paragraph
                  color={"$icon"}
                  fontFamily={"$body"}
                  fontSize={"$2"}
                >
                  {rating}
                </Paragraph>
                <Paragraph
                  color={"$icon"}
                  fontFamily={"$body"}
                  fontSize={"$2"}
                >
                  ( 300 reviews)
                </Paragraph>
              </XStack>
              <XStack alignItems="center" gap={"$2"}>
                <Feather name="map-pin" color={theme.icon.val} size={12} />
                <Paragraph
                  color={"$icon"}
                  fontFamily={"$body"}
                  fontSize={"$2"}
                  flexShrink={1}
                // alignSelf={'flex-shrink'}
                >
                  {address}
                </Paragraph>
              </XStack>
              <XStack alignItems="center" gap={"$2"}>
                <AntDesign name="clockcircleo" color={theme.icon.val} />
                <Paragraph
                  color={"$icon"}
                  fontFamily={"$body"}
                  fontSize={"$2"}
                >
                  {openingHour} {'-'}
                </Paragraph>
                <Paragraph
                  color={"$icon"}
                  fontFamily={"$body"}
                  fontSize={"$2"}
                >
                  {closingHour}
                </Paragraph>
              </XStack>
            </YStack>

            <AddItemBtn
              label="Add Item"
              icon={<Plus color={theme.btnPrimaryColor.val} size={20} />}
              isDisabled={
                user?.user_type !== "vendor" && (data && user?.sub !== data[0]?.user_id)
              }
              onPress={() =>
                router.push({ pathname: "/store-detail/addMenu" })
              }
            />
          </XStack>
          <HDivider />
        </View>
      </View>
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
    alignItems: "center",
    zIndex: 1000,
    elevation: 1000,
  },
});
