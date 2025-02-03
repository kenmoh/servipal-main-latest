import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Image, View, Text, useTheme } from 'tamagui';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';

export type ImageType = {
    uri: string;
    type: string;
    name: string;
}

interface ImagePickerInputProps {
    value: ImageType | null;
    onChange: (image: ImageType | null) => void;
    errorMessage?: string;
    imageHeight?: number;
}

const ImagePickerInput = ({
    value,
    onChange,
    errorMessage,
    imageHeight = 200
}: ImagePickerInputProps) => {

    const theme = useTheme()
    const pickImage = async () => {


        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });


        if (!result.canceled) {
            const imageData: ImageType = {
                uri: result.assets[0].uri,
                type: 'image/jpeg',
                name: result.assets[0].uri.split('/').pop() || 'image.jpg'
            };

            onChange(imageData);
        }
    };

    return (
        <TouchableOpacity onPress={pickImage}>

            <View width={'95%'} borderColor={'$gray1'} padding="$3" alignSelf='center' alignItems="center">
                {/* Preview Image or Placeholder */}
                {value?.uri ? (
                    <Image
                        source={{ uri: value.uri }}
                        style={{
                            width: '100%',
                            height: imageHeight,
                            borderRadius: 10,
                            marginBottom: 10
                        }}
                    />
                ) : (
                    <View
                        width={'100%'}
                        height={imageHeight}
                        backgroundColor="$cardDark"
                        borderRadius={10}
                        marginBottom={10}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Camera color={theme.icon.val} size={50} />
                    </View>
                )}


                {/* Error Message */}
                {errorMessage && (
                    <Text alignSelf='flex-start' color="$error" marginTop="$2" style={{fontFamily: 'Poppins-Thin', fontSize: 11}}>
                        {errorMessage}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default ImagePickerInput;
