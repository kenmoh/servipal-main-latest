import { ChevronDown } from 'lucide-react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { View, Text, YStack, XStack, useTheme, Accordion, Paragraph, Square } from 'tamagui'

type NotificationProps = {
    sender: string
    date: string
    title: string
    content: string
}

const Notification = ({ sender, date, title, content }: NotificationProps) => {
    const theme = useTheme()


    return (
        <Accordion overflow="hidden" width="95%" borderRadius={'$5'} borderWidth={StyleSheet.hairlineWidth} borderColor={'$transparentBtnPrimaryColor'} alignSelf='center' marginVertical={'$2'} type="multiple">
            <Accordion.Item value={content} >
                <Accordion.Trigger borderWidth={'$0'}  >
                    {({
                        open,
                    }: {
                        open: boolean
                    }) => (
                        <>
                            <YStack>
                                <XStack justifyContent='space-between'>
                                    <Paragraph>{sender}</Paragraph>

                                    <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                                        <ChevronDown size={20} color={'white'} />
                                    </Square>
                                </XStack>
                                <XStack justifyContent='space-between'>
                                    <Paragraph fontWeight={'bold'}>{title}</Paragraph>
                                    <Paragraph color={'$gray11'} fontSize={12}>{date}</Paragraph>
                                </XStack>
                            </YStack>
                        </>
                    )}
                </Accordion.Trigger>
                <Accordion.HeightAnimator animation="medium">
                    <Accordion.Content animation="medium" exitStyle={{ opacity: 0 }}>
                        <Paragraph color={'$gray11'}>
                            {content}
                        </Paragraph>
                    </Accordion.Content>
                </Accordion.HeightAnimator>
            </Accordion.Item>
        </Accordion >
    )
}

export default Notification