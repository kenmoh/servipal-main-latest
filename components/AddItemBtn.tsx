
import { Button } from 'tamagui'
import { Store } from 'lucide-react-native'

const AddItemBtn = ({ onPress, icon, isDisabled = false, label = 'Add Menu' }: { label?: string, isDisabled?: boolean, icon?: React.ReactNode, onPress: () => void }) => {

    return (
        <Button
            pressStyle={{
                backgroundColor: '$transparentBtnPrimaryColor'
            }}
            disabled={isDisabled}
            onPressIn={onPress}
            marginRight={'$2.5'}
            alignSelf='flex-end'
            borderRadius={'$10'}
            height={'$3.5'}
            backgroundColor={'$transparentBtnPrimaryColor'}
        >
            {icon}
            {label}</Button>
    )
}

export default AddItemBtn
