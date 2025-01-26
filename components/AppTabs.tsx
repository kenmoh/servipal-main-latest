// import React, { useState } from 'react';
// import { ScrollView, Tabs, Text, YStack } from 'tamagui';
// import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
// import ItemCard from './ItemCard';

// const ServiceTabs = () => {
//     const [activeTab, setActiveTab] = useState('package')
//     const tabs = ['package', 'food', 'laundry'] as const;


//     return (
//         <Tabs
//             defaultValue="package"
//             orientation="horizontal"
//             flexDirection="column"
//             width="100%"
//         >

//             <Tabs.List
//                 borderRadius="$4"
//                 backgroundColor="$background"
//                 paddingVertical="$1"
//                 gap={5}
//                 padded
//             >
//                 {(['package', 'food', 'laundry'] as const).map((tab, index) => (
//                     <Tabs.Tab
//                         key={index}
//                         flex={1}
//                         value={tab}
//                         size={35}
//                         paddingVertical="$2.5"
//                         borderRadius={70}
//                         pressStyle={{
//                             scale: 0.95
//                         }}
//                         backgroundColor={activeTab === tab ? 'rgba(255, 168,0,0.7)' : '$inputBackground'}
//                         onPress={() => setActiveTab(tab)}
//                     >
//                         <Text color={'$text'} fontWeight={'bold'}>
//                             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                         </Text>
//                     </Tabs.Tab>
//                 ))}
//             </Tabs.List>



//             <Tabs.Content value="package">
//                 <YStack padding="$4">
//                     <ScrollView showsVerticalScrollIndicator={false} marginBottom={100}>
//                         <ItemCard />
//                         <ItemCard />
//                         <ItemCard />
//                         <ItemCard />
//                         <ItemCard />
//                         <ItemCard />
//                         <ItemCard />
//                         <ItemCard />
//                         <ItemCard />
//                         <ItemCard />
//                         <ItemCard />
//                         <ItemCard />

//                     </ScrollView>
//                     <Text>Package</Text>
//                 </YStack>
//             </Tabs.Content>
//             <Tabs.Content value="food">
//                 <YStack padding="$4">
//                     <ItemCard />
//                     <Text>Food</Text>
//                 </YStack>
//             </Tabs.Content>
//             <Tabs.Content value="laundry">
//                 <YStack padding="$4">
//                     <ItemCard />
//                     <Text>Laundry</Text>
//                 </YStack>
//             </Tabs.Content>
//         </Tabs>
//     );
// };

// export default ServiceTabs;

import React from 'react'
import type { StackProps, TabLayout, TabsTabProps } from 'tamagui'
import {
    AnimatePresence,
    Button,
    H5,
    SizableText,
    Tabs,
    XStack,
    YStack,
    styled,
} from 'tamagui'




export const ServiceTabs = () => {

    return (
        <>

            <TabsAdvancedBackground />
            <XStack
                alignItems="center"
                gap="$4"
                position="absolute"
                bottom="$3"
                left="$4"
                $xxs={{ display: 'none' }}
            >
            </XStack>
        </>
    )
}
export default ServiceTabs;

const TabsAdvancedBackground = () => {
    const [tabState, setTabState] = React.useState<{
        currentTab: string
        intentAt: TabLayout | null
        activeAt: TabLayout | null
        prevActiveAt: TabLayout | null
    }>({
        activeAt: null,
        currentTab: 'delivery',
        intentAt: null,
        prevActiveAt: null,
    })

    const setCurrentTab = (currentTab: string) => setTabState({ ...tabState, currentTab })
    const setIntentIndicator = (intentAt) => setTabState({ ...tabState, intentAt })
    const setActiveIndicator = (activeAt) =>
        setTabState({ ...tabState, prevActiveAt: tabState.activeAt, activeAt })
    const { activeAt, intentAt, prevActiveAt, currentTab } = tabState

    const direction = (() => {
        if (!activeAt || !prevActiveAt || activeAt.x === prevActiveAt.x) {
            return 0
        }
        return activeAt.x > prevActiveAt.x ? -1 : 1
    })()

    const handleOnInteraction: TabsTabProps['onInteraction'] = (type, layout) => {
        if (type === 'select') {
            setActiveIndicator(layout)
        } else {
            setIntentIndicator(layout)
        }
    }

    return (
        <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            orientation="horizontal"
            size="$4"
            padding="$2"
            flexDirection="column"
            activationMode="manual"
            backgroundColor="$background"
            flex={1}

        // position="relative"
        >
            <YStack>
                <AnimatePresence>
                    {intentAt && (
                        <TabsRovingIndicator
                            borderRadius="$4"
                            width={intentAt.width}
                            height={intentAt.height}
                            x={intentAt.x}
                            y={intentAt.y}
                        />
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {activeAt && (
                        <TabsRovingIndicator
                            borderRadius="$10"
                            width={activeAt.width}
                            height={activeAt.height}
                            x={activeAt.x}
                            y={activeAt.y}
                        />
                    )}
                </AnimatePresence>

                <Tabs.List
                    disablePassBorderRadius
                    loop={false}
                    aria-label="Manage your account"
                    gap="$2"
                    alignItems='center'
                    alignSelf='center'
                >
                    <Tabs.Tab

                        unstyled
                        paddingVertical="$2.5"
                        paddingHorizontal="$3"
                        value="delivery"
                        onInteraction={handleOnInteraction}
                    >
                        <SizableText fontWeight={'bold'}>Delivery</SizableText>
                    </Tabs.Tab>
                    <Tabs.Tab
                        unstyled
                        paddingVertical="$2.5"

                        paddingHorizontal="$3"
                        value="food"
                        onInteraction={handleOnInteraction}
                    >
                        <SizableText fontWeight={'bold'}>Food</SizableText>
                    </Tabs.Tab>
                    <Tabs.Tab
                        unstyled
                        paddingVertical="$2.5"
                        paddingHorizontal="$3"
                        value="laundry"
                        onInteraction={handleOnInteraction}
                    >
                        <SizableText fontWeight={'bold'}>Laundry</SizableText>
                    </Tabs.Tab>
                </Tabs.List>
            </YStack>

            <AnimatePresence exitBeforeEnter custom={{ direction }} initial={false}>
                <AnimatedYStack key={currentTab}>
                    <Tabs.Content value={currentTab} forceMount flex={1} >
                        <H5 textAlign="center">{currentTab}</H5>
                    </Tabs.Content>
                </AnimatedYStack>
            </AnimatePresence>
        </Tabs>
    )
}



const TabsRovingIndicator = ({ active, ...props }: { active?: boolean } & StackProps) => {
    return (
        <YStack
            position="absolute"
            left={61.5}
            backgroundColor="$transparentBtnPrimaryColor"
            opacity={0.7}
            animation="100ms"
            enterStyle={{
                opacity: 0,
            }}
            exitStyle={{
                opacity: 0,
            }}
            {...(active && {
                backgroundColor: '$inputBackground',
                opacity: 0.6,
            })}
            {...props}
        />
    )
}

const AnimatedYStack = styled(YStack, {
    flex: 1,
    x: 0,
    opacity: 1,
    animation: '100ms',
    variants: {

        direction: {
            ':number': (direction) => ({
                enterStyle: {
                    x: direction > 0 ? -25 : 25,
                    opacity: 0,
                },
                exitStyle: {
                    zIndex: 0,
                    x: direction < 0 ? -25 : 25,
                    opacity: 0,
                },
            }),
        },
    } as const,
})