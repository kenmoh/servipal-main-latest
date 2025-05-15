import { StyleSheet } from "react-native"
import { View } from "tamagui"


const HDivider = ({ width = '95%' }: { width?: string }) => {


    return (
        <View width={width}
            backgroundColor={'$inputBackground'}
            alignSelf="center"
            style={{ height: StyleSheet.hairlineWidth }} />

    )
}

export default HDivider

