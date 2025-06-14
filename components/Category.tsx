import { Dimensions, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import { Button, ScrollView, Text, View } from 'tamagui';




export type CategoryType = {
    id: string
    name: string
    category_type: 'food' | 'product'
}


const Category = ({ categories }: { categories: CategoryType[] }) => {
    const [activeCategory, setActiveCategory] = useState(categories[0]?.name);
    const scrollRef = useRef<ScrollView>(null);
    const buttonWidth = 100;
    const screenWidth = Dimensions.get('window').width;

    const scrollToCategory = (index: number) => {
        const offset = index * buttonWidth;
        const centerOffset = (screenWidth - buttonWidth);

        scrollRef.current?.scrollTo({
            x: Math.max(0, offset - centerOffset),
            animated: true
        });
    };
    return (
        <View height={'$5'} backgroundColor={'$background'}>
            <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 10,
                    gap: 5,
                    alignItems: 'center'
                }}
            >
                {categories.map((category, index) => (
                    <Button
                        key={category.id}
                        onPress={() => {
                            setActiveCategory(category.name);
                            scrollToCategory(index);
                        }}
                        backgroundColor={
                            activeCategory === category.name
                                ? '$transparentBtnPrimaryColor'
                                : '$profileCard'
                        }
                        color={
                            activeCategory === category.name
                                ? '$text'
                                : '$icon'
                        }
                        borderRadius="$10"
                        paddingHorizontal="$4"
                        height={'$3'}
                        pressStyle={{
                            scale: 0.97,
                            opacity: 0.9
                        }}
                    >
                        <Text
                            fontSize={14}
                            fontFamily="$body"
                        >
                            {category.name}
                        </Text>
                    </Button>
                ))}
            </ScrollView>
        </View>
    )
}

export default Category

const styles = StyleSheet.create({})