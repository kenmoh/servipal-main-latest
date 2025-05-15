import { StyleSheet, Platform, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import Constants from 'expo-constants'
import { Input, useTheme, View, XStack } from 'tamagui'
import { ArrowLeft, ChevronLeft } from 'lucide-react-native'
import { router } from 'expo-router'

import { usePathname, useNavigation } from 'expo-router'



const search = () => {
    const theme = useTheme()
    const inputRef = useRef(null)
    const path = usePathname()
    const navigation = useNavigation()

    useLayoutEffect(() => {

        if (path === '/delivery/search') {

            navigation.setOptions({ tabBarItemHidden: true })

        }
    }, [path])



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

                    <Input ref={inputRef}
                        focusStyle={{
                            borderColor: theme.btnPrimaryColor.val
                        }}
                        backgroundColor={'$cardDark'}
                        width={'95%'} borderRadius={'$12'}
                        height={'$3.5'}
                        autoFocus

                    />
                </View>
            </XStack>
        </View>
    )
}

export default search

const styles = StyleSheet.create({})