
// import React, { useState } from 'react'
// import { MaterialCommunityIcons } from '@expo/vector-icons'

// import { Select, SelectProps, Adapt, Sheet, YStack, Label, View, useTheme } from 'tamagui'
// import { LinearGradient } from 'tamagui/linear-gradient'


// type ItemProp = {
//     id: number,
//     name: string
// }
// type SelectorProp = {
//     label?: string
//     items: ItemProp[]
//     props?: SelectProps
// }

// const AppSelector = ({ props, items, label }: SelectorProp) => {
//     const theme = useTheme()
//     const [val, setVal] = useState('Regular User')
//     return (
//         <>
//             {label && <View width={'90%'}>
//                 <Label color={'$text'} fontWeight={'600'} fontFamily={'$body'} alignSelf='flex-start'>{label}</Label>
//             </View>}


//             <Select value={val} onValueChange={setVal} disablePreventBodyScroll {...props}>
//                 <Select.Trigger
//                     width={'90%'}
//                     height={'$5'}
//                     borderWidth={0}
//                     backgroundColor={'$cardDark'}
//                     iconAfter={<MaterialCommunityIcons
//                         name='chevron-down'
//                         color={theme.icon.val}
//                         size={25} />}>
//                     <Select.Value placeholder="Something" />
//                 </Select.Trigger>

//                 <Adapt when="sm" platform="touch">
//                     <Sheet
//                         modal
//                         native
//                         dismissOnSnapToBottom
//                         animationConfig={{
//                             type: 'spring',
//                             damping: 20,
//                             mass: 1.2,
//                             stiffness: 250,
//                         }}
//                     >
//                         <Sheet.Frame>
//                             <Sheet.ScrollView>
//                                 <Adapt.Contents />
//                             </Sheet.ScrollView>
//                         </Sheet.Frame>
//                         <Sheet.Overlay
//                             animation="lazy"
//                             enterStyle={{ opacity: 0 }}
//                             exitStyle={{ opacity: 0 }}
//                         />
//                     </Sheet>
//                 </Adapt>

//                 <Select.Content zIndex={200000}>
//                     <Select.ScrollUpButton
//                         alignItems="center"
//                         justifyContent="center"
//                         position="relative"
//                         width="100%"
//                         height="$3"
//                     >
//                         <YStack zIndex={10}>
//                             <MaterialCommunityIcons name='chevron-up' color={theme.icon.val} />
//                         </YStack>
//                         <LinearGradient
//                             start={[0, 0]}
//                             end={[0, 1]}
//                             fullscreen
//                             colors={['$background', 'transparent']}
//                             borderRadius="$4"
//                         />
//                     </Select.ScrollUpButton>

//                     <Select.Viewport

//                         minWidth={200}
//                     >
//                         <Select.Group>
//                             <Select.Label>Fruits</Select.Label>
//                             {/* for longer lists memoizing these is useful */}
//                             {React.useMemo(
//                                 () =>
//                                     items.map((item, i) => {
//                                         return (
//                                             <Select.Item
//                                                 index={i}
//                                                 key={item.id}
//                                                 value={item.name.toLowerCase()}
//                                             >
//                                                 <Select.ItemText>{item.name}</Select.ItemText>
//                                                 <Select.ItemIndicator marginLeft="auto">
//                                                     <MaterialCommunityIcons name='check' color={theme.icon.val} />
//                                                 </Select.ItemIndicator>
//                                             </Select.Item>
//                                         )
//                                     }),
//                                 [items]
//                             )}
//                         </Select.Group>
//                     </Select.Viewport>

//                     <Select.ScrollDownButton
//                         alignItems="center"
//                         justifyContent="center"
//                         position="relative"
//                         width="100%"
//                         height="$3"
//                     >
//                         <YStack zIndex={10}>
//                             <MaterialCommunityIcons name='chevron-down' color={theme.icon.val} />
//                         </YStack>
//                         <LinearGradient
//                             start={[0, 0]}
//                             end={[0, 1]}
//                             fullscreen
//                             colors={['transparent', '$background']}
//                             borderRadius="$4"
//                         />
//                     </Select.ScrollDownButton>
//                 </Select.Content>
//             </Select>

//         </>
//     )
// }

// export default AppSelector


import React, { useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Select, SelectProps, Adapt, Sheet, YStack, Label, View, useTheme } from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

type ItemProp = {
    id: number,
    name: string
}

type SelectorProp = {
    label?: string
    items: ItemProp[]
    props?: SelectProps
}

const AppSelector = ({ props, items, label }: SelectorProp) => {
    const theme = useTheme()
    const [val, setVal] = useState('')

    return (
        <>
            {label && (
                <View width={'90%'}>
                    <Label color={'$text'} fontWeight={'600'} fontFamily={'$body'} alignSelf='flex-start'>{label}</Label>
                </View>
            )}

            <Select value={val} onValueChange={setVal} disablePreventBodyScroll {...props}>
                <Select.Trigger
                    width={'90%'}
                    height={'$5'}
                    borderWidth={0}
                    backgroundColor={'$cardDark'}
                    iconAfter={<MaterialCommunityIcons name='chevron-down' color={theme.icon.val} size={25} />}
                >
                    <Select.Value placeholder="Select an option" />
                </Select.Trigger>

                <Adapt when="sm" platform="touch">
                    <Sheet
                        modal
                        native
                        dismissOnSnapToBottom
                        animationConfig={{
                            type: 'spring',
                            damping: 20,
                            mass: 1.2,
                            stiffness: 250,
                        }}
                    >
                        <Sheet.Frame>
                            <Sheet.ScrollView>
                                <Adapt.Contents />
                            </Sheet.ScrollView>
                        </Sheet.Frame>
                        <Sheet.Overlay
                            animation="lazy"
                            enterStyle={{ opacity: 0 }}
                            exitStyle={{ opacity: 0 }}
                        />
                    </Sheet>
                </Adapt>

                <Select.Content zIndex={200000}>
                    <Select.ScrollUpButton
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                        width="100%"
                        height="$3"
                    >
                        <YStack zIndex={10}>
                            <MaterialCommunityIcons name='chevron-up' color={theme.icon.val} />
                        </YStack>
                        <LinearGradient
                            start={[0, 0]}
                            end={[0, 1]}
                            fullscreen
                            colors={['$background', 'transparent']}
                            borderRadius="$4"
                        />
                    </Select.ScrollUpButton>

                    <Select.Viewport minWidth={200}>
                        <Select.Group>
                            <Select.Label>Options</Select.Label>
                            {items.map((item, i) => (
                                <Select.Item
                                    index={i}
                                    key={item.id}
                                    value={item.name.toLowerCase()}
                                >
                                    <Select.ItemText>{item.name}</Select.ItemText>
                                    <Select.ItemIndicator marginLeft="auto">
                                        <MaterialCommunityIcons name='check' color={theme.icon.val} />
                                    </Select.ItemIndicator>
                                </Select.Item>
                            ))}
                        </Select.Group>
                    </Select.Viewport>

                    <Select.ScrollDownButton
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                        width="100%"
                        height="$3"
                    >
                        <YStack zIndex={10}>
                            <MaterialCommunityIcons name='chevron-down' color={theme.icon.val} />
                        </YStack>
                        <LinearGradient
                            start={[0, 0]}
                            end={[0, 1]}
                            fullscreen
                            colors={['transparent', '$background']}
                            borderRadius="$4"
                        />
                    </Select.ScrollDownButton>
                </Select.Content>
            </Select>
        </>
    )
}

export default AppSelector