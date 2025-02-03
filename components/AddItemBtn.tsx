
import { Button } from 'tamagui'
import { Plus } from 'lucide-react-native'

const AddItemBtn = ({ onPress, label = 'Add Menu' }: { label?: string, onPress: () => void }) => {

    return (
        <Button
            pressStyle={{
                backgroundColor: '$transparentBtnPrimaryColor'
            }}
            onPressIn={onPress}
            marginRight={'$2.5'}
            alignSelf='flex-end'
            borderRadius={'$10'}
            backgroundColor={'$transparentBtnPrimaryColor'}
            icon={<Plus color={'white'} />}>{label}</Button>
    )
}

export default AddItemBtn
