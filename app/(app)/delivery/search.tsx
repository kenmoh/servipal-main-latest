import { StyleSheet, Platform, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef } from 'react'
import Constants from 'expo-constants'
import { Input, useTheme, View, XStack } from 'tamagui'
import { ArrowLeft, ChevronLeft } from 'lucide-react-native'
import { router, useNavigation } from 'expo-router'
import { useIsFocused } from '@react-navigation/native'

const search = () => {
    const theme = useTheme()
    const isFocused = useIsFocused()
    const navigation = useNavigation()
    const inputRef = useRef(null)

    useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current?.focus()
        }
    }, [isFocused])

    useEffect(() => {
        if (isFocused) {
            // Hide bottom navigation bar
            navigation.setOptions({
                tabBarVisible: false
            })

        } else {
            // Show bottom navigation bar
            navigation.setOptions({ tabBarVisible: true })
        }
    }, [isFocused])

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

                    <Input ref={inputRef} focusStyle={{
                        borderColor: theme.btnPrimaryColor.val
                    }} backgroundColor={'$cardDark'} width={'95%'} borderRadius={'$12'} height={'$3.5'} />
                </View>
            </XStack>
        </View>
    )
}

export default search

const styles = StyleSheet.create({})