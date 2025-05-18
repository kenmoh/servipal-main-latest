import { Dimensions } from "react-native";
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";



const MAP_HEIGHT = Dimensions.get('window').height * 0.35

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Map = () => {
    return (
        <MapView
            provider={PROVIDER_GOOGLE} style={{ flex: 1 }}
            tintColor={'black'}
            mapType={'standard'}
            showsPointsOfInterest={false}
            showsUserLocation={true}
            userInterfaceStyle={'dark'}
            showsMyLocationButton={true}
            showsCompass={true}

        />


    )
}

export default Map

