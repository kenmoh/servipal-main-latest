import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'

const index = () => {
    return (
        <View>
            <Text>Welcome</Text>
            <Redirect href={'/(app)/delivery'} />
        </View>
    )
}

export default index

const styles = StyleSheet.create({})