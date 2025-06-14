import { StyleSheet, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import ProfileCard from "@/components/ProfileCard";
import Animated, { FadeInDown } from "react-native-reanimated";
import { UserRound, UsersRound, LogOutIcon, Wallet, KeyRound } from "lucide-react-native";

import { Heading, Text, useTheme, View, YStack } from "tamagui";
import { router } from "expo-router";
import ProfileImagePicker from "@/components/ProfileImagePicker";
import { useAuth } from "@/context/authContext";
import { useMutation } from "@tanstack/react-query";
import { uploadProfileImage, ImageData, ImageUpload } from "@/api/user";
import { ImageType } from "@/types/order-types";
import { ImageUrl } from "@/types/user-types";
import authStorage from "@/storage/authStorage";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { queryClient } from "@/app/_layout";

const BACKDROP_IMAGE_HEIGHT = Dimensions.get("window").height * 0.2;
const BACKDROP_IMAGE_WIDTH = Dimensions.get("window").width;

const profile = () => {
    const [backdropUri, setBackdropUri] = useState<ImageType | ImageUpload | null | string>(
        null
    );
    const [profileUri, setProfileUri] = useState<ImageUrl | null | string>(null);
    const { user, profile, images, setImages } = useAuth();

    // Load stored images on component mount
    useEffect(() => {
        const loadStoredImages = async () => {
            const storedImages = await authStorage.getImageUrl();
            if (storedImages) {
                setImages(storedImages);
            }
        };
        loadStoredImages();
    }, []);

    // Single mutation for uploading images
    const uploadMutation = useMutation({
        mutationFn: uploadProfileImage,
        onSuccess: async (data) => {
            const newImages = {
                profile_image_url:
                    typeof data?.profile_image_url === "object" && data?.profile_image_url !== null
                        ? data.profile_image_url.uri
                        : data?.profile_image_url ?? images?.profile_image_url ?? undefined,
                backdrop_image_url:
                    typeof data?.backdrop_image_url === "object" && data?.backdrop_image_url !== null
                        ? data.backdrop_image_url.uri
                        : data?.backdrop_image_url ?? images?.backdrop_image_url ?? undefined,
            };

            // Update context
            setImages(newImages);

            // Store in secure storage
            await authStorage.storeImageUrl(newImages);

            // Invalidate queries
            queryClient.invalidateQueries({ queryKey: ['user'] });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            queryClient.invalidateQueries({ queryKey: ['deliveries'] });

            Notifier.showNotification({
                title: 'Success',
                description: 'Images uploaded successfully',
                Component: NotifierComponents.Alert,
                duration: 1000,
                componentProps: {
                    alertType: 'success'
                }
            });
        },
        onError: (error) => {
            Notifier.showNotification({
                title: 'Failed to upload images',
                description: 'There was an error uploading the images. Please try again.',
                Component: NotifierComponents.Alert,
                duration: 1000,
                componentProps: {
                    alertType: 'error'
                }
            });
        },
    });

    const handleProfileImageSelect = (imageData: ImageData) => {
        setProfileUri(imageData.uri);
        uploadMutation.mutate({
            profile_image_url: imageData,
        });
    };

    const handleBackdropImageSelect = (imageData: ImageData) => {
        setBackdropUri(imageData.uri);
        uploadMutation.mutate({
            backdrop_image_url: imageData,
        });
    };

    const theme = useTheme();
    const { signOut } = useAuth();

    return (
        <>
            <View backgroundColor={"$background"} flex={1}>
                <YStack>
                    <View height={"$12"}>
                        <View height={BACKDROP_IMAGE_HEIGHT} width={BACKDROP_IMAGE_WIDTH}>
                            <ProfileImagePicker
                                onImageSelect={handleBackdropImageSelect}
                                width={BACKDROP_IMAGE_WIDTH}
                                height={BACKDROP_IMAGE_HEIGHT}
                                borderRadius={0}
                                isBackdropImage
                                initialImage={images?.backdrop_image_url || null}
                            />
                        </View>
                    </View>

                    <View alignSelf="center" marginTop={-50}>
                        <ProfileImagePicker
                            onImageSelect={handleProfileImageSelect}
                            width={100}
                            height={100}
                            borderRadius={50}
                            initialImage={images?.profile_image_url || null}
                        />
                    </View>

                    <YStack alignSelf="center" marginTop={"$2"}>
                        <Heading letterSpacing={"$1"} fontSize={"$4"} alignSelf="center">
                            {profile?.full_name || profile?.business_name}
                        </Heading>

                        <Text alignSelf="center">{profile?.phone_number}</Text>
                        <Text alignSelf="center">{user?.email}</Text>
                    </YStack>
                    <YStack marginTop={"$10"}>
                        {user?.user_type !== "rider" &&
                            <Animated.View entering={FadeInDown.duration(300).delay(100)}>
                                <ProfileCard
                                    name={"Profile"}
                                    onPress={() =>
                                        router.push({ pathname: "/profile/vendorProfile" })
                                    }
                                    bgColor={"rgba(0,128, 128, 0.3)"}
                                    icon={<UserRound color={"white"} />}
                                />
                            </Animated.View>}
                        {user?.user_type !== "rider" && (
                            <Animated.View entering={FadeInDown.duration(300).delay(100)}>
                                <ProfileCard
                                    name={"Wallet"}
                                    onPress={() => router.push({ pathname: "/profile/wallet" })}
                                    bgColor={"rgba(241, 121, 8, 0.5)"}
                                    icon={<Wallet color={"white"} />}
                                />
                            </Animated.View>
                        )}
                        {user?.user_type === "dispatch" && (
                            <Animated.View entering={FadeInDown.duration(300).delay(100)}>
                                <ProfileCard
                                    name={"Riders"}
                                    onPress={() => router.push({ pathname: "/profile/riders" })}
                                    bgColor={"rgba(0, 0, 255, 0.3)"}
                                    icon={<UsersRound color={"white"} />}
                                />
                            </Animated.View>
                        )}

                        <Animated.View entering={FadeInDown.duration(300).delay(100)}>
                            <ProfileCard
                                name={"Change Password"}
                                onPress={() =>
                                    router.push({ pathname: "/profile/changePassword" })
                                }
                                bgColor={"rgba(221, 218, 11, 0.7)"}
                                icon={<KeyRound color={"white"} />}
                            />
                        </Animated.View>
                        <Animated.View entering={FadeInDown.duration(300).delay(100)}>
                            <ProfileCard
                                name={"Logout"}
                                onPress={() => signOut()}
                                bgColor={"rgba(255, 0, 0, 0.3)"}
                                icon={<LogOutIcon color={"white"} />}
                            />
                        </Animated.View>
                    </YStack>
                </YStack>
            </View>
        </>
    );
};

export default profile;

const styles = StyleSheet.create({});
