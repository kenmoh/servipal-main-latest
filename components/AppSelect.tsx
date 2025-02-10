import React from 'react';
import { Select, YStack, Label, View, useTheme } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';
import { Check, ChevronDown, ChevronUp } from 'lucide-react-native';

type ItemProp = {
    id: number;
    name: string;
};

type SelectorProp = {
    label?: string;
    items: ItemProp[];
    value: string;
    onValueChange: (val: string) => void;

};



const AppSelector = ({ items, label, value, onValueChange }: SelectorProp) => {
    const theme = useTheme();

    return (
        <>
            {label && (
                <View width="90%">
                    <Label color="$text" fontWeight="600" fontFamily="$body" alignSelf="flex-start">
                        {label}
                    </Label>
                </View>
            )}

            <Select defaultValue={items[0].name} value={value} onValueChange={onValueChange}>
                <Select.Trigger
                    width="90%"
                    height="$5"
                    borderWidth={0}
                    backgroundColor="$cardDark"
                    iconAfter={
                        <ChevronDown color={theme.icon.val} size={25} />
                    }
                >

                    <Select.Value />
                </Select.Trigger>
                <Select.Content zIndex={200000}>
                    <Select.ScrollUpButton
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                        width="100%"
                        height="$3"
                    >
                        <YStack zIndex={10}>
                            <ChevronUp color={theme.icon.val} />
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
                            <Select.Label>Available Roles</Select.Label>
                            {
                                items.map((item, index) => {
                                    return (
                                        <Select.Item
                                            index={index}
                                            key={item.id}
                                            value={item.name}
                                        >
                                            <Select.ItemText>{item.name}</Select.ItemText>
                                            <Select.ItemIndicator marginLeft="auto">
                                                <Check color={theme.icon.val} />
                                            </Select.ItemIndicator>
                                        </Select.Item>
                                    );
                                })
                            }
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
                            <ChevronDown color={theme.icon.val} />
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
    );
};

export default AppSelector;
