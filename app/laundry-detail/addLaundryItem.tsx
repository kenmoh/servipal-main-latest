import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { ScrollView, View, Button, Text, XStack } from "tamagui";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import AppTextInput from "@/components/AppInput";
import ImagePickerInput from "@/components/AppImagePicker";
import AppPicker from "@/components/AppPicker";
import AppModal from "@/components/AppModal";
import { createCategory, createItem, fetchCategories } from "@/api/item";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Notifier, NotifierComponents } from "react-native-notifier";
import LoadingIndicator from "@/components/LoadingIndicator";
import { queryClient } from "../_layout";
import { useAuth } from '@/context/authContext'

const itemTypeEnum = z.enum(["food", "package", "product", "laundry"]);

const itemTypeOptions = [

    { id: "laundry", name: "Laundry" },

];

const schema = z.object({
    name: z.string().min(1, "Name is a required field"),
    price: z.number().int().gt(0, "Price MUST be greater than 0").lte(999999),
    itemType: itemTypeEnum,

    images: z.array(z.any()).nonempty({
        message: "Image is required",
    }),
});



type FormData = z.infer<typeof schema>;

const adLaundryItem = () => {
    const [visble, setVisble] = useState(false);
    const [selectedItemType, setSelectedItemType] = useState<string>("food");
    const { user } = useAuth()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onBlur",
        defaultValues: {
            name: "",
            price: 0,
            images: [],
            itemType: "laundry",
        },
    });


    const { mutate: itemMutate, isPending: isCreating } = useMutation({
        mutationFn: createItem,
        onSuccess: (data) => {
            Notifier.showNotification({
                title: "Success",
                description: "Item created successfully",
                Component: NotifierComponents.Alert,
                duration: 1000,
                componentProps: {
                    alertType: "success",
                },
            });
            reset();
            queryClient.invalidateQueries({ queryKey: ["laundryItems", user?.sub] });
            return;
        },
        onError: (error) => {
            Notifier.showNotification({
                title: "Error",
                description: `${error.message}`,
                Component: NotifierComponents.Alert,
                componentProps: {
                    alertType: "error",
                },
            });
        },
    });

    const onSubmit = (data: FormData) => {
        itemMutate({
            ...data,
            images: data.images ?? [],
        });
    };

    return (
        <>
            <ScrollView backgroundColor={"$background"} flex={1} showsVerticalScrollIndicator={false}>
                <View marginTop={"$3"} marginBottom={"$12"}>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AppTextInput
                                placeholder="Name"
                                label="Name"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />
                        )}
                    />
                    <XStack alignSelf="center" gap={5} justifyContent="center" alignItems="center">

                        <View width={'47.5%'}>
                            <Controller
                                control={control}
                                name="price"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <AppTextInput
                                        placeholder="Price"
                                        label="Price"
                                        onBlur={onBlur}
                                        onChangeText={(text) => onChange(Number(text))}
                                        value={value?.toString()}
                                        keyboardType="numeric"
                                        errorMessage={errors.price?.message}
                                    />
                                )}
                            />
                        </View>
                        <View width={'47.5%'}>
                            <Controller
                                control={control}
                                name="itemType"
                                render={({ field: { onChange, value } }) => (
                                    <AppPicker
                                        isBank={true}
                                        enabled={false}
                                        label="Item Type"
                                        onValueChange={onChange}
                                        items={itemTypeOptions}
                                        value={value}
                                    />
                                )}
                            />

                        </View>


                    </XStack>

                    <Controller
                        control={control}
                        name="images"
                        render={({ field: { onChange, value } }) => (
                            <ImagePickerInput
                                value={value && value.length > 0 ? value[0] : null}
                                onChange={(image) => onChange(image ? [image] : [])}
                                errorMessage={errors.images?.message?.toString()}
                            />
                        )}
                    />
                    <Button
                        style={{
                            fontFamily: "Poppins-Medium",
                            textTransform: "uppercase",
                        }}
                        marginVertical={"$3"}
                        disabled={isCreating}
                        alignSelf="center"
                        backgroundColor={isCreating ? "$cardDark" : "$btnPrimaryColor"}
                        width={"90%"}
                        onPress={handleSubmit(onSubmit)}
                    >
                        {isCreating ? <LoadingIndicator /> : "Submit"}
                    </Button>
                </View>
            </ScrollView>

        </>
    );
};

export default adLaundryItem;

const styles = StyleSheet.create({});
