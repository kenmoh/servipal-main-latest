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
    { id: "food", name: "Food" },
    { id: "laundry", name: "Laundry" },
    // { id: "package", name: "Package" },
    // { id: "product", name: "Product" }
];

const schema = z.object({
    name: z.string().min(1, "Name is a required field"),
    price: z.number().int().gt(0, "Price MUST be greater than 0").lte(999999),
    description: z.string().min(1, "Ingredients is a required field"),
    category_id: z.string({ message: "Category is a required field" }),
    itemType: itemTypeEnum,
    side: z.string().optional(),
    images: z.array(z.any()).nonempty({
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
            description: "",
            price: 0,
            images: [],
            category_id: "",
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
        select: (categories) => categories?.filter(category => category.category_type === "food") || []

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

            queryClient.invalidateQueries({ queryKey: ['storeItems', user?.sub] })
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ['restaurants'] })

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
        itemMutate({
            ...data,
            images: data.images ?? [],
        });
    };

    return (
        <>
            <ScrollView backgroundColor={"$background"} flex={1} showsVerticalScrollIndicator={false}>
                {/*    <Button
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
                </Button>*/}

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
                                        label="Item Type"
                                        items={itemTypeOptions}
                                        onValueChange={(val) => {
                                            onChange(val);
                                            setSelectedItemType(val);
                                            // Reset category and side if not food
                                            if (val !== "food") {
                                                reset({
                                                    ...control._formValues,
                                                    category_id: "",
                                                    side: "",
                                                });
                                            }
                                        }}
                                        value={value}
                                        placeholder="Select Item Type"
                                    />
                                )}
                            />

                        </View>


                    </XStack>

                    {selectedItemType !== "laundry" && (
                        <>
                            <Controller
                                control={control}
                                name="category_id"
                                render={({ field: { onChange, value } }) => (
                                    <AppPicker
                                        label="Category"
                                        items={categories ?? []}
                                        onValueChange={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="description"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <AppTextInput
                                        label="Ingredients"
                                        placeholder="Ingredients"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        errorMessage={errors.description?.message}
                                    />
                                )}
                            />
                        </>
                    )}
                    {selectedItemType === "food" && (
                        <Controller
                            control={control}
                            name="side"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <AppTextInput
                                    label="Side"
                                    placeholder="Side"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.side?.message}
                                />
                            )}
                        />
                    )}

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
