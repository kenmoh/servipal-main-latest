import React from "react"
import { LucideProps, UserRound } from "lucide-react-native"
import { Pressable, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Circle, useTheme, XStack } from "tamagui"
import AppTextInput from "./AppInput"
import { router } from "expo-router"

interface AppHeaderProps {

    icon?: React.ReactNode
    component?: React.ReactNode
    onPress?: () => void
}

const AppHeader = ({ icon, component, onPress }: AppHeaderProps) => {
    const theme = useTheme()
    return (
        <SafeAreaView style={{
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.background.val
        }}>
            <XStack justifyContent='space-around' gap={15} width={'100%'} alignSelf="center" alignItems="center" >
                {icon &&
                    <Circle backgroundColor={'$cardDark'} width={'$4'} height={'$4'}>
                        <TouchableOpacity
                            hitSlop={50}
                            onPress={onPress} >
                            {icon}
                        </TouchableOpacity>
                    </Circle>
                }
                {component}
            </XStack>
        </SafeAreaView>

    )
}

export default AppHeader