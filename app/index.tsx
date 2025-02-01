import { StyleSheet } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'
import { Text, View } from 'tamagui'

const index = () => {
    return (
        <View backgroundColor={'$background'} flex={1}>
            <Text>Welcome</Text>
            <Redirect href={'/(app)/delivery'} />
        </View>
    )
}

export default index

const styles = StyleSheet.create({})