import { KeyboardTypeOptions, TextInputProps } from 'react-native'
import { Input, YStack, Label, useTheme, Paragraph } from 'tamagui'

interface InputProp extends TextInputProps {
    label?: string,
    keyboardType?: KeyboardTypeOptions
    secureTextEntry?: boolean
    placeholder?: string
    height?: string
    errorMessage?: string
    borderRadius?: number


}
const AppTextInput = ({ label, placeholder, errorMessage, borderRadius = 10, height = '$5', keyboardType = 'default', secureTextEntry = false }: InputProp) => {

    return (
        <YStack marginVertical={label ? 0 : '$2'} width={'90%'} justifyContent='center' alignItems='center' alignSelf='center'>
            {label && <Label color={'$text'} fontWeight={'600'} fontFamily={'$body'} alignSelf='flex-start'>{label}</Label>}
            <Input
                height={height}
                backgroundColor={'$cardDark'}
                borderRadius={borderRadius}
                width={'100%'}
                borderWidth={0}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                fontSize={15}
                fontFamily={'$mono'}
                placeholder={placeholder}
                placeholderTextColor={'#aaa'}
                color={'$text'}
                focusStyle={{
                    borderColor: '$btnPrimaryColor',
                    borderWidth: '$0.5'
                }}

            />
            {errorMessage && <Paragraph alignSelf='flex-start' fontSize={'$1'} color={'$error'}>{errorMessage}</Paragraph>}
        </YStack>
    )
}


export default AppTextInput