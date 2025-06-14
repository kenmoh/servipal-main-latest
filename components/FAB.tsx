import { TouchableOpacity } from 'react-native'
import React, { useMemo } from 'react'
import { useTheme } from 'tamagui'
import { Send } from 'lucide-react-native'

const FAB = ({ onPress, icon, disabled }: { disabled?: boolean, icon?: React.ReactNode, onPress: () => void }) => {
    const theme = useTheme()

    // Memoize button style
    const fabStyle = useMemo(
        () => ({
            alignItems: "center" as const,
            justifyContent: "center" as const,
            height: 60,
            width: 60,
            borderRadius: 50,
            backgroundColor: theme.btnPrimaryColor?.val,
            position: "absolute" as const,
            bottom: 10,
            right: 10,
        }),
        [theme.btnPrimaryColor?.val]
    );
    return (
        <TouchableOpacity disabled={disabled} onPress={onPress} style={fabStyle}>
            {icon || <Send color={theme.text?.val} size={25} />}
        </TouchableOpacity>
    )
}

export default FAB
