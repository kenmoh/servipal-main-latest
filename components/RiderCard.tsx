import { StyleSheet } from 'react-native'
import React from 'react'
import { Avatar, Button, Card, Label, Separator, Switch, Text, useTheme, View, XStack, YStack } from 'tamagui'
import { Edit, Trash, Trash2 } from 'lucide-react-native'
import HDivider from './HDivider'

const RiderCard = () => {
    const theme = useTheme()
    return (
        <Card marginVertical={'$2'} borderWidth={StyleSheet.hairlineWidth} bordered width={'90%'} alignSelf='center'>
            <Card.Header>
                <XStack justifyContent='space-between'>
                    <XStack gap={'$3'}>
                        <Avatar circular size={55}>
                            <Avatar.Image accessibilityLabel='Rider' src={require('@/assets/images/profile.jpg')} />
                            <Avatar.Fallback backgroundColor={'$blue10'} />
                        </Avatar>
                        <YStack>
                            <Text>Kenneth</Text>
                            <Text>09099889988</Text>
                        </YStack>
                    </XStack>
                    <XStack gap={'$3.5'}>

                        <Edit color={theme.icon.val} size={20} />

                        <Trash2 color={theme.error.val} size={20} />

                    </XStack>
                </XStack>
            </Card.Header>
            <HDivider />
            <Card.Footer padded >
                <XStack alignItems='center' width={'100%'} justifyContent='space-between' >
                    <YStack>
                        <Text color={'$text'} style={{ fontFamily: 'Poppins-Medium', fontSize: 15 }}>  400</Text>
                        <Text color={'$icon'} style={{ fontFamily: 'Poppins-Light', fontSize: 12 }}>Delivered</Text>
                    </YStack>
                    <YStack>
                        <Text color={'$text'} style={{ fontFamily: 'Poppins-Medium', fontSize: 15 }}>  400</Text>
                        <Text color={'$icon'} style={{ fontFamily: 'Poppins-Light', fontSize: 12 }}>Pending</Text>
                    </YStack>
                    <YStack>
                        <Text color={'$text'} style={{ fontFamily: 'Poppins-Medium', fontSize: 15 }}>  400</Text>
                        <Text color={'$icon'} style={{ fontFamily: 'Poppins-Light', fontSize: 12 }}>Bike No.</Text>
                    </YStack>
                    <YStack>
                        <Text color={'$text'} style={{ fontFamily: 'Poppins-Medium', fontSize: 15 }}>  4.5</Text>
                        <Text color={'$icon'} style={{ fontFamily: 'Poppins-Light', fontSize: 12 }}>Rating</Text>
                    </YStack>

                </XStack>
            </Card.Footer>
        </Card>
    )
}

export default RiderCard

const styles = StyleSheet.create({})

const SwitchWithLabel = () => {
    return (
        <XStack width={200} gap={'$3'} alignItems='center' alignSelf='flex-end'>
            <Label>Suspend</Label>
            <Switch id='rider' size={'$3'} backgroundColor={'$inputBackground'} defaultChecked>
                <Switch.Thumb backgroundColor={'$transparentBtnPrimaryColor'} />
            </Switch>
        </XStack>
    )
}