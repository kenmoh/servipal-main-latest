import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Toast, useToastState } from '@tamagui/toast'

const AppToast = () => {
    const currentToast = useToastState()

    if (!currentToast || currentToast.isHandledNatively) return null
    return (
        <Toast
            key={currentToast.id}
            duration={currentToast.duration}
            enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
            exitStyle={{ opacity: 0, scale: 1, y: -20 }}
            y={0}
            opacity={1}
            scale={1}
            animation="100ms"
            viewportName={currentToast.viewportName}
        >
            <Toast.Description>{currentToast.message}</Toast.Description>

        </Toast>
    )
}

export default AppToast

const styles = StyleSheet.create({})