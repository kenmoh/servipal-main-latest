import { StyleSheet, Text } from 'react-native'
import React from 'react'
import { View } from 'tamagui'
import RiderCard from '@/components/RiderCard'

const riders = () => {
    return (
        <View backgroundColor={'$background'} flex={1}>
            <RiderCard />
            <RiderCard />

        </View>
    )
}

export default riders

const styles = StyleSheet.create({})