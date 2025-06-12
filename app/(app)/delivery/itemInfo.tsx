import { StyleSheet, ActivityIndicator } from "react-native";

import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Button,
  XStack,
  YStack,
  Text,
  useTheme,
  Separator,
  Square,
} from "tamagui";
import { z } from "zod";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import AppTextInput from "@/components/AppInput";
import ImagePickerInput from "@/components/AppImagePicker";
import { useLocationStore } from "@/store/locationStore";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Clock } from "lucide-react-native";
import { sendItem } from "@/api/order";
import { router } from "expo-router";
import { ImageType } from "@/types/order-types";

const coordinatesSchema = z.tuple([
  z.number({ message: "Required" }).nullable(),
  z.number({ message: "Required" }).nullable(),
]);

const imageSchema = z
  .object({
    name: z.string(),
    type: z.string(),
    url: z.string(),
  })
  .transform(
    (data): ImageType => ({
      name: data.name,
      type: data.type,
      url: data.url,
    })
  );

export const sendItemSchema = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
  description: z.string().nonempty({ message: "Description is required" }),
  origin: z.string().nonempty({ message: "Origin is required" }),
  destination: z.string().nonempty({ message: "Destination is required" }),
  duration: z.string().nonempty({ message: "Duration is required" }),
  pickup_coordinates: coordinatesSchema,
  dropoff_coordinates: coordinatesSchema,
  distance: z.number({ message: "Distance is required" }),
  imageUrl: z.string().nonempty({ message: "Image is required" }),
});

type FormData = z.infer<typeof sendItemSchema>;

const ItemInfo = () => {
  // Get location data from Zustand store
  const { origin, originCoords, reset, destination, destinationCoords } =
    useLocationStore();

  const theme = useTheme();
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState(0);

  // Initialize form with empty values
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(sendItemSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      origin: "",
      destination: "",
      distance: 0,
      duration: "",
      pickup_coordinates: [null, null],
      dropoff_coordinates: [null, null],
    },
  });

  // State to track form values for non-editable fields
  const [formValues, setFormValues] = useState({
    origin: "",
    destination: "",
    pickup_coordinates: [null, null] as [number | null, number | null],
    dropoff_coordinates: [null, null] as [number | null, number | null],
    distance: 0,
    duration: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: sendItem,
    onSuccess: (data) => {
      Notifier.showNotification({
        title: "Pending Payment Confirmation",
        description:
          "Delivery order create. Your order will be listed for delivery when your payment is confirmed",
        Component: NotifierComponents.Alert,
        duration: 1000,
        componentProps: {
          alertType: "info",
        },
      });
      reset();
      router.push({
        pathname: '/payment/[orderId]',
        params: {
          orderId: data?.order.id ?? "",
          deliveryFee: data?.delivery?.delivery_fee,
          orderNumber: data?.order?.order_number,
          deliveryType: data?.delivery?.delivery_type,
          orderItems: JSON.stringify(data?.order.order_items ?? []),
          paymentLink: data?.order.payment_link,
        },
      });
      return;
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      Notifier.showNotification({
        title: "Error",
        description: `${errorMessage}`,
        Component: NotifierComponents.Alert,
        componentProps: {
          alertType: "error",
        },
      });
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data);

  };

  // Update form from Zustand state
  useEffect(() => {
    // Only update if the values exist and are different from current values
    if (origin) {
      setValue("origin", origin);
      setFormValues((prev) => ({ ...prev, origin }));
    }

    if (destination) {
      setValue("destination", destination);
      setFormValues((prev) => ({ ...prev, destination }));
    }

    if (originCoords && originCoords.length === 2) {
      setValue(
        "pickup_coordinates",
        originCoords as [number | null, number | null]
      );
      setFormValues((prev) => ({
        ...prev,
        pickup_coordinates: originCoords as [number | null, number | null],
      }));
    }

    if (destinationCoords && destinationCoords.length === 2) {
      setValue(
        "dropoff_coordinates",
        destinationCoords as [number | null, number | null]
      );
      setFormValues((prev) => ({
        ...prev,
        dropoff_coordinates: destinationCoords as [
          number | null,
          number | null
        ],
      }));
    }
  }, [origin, destination, originCoords, destinationCoords, setValue]);

  // Fetch distance and duration when origin or destination changes
  useEffect(() => {
    const fetchAndUseTravelInfo = async () => {
      // Only proceed if we have both origin and destination
      if (!formValues.origin || !formValues.destination) {
        return;
      }

      const originQuery = encodeURIComponent(formValues.origin);
      const destinationQuery = encodeURIComponent(formValues.destination);

      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destinationQuery}&origins=${originQuery}&units=metric&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        const distanceText = data?.rows?.[0]?.elements?.[0]?.distance?.text;
        const durationText = data?.rows?.[0]?.elements?.[0]?.duration?.text;

        if (distanceText && durationText) {
          const distanceValue = parseFloat(
            distanceText.replace(/[^0-9.]/g, "")
          );

          setValue("distance", distanceValue);
          setValue("duration", durationText);
          setDistance(distanceValue);
          setDuration(durationText);

          setFormValues((prev) => ({
            ...prev,
            distance: distanceValue,
            duration: durationText,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch distance matrix:", error);
      }
    };

    fetchAndUseTravelInfo();
  }, [formValues.origin, formValues.destination]);

  // Format coordinates for display
  const formatCoords = (
    coords: [number | null, number | null] | undefined
  ): string => {
    if (!coords || !Array.isArray(coords)) return "";

    // Filter out null values and join with comma
    const validCoords = coords.filter((c) => c !== null);
    return validCoords.length === 2 ? validCoords.join(", ") : "";
  };

  return (
    <ScrollView
      backgroundColor={"$background"}
      flex={1}
      showsVerticalScrollIndicator={false}
    >
      <YStack paddingLeft={20} gap={5}>
        <XStack alignItems="center" gap={10}>
          <Square size={10} borderRadius={3} backgroundColor={"$gray10"} />
          <Text color={"$text"} fontSize={12}>
            {origin}{" "}
          </Text>
        </XStack>
        <Separator vertical borderWidth={1} height={20} marginLeft={4} />
        <XStack alignItems="center" gap={10}>
          <Feather name="map-pin" color={theme.icon.val} size={10} />
          <Text color={"$text"} fontSize={12}>
            {destination}{" "}
          </Text>
        </XStack>
        <XStack alignItems="center" gap={10}>
          <XStack alignItems="center" justifyContent="center" gap={5}>
            <MaterialCommunityIcons
              name="road-variant"
              size={10}
              color={theme.icon.val}
            />
            <Text color={theme.icon.val} fontSize={12}>
              {distance} km
            </Text>
          </XStack>
          <XStack alignItems="center" justifyContent="center" gap={5}>
            <Clock color={theme.icon.val} size={10} />

            <Text color={theme.icon.val} fontSize={12}>
              {" "}
              {duration}{" "}
            </Text>
          </XStack>
        </XStack>
      </YStack>
      <View marginTop={"$5"}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              placeholder="Name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.name?.message}
            />
          )}
        />

        <YStack style={{ display: "none" }}>
          <Controller
            control={control}
            name="origin"
            render={({ field }) => (
              <AppTextInput
                placeholder="Pickup Location"
                onBlur={field.onBlur}
                value={formValues.origin}
                errorMessage={errors.origin?.message}
                editable={false}
              />
            )}
          />

          <Controller
            control={control}
            name="destination"
            render={({ field }) => (
              <AppTextInput
                placeholder="Destination"
                onBlur={field.onBlur}
                value={formValues.destination}
                errorMessage={errors.destination?.message}
                editable={false}
              />
            )}
          />
        </YStack>

        <XStack width={"95%"} alignSelf="center" style={{ display: "none" }}>
          <View width={"50%"}>
            <Controller
              control={control}
              name="distance"
              render={({ field }) => (
                <AppTextInput
                  editable={false}
                  placeholder="Distance"
                  onBlur={field.onBlur}
                  value={
                    formValues.distance ? formValues?.distance?.toString() : ""
                  }
                  errorMessage={errors.distance?.message}
                />
              )}
            />
          </View>
          <View width={"50%"}>
            <Controller
              control={control}
              name="duration"
              render={({ field }) => (
                <AppTextInput
                  placeholder="Duration"
                  onBlur={field.onBlur}
                  editable={false}
                  value={formatCoords(formValues.pickup_coordinates)}
                  errorMessage={errors.duration?.message}
                />
              )}
            />
          </View>
        </XStack>

        <XStack width={"95%"} alignSelf="center" style={{ display: "none" }}>
          <View width={"50%"}>
            <Controller
              control={control}
              name="pickup_coordinates"
              render={({ field }) => (
                <AppTextInput
                  placeholder="Origin Coords"
                  onBlur={field.onBlur}
                  editable={false}
                  value={formatCoords(formValues.pickup_coordinates)}
                  errorMessage={errors.pickup_coordinates?.message}
                />
              )}
            />
          </View>
          <View width={"50%"}>
            <Controller
              control={control}
              name="dropoff_coordinates"
              render={({ field }) => (
                <AppTextInput
                  editable={false}
                  placeholder="Dest Coords"
                  onBlur={field.onBlur}
                  value={formatCoords(formValues.dropoff_coordinates)}
                  errorMessage={errors.dropoff_coordinates?.message}
                />
              )}
            />
          </View>
        </XStack>

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              placeholder="Description"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.description?.message}
              numberOfLines={4}
            />
          )}
        />

        <Controller
          control={control}
          name="imageUrl"
          render={({ field: { onChange, value } }) => (
            <ImagePickerInput
              value={value}
              onChange={onChange}
              errorMessage={errors.imageUrl?.message?.toString()}
            />
          )}
        />

        <Button
          style={{
            fontFamily: "Poppins-Medium",
            textTransform: "uppercase",
          }}
          marginVertical={"$3"}
          alignSelf="center"
          backgroundColor={isPending ? "$cardDark" : "$btnPrimaryColor"}
          width={"90%"}
          onPress={handleSubmit(onSubmit)}
        >
          {isPending ? (
            <ActivityIndicator size={"large"} color={theme.text.val} />
          ) : (
            "Send"
          )}
        </Button>
      </View>
    </ScrollView>
  );
};

export default ItemInfo;

const styles = StyleSheet.create({});
