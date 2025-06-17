import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View } from 'react-native';
import { XStack, Text, YStack } from 'tamagui';
import { useTheme } from 'tamagui';
import AppModal from './AppModal';
import { ChevronDown } from 'lucide-react-native';

interface Category {
    id: string;
    name: string;
    category_type: string;
}

interface CategoryProps {
    categories: Category[];
    onCategorySelect: (categoryId: string | null) => void;
    selectedCategory: string | null;
}

const Category = ({ categories, onCategorySelect, selectedCategory }: CategoryProps) => {
    const theme = useTheme();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const categoryRefs = useRef<{ [key: string]: View | null }>({});

    // Get first 3 categories
    const displayedCategories = categories.slice(0, 2);

    const scrollToCategory = useCallback((categoryId: string | null) => {
        const ref = categoryId === null ? categoryRefs.current['all'] : categoryRefs.current[categoryId];
        if (ref && scrollViewRef.current) {
            ref.measure((x, y, width, height, pageX, pageY) => {
                scrollViewRef.current?.scrollTo({ x: Math.max(0, pageX - 20), animated: true });
            });
        }
    }, []);

    const handleCategoryPress = useCallback((categoryId: string | null) => {
        if (categoryId === 'more') {
            setIsModalVisible(true);
            return;
        }
        onCategorySelect(categoryId);
        scrollToCategory(categoryId);
    }, [onCategorySelect, scrollToCategory]);

    const handleModalCategorySelect = useCallback((categoryId: string) => {
        onCategorySelect(categoryId);
        setIsModalVisible(false);
        scrollToCategory(categoryId);
    }, [onCategorySelect, scrollToCategory]);

    const CategoryItem = ({ item, isSelected }: { item: Category; isSelected: boolean }) => (
        <View
            ref={ref => categoryRefs.current[item.id] = ref}
            collapsable={false}
        >
            <TouchableOpacity
                onPress={() => handleCategoryPress(item.id)}
                style={[
                    styles.categoryItem,
                    {
                        backgroundColor: isSelected ? theme.btnPrimaryColor?.val : theme.background.val,
                        borderColor: isSelected ? theme.btnPrimaryColor?.val : theme.borderColor.val,
                    },
                ]}
            >
                <Text
                    color={isSelected ? 'white' : theme.text.val}
                    fontSize={14}
                    fontWeight={isSelected ? '600' : '400'}
                >
                    {item.name}
                </Text>
            </TouchableOpacity>
        </View>
    );

    const ModalContent = () => (
        <YStack gap="$4" padding="$4">
            <Text fontSize={20} fontWeight="600" color={theme.text.val}>
                All Categories
            </Text>
            <View style={styles.modalCategoriesContainer}>
                {categories.map((item) => (
                    <View
                        key={item.id}
                        ref={ref => categoryRefs.current[item.id] = ref}
                        collapsable={false}
                    >
                        <TouchableOpacity
                            onPress={() => handleModalCategorySelect(item.id)}
                            style={[
                                styles.modalCategoryItem,
                                {
                                    backgroundColor: selectedCategory === item.id ? theme.btnPrimaryColor?.val : theme.background.val,
                                    borderColor: selectedCategory === item.id ? theme.btnPrimaryColor?.val : theme.borderColor.val,
                                },
                            ]}
                        >
                            <Text
                                color={selectedCategory === item.id ? 'white' : theme.text.val}
                                fontSize={14}
                                fontWeight={selectedCategory === item.id ? '600' : '400'}
                            >
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </YStack>
    );

    return (
        <YStack>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContainer, {backgroundColor: theme.background.val}]}
            >
                <View
                    ref={ref => categoryRefs.current['all'] = ref}
                    collapsable={false}
                >
                    <TouchableOpacity
                        onPress={() => handleCategoryPress(null)}
                        style={[
                            styles.categoryItem,
                            {
                                backgroundColor: selectedCategory === null ? theme.btnPrimaryColor?.val : theme.background.val,
                                borderColor: selectedCategory === null ? theme.btnPrimaryColor?.val : theme.borderColor.val,
                            },
                        ]}
                    >
                        <Text
                            color={selectedCategory === null ? 'white' : theme.text.val}
                            fontSize={14}
                            fontWeight={selectedCategory === null ? '600' : '400'}
                        >
                            All
                        </Text>
                    </TouchableOpacity>
                </View>

                {displayedCategories.map((category) => (
                    <CategoryItem
                        key={category.id}
                        item={category}
                        isSelected={selectedCategory === category.id}
                    />
                ))}

                <View
                    ref={ref => categoryRefs.current['more'] = ref}
                    collapsable={false}
                >
                    <TouchableOpacity
                        onPress={() => handleCategoryPress('more')}
                        style={[
                            styles.categoryItem,
                            {
                                backgroundColor: theme.background.val,
                                borderColor: theme.borderColor.val,
                            },
                        ]}
                    >
                        <XStack gap="$1" alignItems="center">
                            <Text color={theme.text.val} fontSize={14}>
                                More
                            </Text>
                            <ChevronDown size={16} color={theme.text.val} />
                        </XStack>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <AppModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
            >
                <ModalContent />
            </AppModal>
        </YStack>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 8,
    },
    categoryItem: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 8,
    },
    modalCategoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    modalCategoryItem: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 8,
    },
});

export default Category;