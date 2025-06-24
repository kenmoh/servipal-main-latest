import { StyleSheet, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import ProfileCard from "@/components/ProfileCard";
import Animated, { FadeInDown } from "react-native-reanimated";
import { UserRound, UsersRound, LogOutIcon, Wallet, KeyRound, Store } from "lucide-react-native";

import { Heading, Text, useTheme, View, YStack } from "tamagui";
import { router } from "expo-router";
import ProfileImagePicker from "@/components/ProfileImagePicker";
import { useAuth } from "@/context/authContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { uploadProfileImage, ImageData, ImageUpload, getCurrentUserProfile } from "@/api/user";
import { ImageType } from "@/types/order-types";
import { ImageUrl, UserDetails } from "@/types/user-types";
import authStorage from "@/storage/authStorage";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { queryClient } from "@/app/_layout";
import { logOutUser } from "@/api/auth";

const BACKDROP_IMAGE_HEIGHT = Dimensions.get("window").height * 0.2;
const BACKDROP_IMAGE_WIDTH = Dimensions.get("window").width;

const profile = () => {
    const [backdropUri, setBackdropUri] = useState<ImageType | ImageUpload | null | string>(null);
    const [profileUri, setProfileUri] = useState<ImageUrl | null | string>(null);
    const { user, profile, setImages } = useAuth();

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

    // Logout user (server side)
    const { mutate } = useMutation({
        mutationKey: ['logout'],
        mutationFn: logOutUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', user?.sub] });
            console.log('Log out')
        }
    })

    const handleProfileScreen = () => {
        if (user?.user_type === 'laundry_vendor' || user?.user_type === 'dispatch'||user?.user_type === 'restaurant_vendor') {
            router.push({ pathname: '/profile/vendorProfile' })
        } else {
            router.push({ pathname: '/profile/customerProfile' })
        }
    }

     const handleAddItem = () => {
        if (user?.user_type === 'laundry_vendor') {
            router.push({ pathname: "/laundry-detail/addLaundryItem" })
        } else if(user?.user_type === 'restaurant_vendor') {
            router.push({ pathname: "/restaurant-detail/addMenu" })
        }
    }


    // Single mutation for uploading images
    const uploadMutation = useMutation({
        mutationFn: uploadProfileImage,
        onSuccess: async (data) => {
            const newImages = {
                profile_image_url:
                    typeof data?.profile_image_url === "object" && data?.profile_image_url !== null
                        ? data.profile_image_url.uri
                        : data?.profile_image_url ?? profile?.profile?.profile_image_url ?? undefined,
                backdrop_image_url:
                    typeof data?.backdrop_image_url === "object" && data?.backdrop_image_url !== null
                        ? data.backdrop_image_url.uri
                        : data?.backdrop_image_url ?? profile?.profile?.backdrop_image_url ?? undefined,
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

    const { signOut } = useAuth();

    const handleLogout = async () => {
        try {
            await authStorage.removeProfile();
            signOut();
            mutate()
        } catch (error) {
        }
    }

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
                                initialImage={profile?.profile?.backdrop_image_url || null}
                            />
                        </View>
                    </View>

                    <View alignSelf="center" marginTop={-50}>
                        <ProfileImagePicker
                            onImageSelect={handleProfileImageSelect}
                            width={100}
                            height={100}
                            borderRadius={50}
                            initialImage={profile?.profile?.profile_image_url || null}
                        />
                    </View>

                    <YStack alignSelf="center" marginTop={"$2"}>
                        <Heading textTransform='capitalize' letterSpacing={"$1"} fontSize={"$4"} alignSelf="center">
                            {profile?.profile?.full_name || profile?.profile?.business_name}
                        </Heading>

                        <Text alignSelf="center">{profile?.profile?.phone_number}</Text>
                        <Text alignSelf="center">{profile?.email}</Text>
                    </YStack>
                    <YStack marginTop={"$10"}>
                        {user?.user_type !== "rider" &&
                            <Animated.View entering={FadeInDown.duration(300).delay(100)}>
                                <ProfileCard
                                    name={"Profile"}
                                    onPress={handleProfileScreen}
                                    bgColor={"rgba(0,128, 128, 0.3)"}
                                    icon={<UserRound color={"white"} />}
                                />
                            </Animated.View>}
                       { user?.user_type==='restaurant_vendor' || user?.user_type==='laundry_vendor' &&<Animated.View entering={FadeInDown.duration(300).delay(100)}>
                                                   <ProfileCard
                                                       name={"Store"}
                                                       onPress={handleAddItem}
                                                       bgColor={"rgba(9, 3, 94, 0.3)"}
                                                       icon={<Store color={"white"} />}
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
                                    bgColor={"rgba(5, 90, 247, 0.3)"}
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
                                onPress={handleLogout}
                                bgColor={"rgba(255, 0, 0, 0.3)"}
                                icon={<LogOutIcon color={"white"} />}
                            />
                        </Animated.View>
                    </YStack>
                </YStack>
            </View >
        </>
    );
};

export default profile;

const styles = StyleSheet.create({});
