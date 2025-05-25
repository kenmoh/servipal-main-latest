// AppColorPicker.tsx
import React, { useState } from "react";
import { Modal } from "react-native";
import { Button, View, YStack } from "tamagui";
import ColorPicker, {
  Panel1,
  Preview,
  HueSlider,
  returnedResults,
} from "reanimated-color-picker";

interface PickerProp {
  onSelectColor: (hex: string) => void;
}

export default function AppColorPicker({ onSelectColor }: PickerProp) {
  // Local state to control modal visibility and selected color.
  const [showModal, setShowModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("#ffffff");

  return (
    <>
      {/* This button opens the color picker modal */}
      <Button
        width="90%"
        backgroundColor="$cardDark"
        alignSelf="center"
        marginVertical="$3"
        onPress={() => setShowModal(true)}
      >
        Color Picker
      </Button>

      <Modal visible={showModal} animationType="slide">
        <YStack
          flex={1}
          alignItems="center"
          justifyContent="center"
          backgroundColor="$background"
        >
          <ColorPicker
            style={{ width: "70%", height: 300 }}
            initialColor={selectedColor}
            // value={selectedColor} Use the current selected color
            onComplete={(result: returnedResults) => {
              setSelectedColor(result.hex);
            }}
          >
            <Preview />
            <Panel1 />
            <HueSlider />
          </ColorPicker>
          <Button
            marginTop="$3"
            backgroundColor="$btnPrimaryColor"
            onPress={() => {
              onSelectColor(selectedColor);
              setShowModal(false);
            }}
          >
            Done
          </Button>
        </YStack>
      </Modal>
    </>
  );
}
