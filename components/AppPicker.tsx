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
    selectedValue?: string;
    enabled?: boolean,
    width?: string;
    onValueChange: (val: string) => void;
};
const AppPicker = ({
    label,
    items,
    value,
    selectedValue,
    placeholder,
    onValueChange,
    isBank = false,
    enabled = true,
    width = '90%'
}: PickerProps) => {
    const theme = useTheme();
    return (
        <View
            width={width}
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
                    enabled={enabled}
                    selectedValue={value || selectedValue}
                    onValueChange={(itemValue) => onValueChange(itemValue)}
                >
                    <Picker.Item
                        key="default"
                        color={theme.text.val}
                        style={{ backgroundColor: theme.cardDark.val }}
                        label={placeholder || "Select"}
                        value=""
                    />
                    {items?.map((item) => {
                        const itemKey = isBank ? `${item.code}` : `${item.id}`;
                        const itemValue = isBank ? itemKey : item.id

                        return (
                            <Picker.Item

                                key={itemKey}
                                color={theme.text.val}
                                style={{ backgroundColor: theme.cardDark.val }}
                                label={item?.name}
                                value={itemValue}
                            />
                        );
                    })}
                </Picker>
            </View>
        </View>
    );
};

export default AppPicker;

const styles = StyleSheet.create({});
