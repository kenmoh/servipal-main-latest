import React from 'react'
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
import { Text, View, YStack, useTheme } from 'tamagui'
import { router } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import Map from './Map'




interface DeliveryWrapperProps {
  children: React.ReactNode
}

const DeliveryWrapper = ({ children }: DeliveryWrapperProps) => {
  const theme = useTheme()
  const bottomSheetRef = React.useRef(null)

  return (


    <View backgroundColor={'$background'} flex={1}>
      <Map />
      <BottomSheet style={{ flex: 1 }} handleStyle={{ backgroundColor: theme.btnPrimaryColor.val }} snapPoints={['30%', '55%']} index={0} ref={bottomSheetRef}>
        <BottomSheetScrollView style={{ flex: 1, backgroundColor: theme.background.val }} >
          {children}
        </BottomSheetScrollView>

      </BottomSheet>
    </View>

  )
}

export default DeliveryWrapper

const styles = StyleSheet.create({})