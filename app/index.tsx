import { StyleSheet } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'
import { Text, View } from 'tamagui'

const index = () => {
    return <Redirect href={'/(app)/delivery'} />

}

export default index

const styles = StyleSheet.create({})