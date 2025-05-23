import { StyleSheet } from 'react-native'
import React, { useState } from 'react'
import ProfileCard from '@/components/ProfileCard'
import Animated, { FadeInDown } from 'react-native-reanimated';
import { UserRound, UsersRound, SquareAsterisk, LogOutIcon, Camera } from 'lucide-react-native';

import { Avatar, Circle, Heading, Image, Text, useTheme, View, XStack, YStack } from 'tamagui'
import { ExternalPathString, RelativePathString, router } from 'expo-router';
import ImagePickerInput from '@/components/AppImagePicker'
import { useAuth } from '@/context/authContext';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/api/user';
import { ImageType } from '@/types/order-types';

interface ProfileCardProp {
    name: string;
    icon: React.ReactNode;
    bgColor: string;
    link: RelativePathString | ExternalPathString;
    condition: boolean;
}
const profile = () => {

    const [backdropUri, setBackdropUri] = useState<ImageType | null | string>(null)
    const [profileUri, setProfileUri] = useState<ImageType | null | string>(null)
    const { user } = useAuth()

    const { data, isPending } = useQuery({
        queryKey: ['profile'],
        queryFn: getCurrentUser
    })



    const profileCards: ProfileCardProp[] = [
        {
            name: "Update Profile",
            icon: <UserRound color={'white'} />,
            bgColor: "rgba(0,128, 128, 0.3)",
            link: './vendorProfile',
            condition: true,
        },
        {
            name: "Riders",
            icon: <UsersRound color={'white'} />,
            bgColor: "rgba(0, 0, 255, 0.3)",
            link: './riders',
            condition: user?.user_type === 'dispatch'
        },
        {
            name: "Change Password",
            icon: <SquareAsterisk color={'white'} />,
            bgColor: "rgba(255, 212, 0, 0.3)",
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


                        {backdropUri && typeof backdropUri === 'string' ?
                            <Image src={backdropUri}
                                height={'100%'}
                            /> : <Image src={require('@/assets/images/Burge.jpg')}
                                height={'100%'}
                            />}
                        <Circle
                            onPress={() => router.push({ pathname: '/vendorProfile' })}
                            top={'$-8'}
                            right={'$-4'}
                            height={40}
                            alignItems='center'
                            justifyContent='center'
                            width={40}>

                            <ImagePickerInput
                                imageHeight={0}
                                onChange={uri => setBackdropUri(uri)} iconSize={25} />
                        </Circle>



                    </View>
                    <XStack alignSelf='center'>

                        <Circle

                            height={100}
                            top={-50}
                            alignItems='center'
                            justifyContent='center'
                            backgroundColor={'$cardLight'}
                            zIndex={1000}
                            width={100}>

                            <Avatar circular size={'$10'} alignSelf='center'  >
                                <Avatar.Image
                                    accessibilityLabel='Profile'
                                    src={profileUri || require('@/assets/images/profile.jpg')} />
                                <Avatar.Fallback backgroundColor={'$blue10'} />

                            </Avatar>

                            <View position='absolute' bottom='$-3' left={'$10'}>
                                <ImagePickerInput
                                    imageHeight={0}
                                    onChange={uri => setProfileUri(uri)} iconSize={25} />
                            </View>
                        </Circle>
                    </XStack>



                    <YStack alignSelf='center'
                        marginVertical={'$-6'}

                    >
                        <Heading letterSpacing={'$1'} fontSize={'$4'} alignSelf='center'>{data?.profile.business_name || data?.profile.full_name}</Heading>

                        <Text alignSelf='center'>{data?.profile.phone_number}</Text>
                        <Text alignSelf='center'>{data?.email}</Text>

                    </YStack>
                    <YStack marginTop={'$10'}>
                        {profileCards.map((card, index) => (
                            <Animated.View entering={FadeInDown.duration(300).delay(100 * index)} key={index}>
                                <ProfileCard
                                    name={card.name}
                                    onPress={() => router.push(card.link)}
                                    bgColor={card.bgColor}
                                    icon={card.icon}
                                />
                            </Animated.View>
                        ))}

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
