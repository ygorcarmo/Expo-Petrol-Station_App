import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import MapView, { Callout, Circle, Marker } from 'react-native-maps';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { auth } from '../firebase';
import { GOOGLE_MAPS_API } from "@env";
import * as Location from 'expo-location';

const HomeScreen = () => {

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      
    })();
}, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

    const navigation = useNavigation();

    const handleSignOut = () => {
        auth.signOut()
            .then(() =>{
                navigation.replace("Login")
            })
            .catch((err) => alert(err.message))
    };
    const handleLocation = () => {
        if(location != null){setRegion({latitude:location.coords.latitude, longitude:location.coords.longitude,
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0121,});}
    }
    

    const [pin, setPin] = React.useState({latitude: 37.78825,
        longitude: -122.4324,});
        // console.log(location);

    const [region, setRegion] = React.useState({latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,});
    

    return (
        <View style={{ marginTop:50, flex:1}}>
            <GooglePlacesAutocomplete
      placeholder='Search'
      fetchDetails={true}
      GooglePlacesSearchQuery={{
          rankby:"distance"
      }}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
        setRegion({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        })
      }}
      query={{
        key: GOOGLE_MAPS_API,
        language: 'en',
        components:"country:us",
        types:'establishment',
        radius:30000,
        location:`${region.latitude}, ${region.longitude}`
      }}
      styles={{container: {flex:0, position:"absolute", width:"100%", zIndex: 1},
                listView:{ backgroundColor: "white"}}}
    />
            <MapView onUserLocationChange={e => {
                // handleLocation();
              } } 
             showsUserLocation={true}
             region={region} 
             followsUserLocation={true}
             mapPadding={{top: 20, right: 20, bottom: 30, left: 20}} 
             showsMyLocationButton={true} followsUserLocation={true} 
             style={styles.map}
                provider="google"
            >
            </MapView>
        </View>
    )
};

export default HomeScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    button:{ 
        backgroundColor:'#0782F9',
        width:'60%',
        padding: 15, 
        borderRadius:10,
        alignItems:'center',
        marginTop:20
    },
    buttonText:{
        color:'#fff',
        fontSize:20,
        fontWeight:'bold'
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
});


{/* <View style={styles.container}>
            <Text>Email: {auth.currentUser?.email}</Text>
            <TouchableOpacity style={styles.button}
            onPress={handleSignOut} >
                <Text style={styles.buttonText}>Sign out</Text>
            </TouchableOpacity>
        </View> */}