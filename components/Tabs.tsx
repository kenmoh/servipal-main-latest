import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Animated, { FadeInRight, FadeOutRight, LayoutAnimationConfig, LinearTransition } from 'react-native-reanimated'
import { useTheme } from 'tamagui'

type TabItem = {
    label: string
    iconName: keyof typeof MaterialCommunityIcons.glyphMap
}

type TabProps = {
    data: TabItem[] // array of tab items
    selectedIndex: number // index of selected tab
    onChange: (index: number) => void // function to change tab
    activeColor?: string // color of active tab
    inactiveColor?: string // color of inactive tab
    activeBackgroundColor?: string // background color of active tab
    inactiveBackgroundColor?: string // background color of inactive tab
}

type IconProp = {
    name: keyof typeof MaterialCommunityIcons.glyphMap
}

const Icon = ({ name }: IconProp) => {
    return (
        < MaterialCommunityIcons name={name} size={24} color="white" />
    )
}

const _spacing = 5
const Tabs = ({ data, selectedIndex, onChange }: TabProps) => {
    const theme = useTheme()
    return (
        <View style={{ flexDirection: 'row', gap: 15, marginLeft: 20, marginTop: 10 }}>
            {
                data.map((tab, index) => {
                    const isSelected = selectedIndex === index
                    return (
                        <Animated.View key={index}
                            layout={LinearTransition.springify().damping(80).stiffness(200)}
                        >
                            <Pressable onPress={() => onChange(index)}
                                style={{
                                    paddingVertical: _spacing,
                                    paddingHorizontal: _spacing * 2,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: _spacing,
                                    flexDirection: 'row',
                                    backgroundColor: isSelected ? 'orange' : theme.inputBackground.val,
                                    borderRadius: 8
                                }}
                            >
                                <Icon name={tab.iconName} />
                                <LayoutAnimationConfig skipEntering>
                                    {isSelected && <Animated.Text
                                        entering={FadeInRight.springify().damping(80).stiffness(200)}
                                        exiting={FadeOutRight.springify().damping(80).stiffness(6000)}
                                        style={{ fontSize: 16, fontWeight: '700', color: theme.text.val }}

                                    >{tab.label}</Animated.Text>}
                                </LayoutAnimationConfig>
                            </Pressable>
                        </Animated.View>
                    )
                })
            }

        </View>
    )
}

export default Tabs

const styles = StyleSheet.create({})