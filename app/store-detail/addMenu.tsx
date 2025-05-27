import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { ScrollView, View, Button, Text } from "tamagui";
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
import { router } from "expo-router";
import { Plug, Plus } from "lucide-react-native";
import LoadingIndicator from "@/components/LoadingIndicator";

const itemTypeEnum = z.enum(["food", "package", "product", "laundry"]);

const schema = z.object({
    name: z.string().min(1, "Name is a required field"),
    price: z.number().int().gt(0, "Price MUST be greater than 0").lte(999999),
    description: z.string().min(1, "Ingredients is a required field"),
    category: z.string({ message: "Category is a required field" }),
    itemType: itemTypeEnum,
    side: z.string().optional(),
    images: z
        .any()
        .nullable()
        .refine((val) => val != null, {
            message: "Image is required",
        }),
});

const categorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

type FormData = z.infer<typeof schema>;



const addMenu = () => {
    const [visble, setVisble] = useState(false);

    const queryClient = useQueryClient();

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
            description: "",
            price: 0,
            images: [],
            category: "",
            side: "",
            itemType: "food",
        },
    });

    const {
        control: categoryControl,
        handleSubmit: handleCategorySubmit,
        formState: { errors: categoryErrors },
        reset: resetCategoryForm,
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: { name: "" },
    });

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        staleTime: 1000 * 60 * 10

    });

    const { mutate, isPending } = useMutation({
        mutationFn: createCategory,
        onSuccess: (data) => {
            Notifier.showNotification({
                title: "Success",
                description: "Category created successfully",
                Component: NotifierComponents.Alert,
                duration: 1000,
                componentProps: {
                    alertType: "success",
                },
            });
            setVisble(false);
            resetCategoryForm();
            queryClient.invalidateQueries({ queryKey: ["categories"] });
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
    const { mutate: itemMutate, isPending: isCreating } = useMutation({
        mutationFn: createItem,
        onSuccess: (data) => {

            console.log(data)
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
            queryClient.invalidateQueries({ queryKey: ["items"] });
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
        console.log(data);
        itemMutate({
            ...data,
            images: data.images ?? [],
        });
    };


    return (
        <>
            <ScrollView backgroundColor={"$background"} flex={1}>
                <Button
                    borderRadius={"$10"}
                    variant="outlined"
                    marginRight={"$4"}
                    onPress={() => setVisble(true)}
                    alignSelf="flex-end"
                    width={"50%"}
                    height={"$3"}

                >
                    <Plus size={20} color={"white"} />
                    Add Category
                </Button>

                <View marginTop={"$3"} marginBottom={'$12'}>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AppTextInput
                                placeholder="Name"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="price"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AppTextInput
                                placeholder="Price"
                                onBlur={onBlur}
                                onChangeText={(text) => onChange(Number(text))}
                                value={value?.toString()}
                                keyboardType="numeric"
                                errorMessage={errors.price?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AppTextInput
                                placeholder="Ingredients"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.description?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="category"
                        render={({ field: { onChange, value } }) => (
                            <AppPicker
                                items={categories ?? []}
                                onValueChange={onChange}
                                value={value}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="side"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AppTextInput
                                placeholder="Side"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.side?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="images"
                        render={({ field: { onChange, value } }) => (
                            <ImagePickerInput
                                value={value}
                                onChange={onChange}
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
                        {isCreating ? <LoadingIndicator /> :
                            'Submit'}
                    </Button>
                </View>
            </ScrollView>
            <AppModal visible={visble} onClose={() => setVisble(false)}>
                <Text style={{ fontFamily: "Poppins-Medium" }}>Add New Category</Text>
                <Controller
                    control={categoryControl}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            placeholder="Category"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            errorMessage={categoryErrors.name?.message}
                        />
                    )}
                />

                <Button
                    style={{
                        fontFamily: "Poppins-Medium",
                        textTransform: "uppercase",
                    }}
                    marginVertical={"$3"}
                    disabled={isPending}
                    alignSelf="center"
                    backgroundColor={isPending ? "$cardDark" : "$btnPrimaryColor"}
                    width={"90%"}
                    onPress={handleCategorySubmit((data) => {
                        mutate(data);
                    })}
                >
                    {isPending ? <LoadingIndicator /> : "Add Category"}
                </Button>
            </AppModal>
        </>
    );
};

export default addMenu;

const styles = StyleSheet.create({});
