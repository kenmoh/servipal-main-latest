import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import React from 'react'
import { Card, useTheme, View, XStack } from 'tamagui'
import { Feather } from '@expo/vector-icons'

interface ProfileCardProp {
    name: string
    icon: React.ReactNode
    bgColor: string
    onPress: () => void
}

const ProfileCard = ({ name, icon, bgColor, onPress }: ProfileCardProp) => {
    const theme = useTheme()
    return (

        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <Card
                backgroundColor={'$profileCard'}
                marginVertical={'$1.5'}
                paddingVertical={'$2'}
                paddingHorizontal={'$3'}

                width={'90%'}
                alignSelf='center'>
                <XStack

                    alignItems='center'
                    justifyContent='space-between'

                >
                    <XStack gap={'$3'} alignItems='center'>
                        <View backgroundColor={bgColor}
                            borderRadius={'$10'} padding={'$2'}
                            width={'$4'}
                            height={'$4'}
                            alignItems='center'
                            justifyContent='center'>
                            {icon}
                        </View>
                        <Text style={{
                            color: theme.text.val,
                            fontFamily: 'Poppins-Regular',
                            fontSize: 14
                        }}>{name}</Text>
                    </XStack>
                    <Feather name='chevron-right' size={25} color={theme.icon.val} />
                </XStack>
            </Card>
        </TouchableOpacity>

    )
}

export default ProfileCard

const styles = StyleSheet.create({})