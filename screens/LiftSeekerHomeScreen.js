import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import MapView, { Marker, UrlTile } from 'react-native-maps';

export default function LiftSeekerHomeScreen() {

    const [location, setLocation] = useState(null);
    const [fromAddress, setFromAddress] = useState('');
    const [toAddress, setToAddress] = useState('');
    const [isConnected, setIsConnected] = useState(true);
    const [showBackOnline, setShowBackOnline] = useState(false);
    const bannerAnim = React.useRef(new Animated.Value(-60)).current;
    const [errorMsg, setErrorMsg] = useState('');
    const [currentLocation, setCurrentLocation] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);


    const showBanner = () => {
        Animated.spring(bannerAnim, {
            toValue: 0,
            useNativeDriver: true,
            speed: 20,
            bounciness: 4,
        }).start();
    };

    const hideBanner = () => {
        Animated.timing(bannerAnim, {
            toValue: -60,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setShowBackOnline(false));
    };

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            const connected = !!(state.isConnected && state.isInternetReachable);
            setIsConnected(prev => {
                if (prev === false && connected) {
                    setShowBackOnline(true);
                    showBanner();
                    setTimeout(() => hideBanner(), 3000);
                }
                return connected;
            });
        });
        return () => unsubscribe();
    }, []);


    useEffect(() => {
        getLocation();
    }, []);

    async function getLocation() {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            setErrorMsg('Please allow location permission');
            return;
        }

        try {
            const current = await Location.getCurrentPositionAsync({});
            setCurrentLocation(current);

            const geocode = await Location.reverseGeocodeAsync({
                latitude: current.coords.latitude,
                longitude: current.coords.longitude,
            });

            if (geocode.length > 0) {
                const place = geocode[0];
                const fullAddress = [
                    place.name,
                    place.street,
                    place.streetNumber,
                    place.subregion,
                    place.city,
                    place.region,
                    place.postalCode
                ].filter(Boolean).join(', ');

                setFromAddress(fullAddress);
            }
        } catch (error) {
            setErrorMsg('Please turn on device location');
        }
    }

    const searchLocation = async (address) => {
        try {
            const result = await Location.geocodeAsync(address);

            if (result.length > 0) {
                const { latitude, longitude } = result[0];

                setSelectedLocation({
                    latitude,
                    longitude
                });

                // Update address again (clean format)
                const reverse = await Location.reverseGeocodeAsync({
                    latitude,
                    longitude
                });

                if (reverse.length > 0) {
                    const place = reverse[0];
                    const fullAddress = [
                        place.name,
                        place.street,
                        place.city,
                        place.region
                    ].filter(Boolean).join(', ');

                    setFromAddress(fullAddress);
                }
            }
        } catch (err) {
            console.log(err);
        }
    };


    if (!isConnected) {
        return (
            <View style={styles.center}>

                <Text style={styles.offlineTitle}>Oops! No Internet</Text>
                <Text style={styles.offlineSubtext}>Check your Wi-Fi or mobile data</Text>
            </View>
        );
    }
    if (!currentLocation) {
        return (
            <View style={styles.center}>
                <Text>{errorMsg || 'Getting location...'}</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>

            {showBackOnline && (
                <Animated.View style={[
                    styles.networkBanner,
                    { transform: [{ translateY: bannerAnim }] }
                ]}>
                    <Text style={styles.bannerText}>
                        ✓ Back Online
                    </Text>
                </Animated.View>
            )}

            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: selectedLocation
                        ? selectedLocation.latitude
                        : currentLocation.coords.latitude,

                    longitude: selectedLocation
                        ? selectedLocation.longitude
                        : currentLocation.coords.longitude,

                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                <Marker
                    coordinate={{
                        latitude: selectedLocation
                            ? selectedLocation.latitude
                            : currentLocation.coords.latitude,

                        longitude: selectedLocation
                            ? selectedLocation.longitude
                            : currentLocation.coords.longitude,
                    }}
                    title="My Location"
                />
            </MapView>
            <View style={styles.searchBox}>
                <TextInput
                    style={styles.input}
                    placeholder="From"
                    value={fromAddress}
                    onChangeText={setFromAddress}
                    onEndEditing={() => searchLocation(fromAddress)}
                />
                <View style={styles.divider} />
                <TextInput
                    style={styles.input}
                    placeholder="Where to?"
                    value={toAddress}
                    onChangeText={setToAddress}
                />
            </View>



        </View>
    );
}

const styles = StyleSheet.create({

    map: { flex: 1 },

    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    searchBox: {
        position: 'absolute',
        top: 50,
        left: 16,
        right: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        elevation: 5,
        zIndex: 999,
    },

    input: {
        fontSize: 13,
        color: '#1A2E25',
        paddingVertical: 6,
        paddingHorizontal: 8,
    },

    divider: {
        borderTopWidth: 1,
        borderColor: '#eee',
        marginVertical: 4,
    },
    offlineTitle: { fontSize: 22, fontWeight: '700', color: '#E24B4A', marginBottom: 8, textAlign: 'center' },
    offlineSubtext: { fontSize: 15, color: '#888', textAlign: 'center', paddingHorizontal: 40 },
    networkBanner: { position: 'absolute', top: 44, left: 16, right: 16, zIndex: 1000, paddingVertical: 10, paddingHorizontal: 20, alignItems: 'center', borderRadius: 12, elevation: 6, backgroundColor: '#1D9E75' },
    bannerText: { color: '#fff', fontWeight: '700', fontSize: 14 },

});