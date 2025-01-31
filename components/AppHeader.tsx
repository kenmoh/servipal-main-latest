import React from "react"
import { LucideProps, UserRound } from "lucide-react-native"
import { Pressable, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Circle, XStack } from "tamagui"
import AppTextInput from "./AppInput"
import { router } from "expo-router"

interface AppHeaderProps {
    backgroundColor: string
    icon?: React.ReactNode
    component?: React.ReactNode
    onPress: () => void
}

const AppHeader = ({ backgroundColor, icon, component, onPress }: AppHeaderProps) => {
    return (
        <SafeAreaView style={{ height: 100, alignItems: 'center', justifyContent: 'center', padding: 25, backgroundColor }}>
            <XStack justifyContent='space-around' gap={15}>
                {icon &&
                    <Circle backgroundColor={'$cardDark'} width={'$4'} height={'$4'}>
                        <TouchableOpacity
                            hitSlop={50}
                            onPress={onPress} >
                            <UserRound color={'white'} />
                        </TouchableOpacity>
                    </Circle>
                }
                {component}
            </XStack>
        </SafeAreaView>

    )
}

export default AppHeader