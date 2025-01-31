import { StyleSheet, Text } from 'react-native'
import React from 'react'
import { Button, useTheme, View, XStack } from 'tamagui'
import RiderCard from '@/components/RiderCard'
import { Link, router, Stack } from 'expo-router'
import { Plus } from 'lucide-react-native'

const riders = () => {
    const theme = useTheme()
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