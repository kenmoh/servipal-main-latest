import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Text, useTheme } from 'tamagui';
import { useRef, useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';

interface GoogleTextInputProps {
  placeholder: string;
  handlePress: (lat: number, lng: number, address: string) => void;
  value: ControllerRenderProps<any, any>['value'];
  onChangeText: ControllerRenderProps<any, any>['onChange'];
  errorMessage?: string;
}

const GoogleTextInput = ({ placeholder, handlePress, onChangeText, errorMessage }: GoogleTextInputProps) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<any>(null);

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        ref={ref}
        placeholder={placeholder}
        fetchDetails={true}
        debounce={300}
        enablePoweredByContainer={false}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY,
          language: 'en',
          components: 'country:ng',
        }}
        onPress={(data, details = null) => {
          const address = data.description;
          if (details?.geometry?.location) {
            const { lat, lng } = details.geometry.location;
            onChangeText(address);
            ref.current?.setAddressText(address);
            handlePress(lat, lng, address);
          }
        }}
        textInputProps={{
          placeholderTextColor: theme.gray11.val,
          onFocus: () => setIsFocused(true),
          onBlur: () => setIsFocused(false),
        }}
        styles={{
          container: {
            flex: 0,
            width: '100%',
            zIndex: 1,
          },
          textInput: {
            height: 50,
            backgroundColor: theme.cardDark.val,
            borderRadius: 12,
            paddingHorizontal: 15,
            fontSize: 14,
            color: theme.text.val,
            fontFamily: 'Poppins-Regular',
            // borderColor: isFocused ? theme.btnPrimaryColor.val : 'transparent',
            borderWidth: 1,
            borderColor: errorMessage
              ? theme.red10.val
              : isFocused
                ? theme.btnPrimaryColor.val
                : 'transparent',
          },
          listView: {
            backgroundColor: theme.cardDark.val,
            borderRadius: 12,
            marginTop: 0,
          },
          row: {
            backgroundColor: theme.cardDark.val,
            padding: 13,
            height: 50,
            flexDirection: 'row',
          },
          separator: {
            height: 0.5,
            width: '95%',
            alignSelf: 'center',
            backgroundColor: theme.gray1.val,
          },
          description: {
            color: theme.text.val,
            fontSize: 11,
            fontFamily: 'Poppins-Regular',
          },
        }}
      />
      {errorMessage && (
        <Text color={'$red10'}>
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '90%',
    alignSelf: 'center',
    zIndex: 1,
  },
});

export default GoogleTextInput;

