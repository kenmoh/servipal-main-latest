import { StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import {
    ScrollView,
    View,
    Button,
    Text,
    Square,
    YStack,
    Circle,
    useTheme
} from "tamagui";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Notifier, NotifierComponents } from "react-native-notifier";
import AppTextInput from "@/components/AppInput";
import ImagePickerInput from "@/components/AppImagePicker";
import { Trash, Plus } from "lucide-react-native";
import AppColorPicker from "@/components/AppColorPicker";
import AppPicker from "@/components/AppPicker";
import { createMenuItem, fetchCategories } from "@/api/item";
import LoadingIndicator from "@/components/LoadingIndicator";

const itemTypeEnum = z.enum(["food", "package", "product", "laundry"]);

const schema = z.object({
    name: z.string().min(1, "Name is a required field"),
    category_id: z.string({ message: "Category is a required field" }),
    itemType: itemTypeEnum,
    price: z.coerce
        .number()
        .int()
        .gt(0, "Price MUST be greater than 0")
        .lte(999999),
    stock: z.coerce
        .number()
        .int()
        .gt(0, "Stock MUST be greater than 0")
        .lte(999999),
    description: z.string().min(1, "Description is a required field"),
    colors: z.array(z.string()).optional(),
    sizes: z.string().optional(),
    images: z.array(z.string()).nonempty("At least one image is required"),
});


const itemTypeOptions = [

    { id: "product", name: "Product" },

];

type FormData = z.infer<typeof schema>;

const addMenu = () => {
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const theme = useTheme()
    const queryClient = useQueryClient();

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onBlur",
        defaultValues: {
            name: "",
            description: "",
            // price: 0,
            images: [],
            colors: [],
            sizes: "",
            // stock: 0,
            itemType: "product",
            category_id: "",
        },
    });

    const {
        fields: imageFields,
        append: appendImage,
        remove: removeImage,
    } = useFieldArray<FormData>({
        control,
        name: "images",
    });

    // Function to remove a color by its index
    const removeColorByIndex = (index: number) => {
        setSelectedColors((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        setValue("colors", selectedColors);
    }, [selectedColors, setValue]);


    const { data } = useQuery({
        queryKey: ["product-categories"],
        queryFn: fetchCategories,
        select: (categories) => categories?.filter(category => category.category_type === "product") || []

    });


    const { mutate, isPending } = useMutation({
        mutationFn: createMenuItem,
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
        console.log(data)
        mutate(data)


    };


    return (
        <ScrollView
            backgroundColor={"$background"}
            flex={1}
            showsVerticalScrollIndicator={false}
        >
            <View marginTop={"$5"}>
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            label='Name'
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
                            label="Price"
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
                    name="stock"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            label='In stock'
                            placeholder="Stock"
                            onBlur={onBlur}
                            onChangeText={(text) => onChange(Number(text))}
                            value={value?.toString()}
                            keyboardType="numeric"
                            errorMessage={errors.stock?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            label='Description'
                            placeholder="Description."
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.description?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="sizes"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            label='Sizes'
                            placeholder="Sizes (comma separated)."
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.sizes?.message}
                        />
                    )}
                />


                <View display="none">

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
                <Controller
                    control={control}
                    name="category_id"
                    render={({ field: { onChange, value } }) => (
                        <AppPicker
                            label="Category"
                            items={data ?? []}
                            onValueChange={onChange}
                            value={value}
                        />
                    )}
                />

                <View width={"100%"} alignSelf={"center"}>
                    {/* Render each selected color as a circle with an optional remove button */}
                    <View
                        width={"90%"}
                        alignSelf={"center"}
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 8,
                            marginBottom: 16,
                        }}
                    >
                        {selectedColors.map((field, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => removeColorByIndex(index)}
                            >
                                <Circle size={30} backgroundColor={field}>
                                    <Trash color="white" size={15} />
                                </Circle>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Render the color picker button if fewer than 4 colors are selected */}
                    {selectedColors.length < 6 && (
                        <AppColorPicker
                            onSelectColor={(color) =>
                                setSelectedColors((prev) => [...prev, color])
                            }
                        />
                    )}
                </View>

                {/* Image URLs Section */}
                <View>
                    {imageFields.map((field, index) => (
                        <View key={field.id}>
                            <Controller
                                control={control}
                                name={`images.${index}`}
                                render={({ field: { onChange, value } }) => (
                                    <ImagePickerInput
                                        iconSize={40}
                                        value={value}
                                        //onChange={onChange}
                                        onChange={(newImageUri) => onChange(newImageUri)}
                                        errorMessage={errors.images?.message?.toString()}
                                    />
                                )}
                            />

                            {imageFields.length > 1 && (
                                <Button
                                    size={"$3"}
                                    pressStyle={{ backgroundColor: "red" }}
                                    backgroundColor={"$error"}
                                    circular
                                    position={"absolute"}
                                    right={25}
                                    top={20}
                                    icon={<Trash />}
                                    onPress={() => removeImage(index)}
                                />
                            )}
                        </View>
                    ))}
                    {imageFields.length < 4 && (
                        <YStack width={"90%"} alignSelf={"center"}>
                            <Button
                                backgroundColor={"$cardDark"}
                                width={"100%"}
                                alignSelf={"center"}
                                icon={<Plus />}
                                onPress={() => appendImage("")}
                            >
                                Add Image
                            </Button>
                            {imageFields.length === 0 && (
                                <Text
                                    color={"$error"}
                                    marginTop={3}
                                    style={{ fontFamily: "Poppins-Thin", fontSize: 11 }}
                                >
                                    {errors?.images?.message}
                                </Text>
                            )}
                        </YStack>
                    )}
                </View>

                <Button
                    style={{
                        fontFamily: "Poppins-Medium",
                        textTransform: "uppercase",
                    }}
                    marginVertical={"$3"}
                    alignSelf="center"
                    backgroundColor={"$btnPrimaryColor"}
                    width={"90%"}
                    onPress={handleSubmit(onSubmit)}
                >
                    {isPending ? <ActivityIndicator size={30} color={theme.text.val} /> : 'Submit'}
                </Button>
            </View>
        </ScrollView>
    );
};

export default addMenu;

const styles = StyleSheet.create({});
