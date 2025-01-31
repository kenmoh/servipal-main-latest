import { StyleSheet } from 'react-native'
import React from 'react'
import ProfileCard from '@/components/ProfileCard'
import Animated, { FadeInDown } from 'react-native-reanimated';
import { UserRound, UsersRound, SquareAsterisk, LogOutIcon, PencilIcon } from 'lucide-react-native';

import { Avatar, Circle, Heading, Image, Text, useTheme, View, YStack } from 'tamagui'
import { ExternalPathString, RelativePathString, router } from 'expo-router';

interface ProfileCardProp {
    name: string;
    icon: React.ReactNode;
    bgColor: string;
    link: RelativePathString | ExternalPathString;
    condition: boolean;
}
const profile = () => {
    const profileCards: ProfileCardProp[] = [
        {
            name: "Update Profile",
            icon: <UserRound color={'white'} />,
            bgColor: "rgba(0,128, 128, 0.3)",
            link: './profile/userProfile',
            condition: true,
        },
        {
            name: "Riders",
            icon: <UsersRound color={'white'} />,
            bgColor: "rgba(0, 0, 255, 0.3)",
            link: './profile/riders',
            condition: true,
            // condition: currentUser.role === "admin", // Only show for admins
        },
        {
            name: "Change Password",
            icon: <SquareAsterisk color={'white'} />,
            bgColor: "rgba(255, 212, 0, 0.3)",
            link: './profile/changePassword',
            condition: true,
        },
        {
            name: "Logout",
            icon: <LogOutIcon color={'white'} />,
            bgColor: "rgba(255, 0, 0, 0.3)",
            link: './profile/changePassword',
            condition: true,
        },
    ]

    const theme = useTheme()
    return (
        <View backgroundColor={'$background'} flex={1}>
            <YStack>
                <View height={'$12'}>
                    <Image src={require('@/assets/images/Burge.jpg')}
                        height={'100%'}
                    />
                    <Circle
                        onPress={() => router.push({ pathname: '/(app)/delivery/profile/userProfile' })}
                        top={'$-8'}
                        right={'$-4'}
                        height={40}
                        width={40} backgroundColor={theme.profileCard.val}>
                        <PencilIcon color={theme.icon.val} size={20} />
                    </Circle>
                </View>

                <Avatar circular size={'$10'} alignSelf='center' top={'$-7'} >
                    <Avatar.Image
                        accessibilityLabel='Profile'
                        src={require('@/assets/images/Burge.jpg')} />
                    <Avatar.Fallback backgroundColor={'$blue10'} />
                </Avatar>


                <YStack alignSelf='center'
                    marginVertical={'$-6'}

                >
                    <Heading letterSpacing={'$1'} fontSize={'$4'} alignSelf='center'>Kenneth Aremoh</Heading>

                    <Text alignSelf='center'>09099889988</Text>
                    <Text alignSelf='center'>kenneth.aremoh@gmail.com</Text>

                </YStack>

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
            </YStack>

        </View>
    )
}

export default profile

const styles = StyleSheet.create({})