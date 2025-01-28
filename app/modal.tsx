import { StyleSheet, Dimensions, View } from 'react-native'
import React from 'react'
import { Text, } from 'tamagui'

const MODAL_HEIGHT = Dimensions.get('screen').height * 70

const modal = () => {
    return (
        <View style={{
            height: MODAL_HEIGHT, backgroundColor: 'rebeccapurple'
        }}>
            <Text>modal</Text>
        </View>
    )
}

export default modal

const styles = StyleSheet.create({})