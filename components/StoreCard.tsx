import { CompanyProfile } from '@/types/user-types'
import { AntDesign } from '@expo/vector-icons'
import { router } from 'expo-router'
import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { Card, Paragraph, Image, YStack, XStack, useTheme, View } from 'tamagui'

const IMAGET_HEIGHT = Dimensions.get('window').height * 0.16


const StoreCard = ({ item }: { item: CompanyProfile }) => {
    const theme = useTheme()
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push({
                pathname: '/(app)/food/[storeId]',
                params: {
                    storeId: item?.id,
                    companyName: item?.company_name,
                    backDrop: item?.backdrop_image_url,
                    openingHour: item?.opening_hour,
                    closingHour: item?.closing_hour,
                    address: item?.location,
                    rating: item?.rating?.average_rating,
                    reviews: item?.rating.number_of_ratings
                }
            })}
        >
            <Card unstyled width={'95%'} alignSelf='center'
                bordered
                borderWidth={StyleSheet.hairlineWidth}
                overflow='hidden'
                marginVertical={5}
            >
                <Image src={item?.backdrop_image_url} objectFit='cover' height={IMAGET_HEIGHT} />
                <Card.Footer padded backgroundColor={'$background'}>
                    <YStack>
                        <XStack alignItems='center' >
                            <Paragraph
                                fontSize={14}
                                color={'$text'}
                                style={{
                                    fontFamily: 'Poppins-Bold'
                                }}
                            >{item?.company_name}</Paragraph>
                        </XStack>
                        <Paragraph color={'$icon'} fontSize={11}>{item?.location}</Paragraph>
                    </YStack>
                    {
                        parseInt(item?.rating.average_rating) > 0 && (
                            <View flexDirection='row'
                                backgroundColor={'$transparentBtnPrimaryColor'}
                                alignItems='center'
                                gap={5}
                                borderRadius='$2'
                                height={25}
                                width={50}
                                justifyContent='center'
                                position='absolute'
                                right={10}
                                top={20}

                            >
                                <Paragraph color={'$icon'}>{item?.rating?.average_rating}</Paragraph>
                                <AntDesign name='staro' color={theme.transparentBtnPrimaryColor.val} />
                            </View>
                        )
                    }
                </Card.Footer>
            </Card>
        </TouchableOpacity>
    )
}

export default StoreCard

const styles = StyleSheet.create({})