import React from "react";
import { DeliveryType, fetchDeliveries, getTravelDistance } from "@/api/order";
import HDivider from "@/components/HDivider";
import ItemCard from "@/components/ItemCard";
import LoadingIndicator from "@/components/LoadingIndicator";
import { DeliveryDetail } from "@/types/order-types";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback, useMemo } from "react";
import { FlatList, ListRenderItem } from "react-native";
import { YStack, useTheme, Separator } from "tamagui";
import * as Location from "expo-location";

import { router } from "expo-router";
import { useAuth } from "@/context/authContext";
import { getCurrentUser, getCurrentUserProfile } from "@/api/user";
import authStorage from "@/storage/authStorage";
import AppTextInput from "@/components/AppInput";
import LocationPermission from "@/components/Locationpermission";
import { distanceCache } from "@/utils/distance-cache";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import FAB from "@/components/FAB";
import RefreshButton from "@/components/RefreshButton";

const DeliveryScreen = () => {
  const theme = useTheme();
  const { user, setProfile } = useAuth();
  const [selectedType, setSelectedType] = useState<DeliveryType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationPermission, setLocationPermission] = useState<boolean | null>(
    null
  );
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const getUserProfile = useCallback(async () => {
    if (!user?.sub) return;
    try {
      // const profile = await getCurrentUser(user?.sub);
      const profile = await getCurrentUserProfile()

      if (profile) {
        authStorage.storeProfile(profile);
        setProfile(profile);
      }
    } catch (error) {
      throw Error(`Failed to get user profile: ${error}`);
    }
  }, [user?.sub, setProfile]);

  const checkLocationPermission = useCallback(async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    const isLocationEnabled = await Location.hasServicesEnabledAsync();

    setLocationPermission(status === "granted" && isLocationEnabled);
  }, []);

  useEffect(() => {
    const getUserLocation = async () => {
      if (!locationPermission) return;

      try {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error("Error getting user location:", error);
      }
    };

    getUserLocation();
  }, [locationPermission]);

  useEffect(() => {
    checkLocationPermission();
  }, [checkLocationPermission]);

  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["deliveries"],
    queryFn: () => fetchDeliveries(),
    select: (data) => {
      return (
        data?.filter(
          (order) =>
            order.order.order_payment_status === "paid" &&
            order.delivery?.delivery_status === "pending"
        ) || []
      );
    },

    refetchOnWindowFocus: true,
  });

  // Handle location change
  const handleLocationChange = useCallback(
    (newLocation: { latitude: number; longitude: number }) => {
      setUserLocation(newLocation);
      distanceCache.clear();
    },
    []
  );

  useLocationTracking(handleLocationChange);

  const getItemDistance = async (pickupCoords: [number, number]) => {
    if (!userLocation) return null;

    // Check cache first
    const cachedDistance = distanceCache.get(
      userLocation.latitude,
      userLocation.longitude,
      pickupCoords[0],
      pickupCoords[1]
    );

    if (cachedDistance !== null) {
      return cachedDistance;
    }

    // Calculate new distance
    const distance = await getTravelDistance(
      userLocation.latitude,
      userLocation.longitude,
      pickupCoords[0],
      pickupCoords[1]
    );

    // Cache the result
    if (distance !== null) {
      distanceCache.set(
        userLocation.latitude,
        userLocation.longitude,
        pickupCoords[0],
        pickupCoords[1],
        distance
      );
    }

    return distance;
  };

  // Memoize render functions
  const renderItem: ListRenderItem<DeliveryDetail> = useCallback(
    ({ item }) => <ItemCard data={item} isHomeScreen />,
    []
  );

  const renderSeparator = useCallback(() => <HDivider />, []);

  const keyExtractor = useCallback(
    (item: DeliveryDetail, index: number) =>
      item?.delivery?.id ?? `delivery-${index}`,
    []
  );

  const handleSendItemPress = useCallback(() => {
    router.push("/delivery/sendItem");
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);


  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  // Filter deliveries within 30km
  const [filteredData, setFilteredData] = useState<DeliveryDetail[]>([]);

  useEffect(() => {
    let isMounted = true;

    const filterDeliveries = async () => {
      if (!data || !locationPermission || !userLocation) {
        if (isMounted) setFilteredData([]);
        return;
      }

      const itemsWithinRange = await Promise.all(
        data.map(async (item) => {
          const pickupCoords = item.delivery?.pickup_coordinates;
          if (
            !pickupCoords ||
            pickupCoords[0] === null ||
            pickupCoords[1] === null ||
            typeof pickupCoords[0] !== "number" ||
            typeof pickupCoords[1] !== "number"
          )
            return null;

          const distance = await getItemDistance([
            pickupCoords[0],
            pickupCoords[1],
          ]);
          if (distance === null || distance > 100) return null;

          return {
            ...item,
            distance,
          };
        })
      );

      let filtered = itemsWithinRange.filter(Boolean) as (DeliveryDetail & {
        distance: number;
      })[];

      // Sort by distance (closest first)
      filtered.sort((a, b) => a.distance - b.distance);

      if (searchQuery.trim()) {
        const searchTerm = searchQuery.toLowerCase().trim();
        filtered = filtered.filter((item) => {
          const origin = item?.delivery?.origin?.toLowerCase() || "";
          const destination = item?.delivery?.destination?.toLowerCase() || "";
          return (
            origin.includes(searchTerm) || destination.includes(searchTerm)
          );
        });
      }

      if (isMounted) setFilteredData(filtered);
    };
    filterDeliveries();

    return () => {
      isMounted = false;
    };
  }, [data, searchQuery, locationPermission, userLocation]);

  if (!locationPermission) {
    return <LocationPermission onRetry={checkLocationPermission} />;
  }

  if (isLoading) return <LoadingIndicator />;

  if (error) return <RefreshButton onPress={refetch} label="Error loading deliveries" />

  return (
    <YStack backgroundColor={theme.background} flex={1} padding="$2">
      <AppTextInput
        height={"40"}
        borderRadius={50}
        placeholder="Search"
        onChangeText={handleSearch}
        value={searchQuery}
      />
      <Separator />
      <FlatList
        data={filteredData || []}
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

      {user?.user_type === 'dispatch' || user?.user_type === 'rider' ? '' : <FAB onPress={handleSendItemPress} />}
    </YStack>
  );
};

export default DeliveryScreen;
