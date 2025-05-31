import React from "react";
import { debounce } from 'lodash';
import { DeliveryType, fetchDeliveries } from "@/api/order";
import HDivider from "@/components/HDivider";
import ItemCard from "@/components/ItemCard";
import LoadingIndicator from "@/components/LoadingIndicator";
import { DeliveryDetail } from "@/types/order-types";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback, useMemo } from "react";
import { FlatList, TouchableOpacity, ListRenderItem } from "react-native";
import { YStack, Text, useTheme, Button, Separator } from "tamagui";
import { RefreshCcw, Send } from "lucide-react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/authContext";
import { getCurrentUser } from "@/api/user";
import authStorage from "@/storage/authStorage";
import AppTextInput from "@/components/AppInput";

const DeliveryScreen = () => {
  const theme = useTheme();
  const { user, setProfile } = useAuth();
  const [selectedType, setSelectedType] = useState<DeliveryType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

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
    },

  });

  // Memoize render functions
  const renderItem: ListRenderItem<DeliveryDetail> = useCallback(
    ({ item }) => <ItemCard data={item} isHomeScreen />,
    []
  );

  const renderSeparator = useCallback(() => <HDivider />, []);

  const keyExtractor = useCallback(
    (item: DeliveryDetail, index: number) => item?.delivery?.id ?? `delivery-${index}`,
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
    height: 60,
    width: 60,
    borderRadius: 50,
    backgroundColor: theme.btnPrimaryColor?.val,
    position: "absolute" as const,
    bottom: 10,
    right: 10,
  }), [theme.btnPrimaryColor?.val]);

  // Filter function
  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || !data) return data;

    const searchTerm = searchQuery.toLowerCase().trim();
    return data.filter(item => {
      const origin = item.delivery?.origin?.toLowerCase() || '';
      const destination = item.delivery?.destination?.toLowerCase() || '';

      return origin.includes(searchTerm) || destination.includes(searchTerm);
    });
  }, [data, searchQuery]);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  // const handleSearch = useMemo(
  //   () => debounce((text: string) => {
  //     setSearchQuery(text);
  //   }, 500),
  //   []
  // );

  // useEffect(() => {
  //   return () => {
  //     handleSearch.cancel();
  //   };
  // }, [handleSearch]);

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
      <AppTextInput height={'40'} borderRadius={50} placeholder="Search"

        onChangeText={handleSearch}
        value={searchQuery}
      />
      <Separator />
      <FlatList
        data={filteredData}
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