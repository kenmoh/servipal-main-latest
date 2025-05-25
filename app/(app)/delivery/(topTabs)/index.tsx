// import { DeliveryType, fetchDeliveries } from "@/api/order";
// import HDivider from "@/components/HDivider";
// import ItemCard from "@/components/ItemCard";
// import LoadingIndicator from "@/components/LoadingIndicator";
// import { DeliveryDetail } from "@/types/order-types";
// import { useQuery } from "@tanstack/react-query";
// import { useState, useEffect } from "react";
// import { FlatList, TouchableOpacity } from "react-native";
// import { YStack, Text, useTheme, Button } from "tamagui";
// import { RefreshCcw, Send } from "lucide-react-native";
// import { router } from "expo-router";
// import { useAuth } from "@/context/authContext";
// import { getCurrentUser } from "@/api/user";
// import authStorage from "@/storage/authStorage";


// const DeliveryScreen = () => {
//   const theme = useTheme();
//   const { user, setProfile, } = useAuth();
//   const [selectedType, setSelectedType] = useState<DeliveryType | "all">("all");

//   const getUserProfile = async () => {
//     const profile = await getCurrentUser(user?.sub!)
//     if (profile) {
//       authStorage.storeProfile(profile)
//       setProfile(profile)
//     }
//   }

//   useEffect(() => {
//     getUserProfile()
//   }, [])

//   const { data, isLoading, error, refetch, isFetching } = useQuery({
//     queryKey: ["deliveries", selectedType],
//     queryFn: () =>
//       fetchDeliveries({
//         deliveryType: selectedType === "all" ? undefined : selectedType,
//       }),
//     // select: (data) => {
//     //     return data?.filter(order => order.order.order_payment_status === 'paid') || []
//     // }
//   });

//   if (isLoading) return <LoadingIndicator />;
//   if (error) {
//     return (
//       <YStack
//         flex={1}
//         backgroundColor={theme.background}
//         alignItems="center"
//         justifyContent="center"
//         gap="$4"
//       >
//         <Text color="$red10" fontSize={16}>
//           Error loading deliveries
//         </Text>
//         <Button
//           borderRadius={50}
//           backgroundColor="$btnPrimaryColor"
//           color="$text"
//           size="$4"
//           onPress={() => refetch()}
//           pressStyle={{ opacity: 0.8 }}
//         >
//           <RefreshCcw color={theme.text.val} size={20} />
//           Try Again
//         </Button>
//       </YStack>
//     );
//   }

//   return (
//     <YStack backgroundColor={theme.background} flex={1} padding="$2">
//       <HDivider width="100%" />

//       <FlatList
//         data={data}
//         keyExtractor={(item: DeliveryDetail) => item.delivery.id}
//         renderItem={({ item }) => <ItemCard data={item} isHomeScreen />}
//         ItemSeparatorComponent={() => <HDivider />}
//         refreshing={isFetching}
//         onRefresh={refetch}
//       />
//       <TouchableOpacity
//         onPress={() => router.push("/delivery/sendItem")}
//         style={{
//           alignItems: "center",
//           justifyContent: "center",
//           height: 65,
//           width: 65,
//           borderRadius: 50,
//           backgroundColor: theme.btnPrimaryColor?.val,
//           position: "absolute",
//           bottom: 10,
//           right: 10,
//         }}
//       >
//         <Send color={theme.text?.val} size={25} />
//       </TouchableOpacity>
//     </YStack>
//   );
// };

// export default DeliveryScreen;



import React from "react";
import { DeliveryType, fetchDeliveries } from "@/api/order";
import HDivider from "@/components/HDivider";
import ItemCard from "@/components/ItemCard";
import LoadingIndicator from "@/components/LoadingIndicator";
import { DeliveryDetail } from "@/types/order-types";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback, useMemo } from "react";
import { FlatList, TouchableOpacity, ListRenderItem } from "react-native";
import { YStack, Text, useTheme, Button } from "tamagui";
import { RefreshCcw, Send } from "lucide-react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/authContext";
import { getCurrentUser } from "@/api/user";
import authStorage from "@/storage/authStorage";

const DeliveryScreen = () => {
  const theme = useTheme();
  const { user, setProfile } = useAuth();
  const [selectedType, setSelectedType] = useState<DeliveryType | "all">("all");

  const getUserProfile = useCallback(async () => {
    if (!user?.sub) return;
    try {
      const profile = await getCurrentUser(user.sub);
      if (profile) {
        authStorage.storeProfile(profile);
        setProfile(profile);
      }
    } catch (error) {
      console.error('Failed to get user profile:', error);
    }
  }, [user?.sub, setProfile]);

  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["deliveries", selectedType],
    queryFn: () =>
      fetchDeliveries({
        deliveryType: selectedType === "all" ? undefined : selectedType,
      }),
      select: (data) => {
       return data?.filter(order => order.order.order_payment_status === 'paid') || []
     }
  });

  // Memoize render functions
  const renderItem: ListRenderItem<DeliveryDetail> = useCallback(
    ({ item }) => <ItemCard data={item} isHomeScreen />,
    []
  );

  const renderSeparator = useCallback(() => <HDivider />, []);

  const keyExtractor = useCallback(
    (item: DeliveryDetail) => item.delivery.id,
    []
  );

  const handleSendItemPress = useCallback(() => {
    router.push("/delivery/sendItem");
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Memoize button style
  const fabStyle = useMemo(() => ({
    alignItems: "center" as const,
    justifyContent: "center" as const,
    height: 65,
    width: 65,
    borderRadius: 50,
    backgroundColor: theme.btnPrimaryColor?.val,
    position: "absolute" as const,
    bottom: 10,
    right: 10,
  }), [theme.btnPrimaryColor?.val]);

  if (isLoading) return <LoadingIndicator />;

  if (error) {
    return (
      <YStack
        flex={1}
        backgroundColor={theme.background}
        alignItems="center"
        justifyContent="center"
        gap="$4"
      >
        <Text color="$red10" fontSize={16}>
          Error loading deliveries
        </Text>
        <Button
          borderRadius={50}
          backgroundColor="$btnPrimaryColor"
          color="$text"
          size="$4"
          onPress={handleRefresh}
          pressStyle={{ opacity: 0.8 }}
        >
          <RefreshCcw color={theme.text.val} size={20} />
          Try Again
        </Button>
      </YStack>
    );
  }

  return (
    <YStack backgroundColor={theme.background} flex={1} padding="$2">
      <HDivider width="100%" />
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        refreshing={isFetching}
        onRefresh={handleRefresh}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
      />
      <TouchableOpacity onPress={handleSendItemPress} style={fabStyle}>
        <Send color={theme.text?.val} size={25} />
      </TouchableOpacity>
    </YStack>
  );
};

export default DeliveryScreen;