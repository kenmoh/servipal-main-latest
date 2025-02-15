import { StyleSheet, Platform, TouchableOpacity } from 'react-native'
import React from 'react'
import Constants from 'expo-constants'
import { Input, useTheme, View, XStack } from 'tamagui'
import { ArrowLeft, ChevronLeft } from 'lucide-react-native'
import { router } from 'expo-router'

const search = () => {
    const theme = useTheme()

    return (
        <View marginTop={Constants.statusBarHeight + 5} >
            <XStack >
                <TouchableOpacity

                    onPress={() => router.back()}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 50,
                        height: 50,

                        borderRadius: 50
                    }}>

                    {Platform.OS === 'ios' ?

                        < ChevronLeft color={'white'} /> : <ArrowLeft color={'white'} />
                    }
                </TouchableOpacity>
                <View flex={1} marginRight={'$2.5'} height={50} alignItems='center' justifyContent='center'>

                    <Input backgroundColor={'$cardDark'} width={'95%'} borderRadius={'$12'} height={'$3.5'} />
                </View>
            </XStack>
        </View>
    )
}

export default search

const styles = StyleSheet.create({})