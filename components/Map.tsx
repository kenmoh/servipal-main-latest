import {Dimensions} from "react-native";
import MapView, {PROVIDER_DEFAULT} from "react-native-maps";



const MAP_HEIGHT = Dimensions.get('window').height * 0.35

const Map = () => {
    return(
        <MapView
            provider={PROVIDER_DEFAULT} style={{flex:1}}
            tintColor={'black'}
            mapType={'mutedStandard'}
            showsPointsOfInterest={false}
            showsUserLocation={true}
            userInterfaceStyle={'dark'}
        />

    )
}

export default Map