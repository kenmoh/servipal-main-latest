import { StyleSheet, Text } from 'react-native'
import React from 'react'
import { Button, View } from 'tamagui'
import RiderCard from '@/components/RiderCard'
import { router } from 'expo-router'

const riders = () => {
    return (
        <View backgroundColor={'$background'} flex={1}>
            <RiderCard />
            <RiderCard />

            <Button onPress={() => router.push('/addRider')}>Add Rider</Button>

        </View>
    )
}

export default riders

const styles = StyleSheet.create({})