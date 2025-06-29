import React from 'react';
import { type Href } from 'expo-router'
import { YStack, Button, Text, View, useTheme } from 'tamagui';
import { router } from 'expo-router';

interface EmptyListProps {
    title: string;
    description: string;
    buttonTitle: string;
    buttonAction?: () => void;
    route?: Href;
}

const EmptyList = ({
    title,
    description,
    buttonTitle,
    buttonAction,
    route
}: EmptyListProps) => {
    const theme = useTheme();

    const handlePress = () => {
        if (buttonAction) {
            buttonAction();
            return;
        }
        if (route) {
            router.push(route);
        }
    };

    return (
        <View

            flex={1}
            justifyContent="center"
            alignItems="center"
            backgroundColor='$background'
            alignSelf='center'
        >

            <YStack
                flex={1}
                justifyContent="center"
                alignItems="center"
                gap="$4"
                padding="$4"
                alignSelf='center'
                marginTop={75}



            >
                <Text
                    color="$text"
                    fontSize={20}
                    textAlign="center"
                    style={{ fontFamily: "Poppins-Medium" }}
                >
                    {title}
                </Text>
                <Text
                    color="$icon"
                    fontSize={14}
                    textAlign="center"
                    style={{ fontFamily: "Poppins-Light" }}
                >
                    {description}
                </Text>
                <Button
                    backgroundColor="$btnPrimaryColor"
                    color="$background"
                    width="50%"
                    borderRadius={50}
                    onPress={handlePress}
                    pressStyle={{ opacity: 0.8 }}
                    fontSize={16}
                    style={{ fontFamily: "Poppins-Medium" }}
                >
                    {buttonTitle}
                </Button>
            </YStack>
        </View>
    );
};

export default EmptyList;