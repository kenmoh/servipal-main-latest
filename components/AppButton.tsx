import { ButtonProps, StyleSheet } from 'react-native'
import React from 'react'
import { Button } from 'tamagui'


interface BtnProps extends ButtonProps {
    title: string
}
const AppButton = ({ title }: BtnProps) => {
    return (
        <Button style={{
            fontFamily: 'Poppins-Medium',
            textTransform: 'uppercase'
        }} marginVertical={'$3'}
            alignSelf='center'
            backgroundColor={'$btnPrimaryColor'}
            pressStyle={{ backgroundColor: '$btnPrimaryColor' }}
            width={'90%'} >{title}</Button>
    )
}

export default AppButton

const styles = StyleSheet.create({})