import { KeyboardTypeOptions, TextInputProps, TouchableOpacity } from 'react-native'
import { Input, YStack, Label, useTheme, Paragraph, XStack } from 'tamagui'
import { Eye, EyeOff } from 'lucide-react-native'
import { useState } from 'react'

interface InputProp extends TextInputProps {
    label?: string,
    height?: string
    value?: string
    errorMessage?: string
    borderRadius?: number
    onPressIn?: () => void;
    showPasswordToggle?: boolean;
}
const AppTextInput = ({ label, value, onPressIn, placeholder, onBlur, onChangeText, errorMessage, borderRadius = 10, height = '$5', keyboardType = 'default', editable = true, secureTextEntry = false, showPasswordToggle = false }: InputProp) => {
    const [showPassword, setShowPassword] = useState(false);
    const theme = useTheme();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const shouldShowToggle = showPasswordToggle && secureTextEntry;
    const isPasswordVisible = shouldShowToggle ? showPassword : false;

    return (
        <YStack marginVertical={label ? 0 : '$2'} width={'90%'} justifyContent='center' alignItems='center' alignSelf='center'>
            {label && <Label color={'$text'} fontWeight={'600'} fontFamily={'$body'} alignSelf='flex-start'>{label}</Label>}
            <XStack width={'100%'} position="relative" alignItems="center">
                <Input
                    editable={editable}
                    value={value}
                    onPressIn={onPressIn}
                    height={height}
                    backgroundColor={'$cardDark'}
                    borderRadius={borderRadius}
                    width={'100%'}
                    borderWidth={0}
                    keyboardType={keyboardType}
                    secureTextEntry={shouldShowToggle ? !isPasswordVisible : false}
                    fontSize={15}
                    onBlur={onBlur}
                    onChangeText={onChangeText}
                    fontFamily={'$mono'}
                    placeholder={placeholder}
                    placeholderTextColor={'#aaa'}
                    color={'$text'}
                    focusStyle={{
                        borderColor: '$btnPrimaryColor',
                        borderWidth: '$0.5'
                    }}
                />
                {shouldShowToggle && (
                    <TouchableOpacity
                        onPress={togglePasswordVisibility}
                        style={{
                            position: 'absolute',
                            right: 15,
                            padding: 5,
                        }}
                    >
                        {showPassword ? (
                            <EyeOff size={20} color={theme.text.val} />
                        ) : (
                            <Eye size={20} color={theme.text.val} />
                        )}
                    </TouchableOpacity>
                )}
            </XStack>
            {errorMessage && <Paragraph alignSelf='flex-start' style={{ fontSize: 11 }} color={'$error'}>{errorMessage}</Paragraph>}
        </YStack>
    )
}

export default AppTextInput