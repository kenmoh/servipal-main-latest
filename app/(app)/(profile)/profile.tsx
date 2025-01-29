import { StyleSheet } from 'react-native'
import React from 'react'
import { ScrollView, Text, View } from 'tamagui'
import AppTextInput from '@/components/AppInput'

const profile = () => {
    return (
        <ScrollView paddingBottom={'$5'} flex={1} backgroundColor={'$background'}>
            <AppTextInput placeholder='RC450' />
            <AppTextInput placeholder='Location' />
            <AppTextInput placeholder='Company Name' />
            <AppTextInput placeholder='Opening Hour' />
            <AppTextInput placeholder='Closing Hour' />
            <AppTextInput placeholder='Account Number' />
            <AppTextInput placeholder='Bank Name' />
            <AppTextInput placeholder='Account Name' />
        </ScrollView>
    )
}

export default profile

const styles = StyleSheet.create({})