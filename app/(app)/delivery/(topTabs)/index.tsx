import React from "react";
import { DeliveryType, fetchDeliveries, fetchPaidPendingDeliveries, getTravelDistance } from "@/api/order";
import HDivider from "@/components/HDivider";
import ItemCard from "@/components/ItemCard";

import { DeliveryDetail } from "@/types/order-types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useCallback, useMemo } from "react";
import { FlatList, ListRenderItem } from "react-native";
import { YStack, useTheme, Separator } from "tamagui";
import * as Location from "expo-location";

import { router } from "expo-router";
import { useAuth } from "@/context/authContext";
import { getCurrentUserProfile, registerForNotifications } from "@/api/user";
import authStorage from "@/storage/authStorage";
import AppTextInput from "@/components/AppInput";
import LocationPermission from "@/components/Locationpermission";
import { useNotification } from "@/components/NotificationProvider"
import { distanceCache } from "@/utils/distance-cache";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import FAB from "@/components/FAB";
import RefreshButton from "@/components/RefreshButton";
import { UserDetails } from "@/types/user-types";
import { DeliveryListSkeleton, SearchBarSkeleton } from "@/components/LoadingSkeleton";

const DeliveryScreen = () => {
  const theme = useTheme();
  const { user, setProfile } = useAuth();
  const { expoPushToken } = useNotification()
  const [searchQuery, setSearchQuery] = useState("");
  const [locationPermission, setLocationPermission] = useState<boolean | null>(
    null
  );
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const storeUserProfile = async (profile: UserDetails) => {
    await authStorage.removeProfile()
    await authStorage.storeProfile(profile)
  }

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


  const registerMutation = useMutation({
    mutationFn: registerForNotifications,
  });

  const { data: userProfile, isSuccess } = useQuery({
    queryKey: ["profile", user?.sub],
    queryFn: () => getCurrentUserProfile(user?.sub as string),
    refetchOnWindowFocus: true,
    enabled: !!user?.sub,
  });


  useEffect(() => {
    if (expoPushToken) {
      // Send the token to server when it exists
      registerMutation.mutate({
        notification_token: expoPushToken,
      });
    }
  }, [expoPushToken]);

  useEffect(() => {
    if (isSuccess && userProfile) {
      // Update state with fresh API data
      setProfile(userProfile);

      // Store the fresh data for offline use
      storeUserProfile(userProfile);
    }
  }, [isSuccess, userProfile, user?.sub]);


  const { data, isLoading, error, refetch, isFetching, isPending, isFetched } = useQuery({
    queryKey: ["deliveries"],
    queryFn: () => fetchPaidPendingDeliveries(),
    refetchOnWindowFocus: true,
    refetchOnMount: true,

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

  // Memoize getItemDistance
  const getItemDistance = useCallback(async (pickupCoords: [number, number]) => {
    if (!userLocation) return null;
    const cachedDistance = distanceCache.get(
      userLocation.latitude,
      userLocation.longitude,
      pickupCoords[0],
      pickupCoords[1]
    );
    if (cachedDistance !== null) {
      return cachedDistance;
    }
    const distance = await getTravelDistance(
      userLocation.latitude,
      userLocation.longitude,
      pickupCoords[0],
      pickupCoords[1]
    );
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
  }, [userLocation]);

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
      // Only update state if changed
      setFilteredData((prev) => {
        const prevIds = prev.map((i) => (i.delivery?.id ?? '') + (typeof (i as any).distance !== 'undefined' ? (i as any).distance : ''));
        const nextIds = filtered.map((i) => (i.delivery?.id ?? '') + (typeof (i as any).distance !== 'undefined' ? (i as any).distance : ''));
        if (
          prev.length === filtered.length &&
          prevIds.every((id, idx) => id === nextIds[idx])
        ) {
          return prev;
        }
        return filtered;
      });
    };
    filterDeliveries();
    return () => {
      isMounted = false;
    };
  }, [data, searchQuery, locationPermission, userLocation, getItemDistance]);

  if (!locationPermission) {
    return <LocationPermission onRetry={checkLocationPermission} />;
  }

  if (isLoading || isFetching || isPending || !isFetched || !data) {
    return (
      <YStack backgroundColor={theme.background} flex={1} padding="$2">
        <SearchBarSkeleton />
        <Separator />
        <DeliveryListSkeleton />
      </YStack>
    );
  }

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
