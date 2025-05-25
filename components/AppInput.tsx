import { KeyboardTypeOptions, TextInputProps } from 'react-native'
import { Input, YStack, Label, useTheme, Paragraph } from 'tamagui'

interface InputProp extends TextInputProps {
    label?: string,
    height?: string
    value?: string
    errorMessage?: string
    borderRadius?: number
    onPressIn?: () => void;
}
const AppTextInput = ({ label, value, onPressIn, placeholder, onBlur, onChangeText, errorMessage, borderRadius = 10, height = '$5', keyboardType = 'default', editable = true, secureTextEntry = false }: InputProp) => {

    return (
        <YStack marginVertical={label ? 0 : '$2'} width={'90%'} justifyContent='center' alignItems='center' alignSelf='center'>
            {label && <Label color={'$text'} fontWeight={'600'} fontFamily={'$body'} alignSelf='flex-start'>{label}</Label>}
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
                secureTextEntry={secureTextEntry}
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
            {errorMessage && <Paragraph alignSelf='flex-start' style={{ fontSize: 11 }} color={'$error'}>{errorMessage}</Paragraph>}
        </YStack>
    )
}


export default AppTextInput