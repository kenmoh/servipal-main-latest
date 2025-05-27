
import { Button } from 'tamagui'
import { Store } from 'lucide-react-native'

const AddItemBtn = ({ onPress, isDisabled = false, label = 'Add Menu' }: { label?: string, isDisabled?: boolean, onPress: () => void }) => {

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
            height={'$2.5'}
            backgroundColor={'$transparentBtnPrimaryColor'}
            icon={<Store color={'white'} />}>{label}</Button>
    )
}

export default AddItemBtn
