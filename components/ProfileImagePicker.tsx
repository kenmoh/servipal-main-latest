import React, { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';
import { View, Image, useTheme } from 'tamagui';

interface CustomImagePickerProps {
  onImageSelect: (imageData: any) => void;
  initialImage?: string | null;
  width?: number;
  height?: number;
  borderRadius?: number;
  disabled?: boolean;
}

const ProfileImagePicker = ({
  borderRadius,
  onImageSelect,
  initialImage = null,
  width = 100,
  height = 100,
  disabled = false,
}: CustomImagePickerProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImage);
  const theme = useTheme();


  const openGallery = async () => {

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) handleImageSelection(result.assets[0]);
  };

  const handleImageSelection = (asset: ImagePicker.ImagePickerAsset) => {
    setSelectedImage(asset.uri);

    // Return data for React Query
    const imageData = {
      uri: asset.uri,
      type: asset.mimeType || 'image/jpeg',
      name: asset.fileName || `image_${Date.now()}.jpg`,
    };
    console.log(imageData)
    onImageSelect(imageData);
  };

  return (
    <TouchableOpacity

      style={{
        borderRadius: borderRadius,
        width,
        height,
        overflow: "hidden"
      }}
      onPress={openGallery}


    >
      {selectedImage ? (
        <Image
          source={{ uri: selectedImage }}
          width={width}
          height={height}
          objectFit="cover"
        />
      ) : (
        <View
          width={width}
          height={height}
          backgroundColor="$color3"
          borderColor="$borderColor"
          borderWidth={2}
          borderStyle="dashed"
          justifyContent="center"
          alignItems="center"
        >
          <Camera size={width * 0.3} color={theme.color?.val} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ProfileImagePicker;

