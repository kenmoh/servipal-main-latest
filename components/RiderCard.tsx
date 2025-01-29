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
            <Card.Footer padded>
                <XStack alignItems='center' justifyContent='space-between' >
                    <XStack>
                        <Text color={'$icon'} style={{ fontFamily: 'Poppins-Light', fontSize: 12 }}>Total Delivery:</Text>
                        <Text color={'$text'} style={{ fontFamily: 'Poppins-Bold', fontSize: 15 }}>  400</Text>
                    </XStack>

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