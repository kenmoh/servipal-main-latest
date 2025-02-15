import { StyleSheet } from 'react-native'
import React from 'react'
import { Text, View } from 'tamagui'
import SelectDemo from '@/components/SelectDemo'

const index = () => {
    return (
        <View backgroundColor={'$background'} flex={1}>
            <Text>index</Text>
            <SelectDemo id="select-demo-1" native/>
        </View>
    )
}

export default index

const styles = StyleSheet.create({})
