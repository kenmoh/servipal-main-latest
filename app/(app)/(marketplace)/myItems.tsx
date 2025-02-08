import { StyleSheet } from 'react-native'
import React from 'react'
import { Text, View } from 'tamagui'

const myItems = () => {
    return (
        <View flex={1} backgroundColor={'$background'}>
            <Text>myItems</Text>
        </View>
    )
}

export default myItems

const styles = StyleSheet.create({})