import { StyleSheet } from "react-native";
import React from "react";
import { Picker } from "@react-native-picker/picker";
import { Label, useTheme } from "tamagui";
import { View } from "tamagui";

type ItemProp = {
    id: number | string;
    name: string;
    code?: string;
};

type PickerProps = {
    label?: string;
    items: ItemProp[];
    value: string;
    placeholder?: string;
    isBank?: boolean;
    onValueChange: (val: string) => void;
};
const AppPicker = ({
    label,
    items,
    value,
    placeholder,
    onValueChange,
    isBank,
}: PickerProps) => {
    const theme = useTheme();
    return (
        <View
            width={"90%"}
            overflow="hidden"
            alignSelf="center"
            marginVertical={"$1.5"}
        >
            {label && <Label fontWeight={"bold"}>{label}</Label>}
            <View
                borderRadius={10}
                backgroundColor={theme.cardDark.val}
                overflow="hidden"
            >
                <Picker
                    style={{
                        backgroundColor: theme.cardDark.val,
                        borderRadius: 10,
                        width: "100%",
                        color: theme.text.val,
                        fontSize: 12,
                    }}
                    mode="dropdown"
                    placeholder={placeholder}
                    selectedValue={value}
                    onValueChange={(itemValue) => onValueChange(itemValue)}
                >
                    {items.map((item) => (
                        <Picker.Item
                            color={theme.text.val}
                            style={{ backgroundColor: theme.cardDark.val }}
                            label={item.name}
                            value={isBank ? item.code : item.name}
                            key={isBank ? item.code : item.id}
                        />
                    ))}
                </Picker>
            </View>
        </View>
    );
};

export default AppPicker;

const styles = StyleSheet.create({});
