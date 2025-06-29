import { View, Button, YStack } from 'tamagui'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import GoogleTextInput from "@/components/GoogleTextInput"
import { useLocationStore } from '@/store/locationStore'
import { useRouter } from 'expo-router'
import CurrentLocationButton from '@/components/CurrentLocationButton'

const SendItem = () => {
  const {
    origin,
    destination,
    setOrigin,
    setDestination
  } = useLocationStore()
  const [errors, setErrors] = useState({ origin: '', destination: '' })
  const [isDisabled, setIsDisabled] = useState(false)

  const router = useRouter()

  const handleNext = () => {

    // Reset errors
    setErrors({ origin: '', destination: '' })
    setIsDisabled(false)

    // Validate inputs
    if (!origin) {
      setErrors(prev => ({ ...prev, origin: 'Pickup location is required' }))
      setIsDisabled(true)
      return
    }
    if (!destination) {
      setErrors(prev => ({ ...prev, destination: 'Dropoff location is required' }))
      setIsDisabled(true)

      return
    }


    router.push('/delivery/itemInfo')
  }

  useEffect(() => {
    if (origin && destination) {
      setIsDisabled(false)
    } else {
      setIsDisabled(true)
    }
  }, [origin, destination])

  return (
     <KeyboardAvoidingView
      behavior={"padding"}
      keyboardVerticalOffset={100}
      style={{  flex: 1,maxHeight: 600,}}
    >
    <View backgroundColor={'$background'} flex={1}>
      <YStack marginTop={'$5'} gap={25}>
        <CurrentLocationButton
          onLocationSet={(address, coords) => {
            setOrigin(address, coords)
            setErrors(prev => ({ ...prev, origin: '' }))
            setIsDisabled(false)
          }}
        />
        <GoogleTextInput
          placeholder="Pickup Location"
          errorMessage={errors.origin}
          value={origin}
          onChangeText={() => { }}
          handlePress={(lat, lng, address) => {
            setOrigin(address, [lat, lng])
            setErrors(prev => ({ ...prev, origin: '' }))
            setIsDisabled(false)
          }}

        />

        <GoogleTextInput
          placeholder="Dropoff Location"
          value={destination}
          errorMessage={errors.destination}
          onChangeText={() => { }}
          handlePress={(lat, lng, address) => {
            setDestination(address, [lat, lng])
            setErrors(prev => ({ ...prev, destination: '' }))
            setIsDisabled(false)
          }}
        />
      </YStack>

      <Button
        disabled={isDisabled}
        onPress={handleNext}
        position="absolute"
        bottom={2}
        alignSelf="center"
        width="90%"
        backgroundColor={isDisabled ? 'transparent' : '$btnPrimaryColor'}
      >
        Next
      </Button>
    </View>
     </KeyboardAvoidingView>
  )
}

export default SendItem

