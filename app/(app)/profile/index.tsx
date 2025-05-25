import { StyleSheet, Dimensions } from 'react-native'
import React, { useState } from 'react'
import ProfileCard from '@/components/ProfileCard'
import Animated, { FadeInDown } from 'react-native-reanimated';
import { UserRound, UsersRound, SquareAsterisk, LogOutIcon, Camera, Wallet, User } from 'lucide-react-native';

import { Avatar, Circle, Heading, Image, Text, useTheme, View, XStack, YStack } from 'tamagui'
import { ExternalPathString, RelativePathString, router } from 'expo-router';
import ImagePickerInput from '@/components/AppImagePicker'
import ProfileImagePicker from '@/components/ProfileImagePicker'
import { useAuth } from '@/context/authContext';
import { useMutation } from '@tanstack/react-query';
import { getCurrentUser, uploadProfileImage, ImageData } from '@/api/user';
import { ImageType } from '@/types/order-types';

interface ProfileCardProp {
    name: string;
    icon: React.ReactNode;
    bgColor: string;
    link: RelativePathString | ExternalPathString;
    condition: boolean;
}


const BACKDROP_IMAGE_HEIGHT = Dimensions.get('window').height * 0.2
const BACKDROP_IMAGE_WIDTH = Dimensions.get('window').width
const profile = () => {

    const [backdropUri, setBackdropUri] = useState<ImageType | null | string>(null)
    const [profileUri, setProfileUri] = useState<ImageType | null | string>(null)
    const { user, profile } = useAuth()

    // Single mutation for uploading images
    const uploadMutation = useMutation({
        mutationFn: uploadProfileImage,
        onSuccess: (data) => {
            console.log('Images uploaded successfully:', data);
            // You might want to update user context or refetch data here
        },
        onError: (error) => {
            console.error('Error uploading images:', error);
            // Show error message to user (toast, alert, etc.)
        }
    });

    const handleProfileImageSelect = (imageData: ImageData) => {
        setProfileUri(imageData.uri);

        // Upload only profile image
        uploadMutation.mutate({
            profile_image_url: imageData,
            // backdrop_image_url: null
        });
    };

    const handleBackdropImageSelect = (imageData: ImageData) => {
        setBackdropUri(imageData.uri);

        // Upload only backdrop image
        uploadMutation.mutate({
            // profile_image_url: null,
            backdrop_image_url: imageData
        });
    };





    const profileCards: ProfileCardProp[] = [
        {
            name: "Update Profile",
            icon: <UserRound color={'white'} />,
            bgColor: "rgba(0,128, 128, 0.3)",
            link: './vendorProfile',
            condition: true,
        },

        {
            name: "Change Password",
            icon: <SquareAsterisk color={'white'} />,
            bgColor: "",
            link: './changePassword',
            condition: true,
        },

    ]

    const theme = useTheme()
    const { signOut } = useAuth()
    return (
        <>
            <View backgroundColor={'$background'} flex={1}>
                <YStack>
                    <View height={'$12'}>

                        <View height={BACKDROP_IMAGE_HEIGHT} width={BACKDROP_IMAGE_WIDTH}>
                            <ProfileImagePicker
                                onImageSelect={handleBackdropImageSelect}
                                width={BACKDROP_IMAGE_WIDTH}
                                height={BACKDROP_IMAGE_HEIGHT}
                                borderRadius={15}
                                disabled={uploadMutation.isPending}
                            />

                        </View>


                    </View>

                    <View alignSelf='center' marginTop={-50}>

                        <ProfileImagePicker
                            onImageSelect={handleProfileImageSelect}
                            width={100}
                            height={100}
                            borderRadius={50}
                            disabled={uploadMutation.isPending}
                        />


                    </View>



                    <YStack alignSelf='center'
                        marginTop={'$2'}

                    >
                        <Heading letterSpacing={'$1'} fontSize={'$4'} alignSelf='center'>{profile?.business_name || profile?.full_name}</Heading>

                        <Text alignSelf='center'>{profile?.phone_number}</Text>
                        <Text alignSelf='center'>{user?.email}</Text>

                    </YStack>
                    <YStack marginTop={'$10'}>


                        <Animated.View entering={FadeInDown.duration(300).delay(100)}>
                            <ProfileCard
                                name={'Profile'}
                                onPress={() => router.push({ pathname: '/profile/vendorProfile' })}
                                bgColor={'rgba(0,128, 128, 0.3)'}
                                icon={<UserRound color={'white'} />}
                            />
                        </Animated.View>

                        <Animated.View entering={FadeInDown.duration(300).delay(100)}>
                            <ProfileCard
                                name={'Wallet'}
                                onPress={() => router.push({ pathname: '/profile/wallet' })}
                                bgColor={'rgba(241, 121, 8, 0.5)'}
                                icon={<Wallet color={'white'} />}
                            />
                        </Animated.View>
                        {user?.user_type === 'vendor' && <Animated.View entering={FadeInDown.duration(300).delay(100)}>
                            <ProfileCard
                                name={'Riders'}
                                onPress={() => router.push({ pathname: '/profile/riders' })}
                                bgColor={'rgba(0, 0, 255, 0.3)'}
                                icon={<UsersRound color={'white'} />}
                            />
                        </Animated.View>}

                        <Animated.View entering={FadeInDown.duration(300).delay(100)}>
                            <ProfileCard
                                name={'Change Password'}
                                onPress={() => router.push({ pathname: '/profile/changePassword' })}
                                bgColor={'rgba(221, 218, 11, 0.7)'}
                                icon={<LogOutIcon color={'white'} />}
                            />
                        </Animated.View>
                        <Animated.View entering={FadeInDown.duration(300).delay(100)}>
                            <ProfileCard
                                name={'Logout'}
                                onPress={() => signOut()}
                                bgColor={'rgba(255, 0, 0, 0.3)'}
                                icon={<LogOutIcon color={'white'} />}
                            />
                        </Animated.View>
                    </YStack>


                </YStack>

            </View>


        </>
    )
}

export default profile

const styles = StyleSheet.create({})
