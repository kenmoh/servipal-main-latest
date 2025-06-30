import React from 'react'
import { StyleSheet } from 'react-native'
import { View, useTheme } from 'tamagui'

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
      <BottomSheet handleIndicatorStyle={{ backgroundColor: 'white' }} style={{ flex: 1 }} handleStyle={{ backgroundColor: theme.background.val }} snapPoints={['40%', '50%']} index={0} ref={bottomSheetRef}>
        <BottomSheetScrollView style={{ flex: 1, backgroundColor: theme.background.val }} >
          {children}
        </BottomSheetScrollView>

      </BottomSheet>
    </View>

  )
}

export default DeliveryWrapper

const styles = StyleSheet.create({})