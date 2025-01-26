import { KeyboardTypeOptions } from 'react-native'
import { Input, YStack, Label, useTheme } from 'tamagui'

type InputProp = {
    label?: string,
    keyboardType?: KeyboardTypeOptions
    secureTextEntry?: boolean
    placeholder?: string

}
const AppTextInput = ({ label, placeholder, keyboardType = 'default', secureTextEntry = false }: InputProp) => {
    const theme = useTheme()
    return (
        <YStack width={'90%'} justifyContent='center' alignItems='center'>
            {label && <Label color={'$text'} fontWeight={'600'} fontFamily={'$body'} alignSelf='flex-start'>{label}</Label>}
            <Input
                height={'$5'}
                backgroundColor={'$inputBackground'}
                borderRadius={10}
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
        </YStack>
    )
}


export default AppTextInput