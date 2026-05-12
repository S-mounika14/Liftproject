import React, { useState, useEffect, useRef } from 'react';

import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';

import * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';

import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import { LinearGradient } from 'expo-linear-gradient';

export default function LiftSeekerHomeScreen({ navigation }) {

    const [fromAddress, setFromAddress] = useState('');
    const [toAddress, setToAddress] = useState('');

    const [isConnected, setIsConnected] = useState(true);
    const [showBackOnline, setShowBackOnline] = useState(false);

    const [errorMsg, setErrorMsg] = useState('');

    const [currentLocation, setCurrentLocation] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const [destinationCoords, setDestinationCoords] = useState(null);

    const [selectedType, setSelectedType] = useState('Car');

    const [showBottomSheet, setShowBottomSheet] = useState(false);

    const bannerAnim = useRef(new Animated.Value(-60)).current;


    function showBanner() {

        Animated.spring(bannerAnim, {
            toValue: 0,
            useNativeDriver: true,
            speed: 20,
            bounciness: 4,
        }).start();
    }

    function hideBanner() {

        Animated.timing(bannerAnim, {
            toValue: -60,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowBackOnline(false);
        });
    }


    useEffect(() => {

        const unsubscribe = NetInfo.addEventListener(state => {

            const connected =
                !!(state.isConnected && state.isInternetReachable);

            setIsConnected(previousState => {

                if (previousState === false && connected) {

                    setShowBackOnline(true);

                    showBanner();

                    setTimeout(() => {
                        hideBanner();
                    }, 3000);
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

        try {

            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {

                setErrorMsg('Please allow location permission');

                return;
            }

            const current =
                await Location.getCurrentPositionAsync({});

            setCurrentLocation(current);

            const geocode =
                await Location.reverseGeocodeAsync({
                    latitude: current.coords.latitude,
                    longitude: current.coords.longitude,
                });

            if (geocode.length > 0) {

                const place = geocode[0];

                const fullAddress = [
                    place.streetNumber,
                    place.street,
                    place.district,
                    place.subregion,
                    place.city,
                    place.postalCode,
                ]
                    .filter(Boolean)
                    .join(', ');

                setFromAddress(fullAddress);
            }

        } catch (error) {

            setErrorMsg('Please turn on device location');

            console.log(error);
        }
    }


    async function searchDestination() {

        if (!toAddress.trim()) {
            return;
        }

        try {

            const result =
                await Location.geocodeAsync(toAddress);

            if (result.length > 0) {

                setDestinationCoords({
                    latitude: result[0].latitude,
                    longitude: result[0].longitude,
                });

                setShowBottomSheet(true);
            }

        } catch (error) {

            console.log('Destination search error', error);
        }
    }


    if (!isConnected) {

        return (

            <View style={styles.center}>

                <Text style={styles.offlineTitle}>
                    Oops! No Internet
                </Text>

                <Text style={styles.offlineSubtext}>
                    Check your Wi-Fi or mobile data
                </Text>

            </View>
        );
    }


    if (!currentLocation) {

        return (

            <View style={styles.center}>

                <Text>
                    {errorMsg || 'Getting location...'}
                </Text>

            </View>
        );
    }

    return (

        <View style={{ flex: 1 }}>


            {showBackOnline && (

                <Animated.View
                    style={[
                        styles.networkBanner,
                        {
                            transform: [
                                { translateY: bannerAnim },
                            ],
                        },
                    ]}
                >

                    <Text style={styles.bannerText}>
                        ✓ Back Online
                    </Text>

                </Animated.View>
            )}


            <MapView
                style={styles.map}
                initialRegion={{
                    latitude:
                        selectedLocation
                            ? selectedLocation.latitude
                            : currentLocation.coords.latitude,

                    longitude:
                        selectedLocation
                            ? selectedLocation.longitude
                            : currentLocation.coords.longitude,

                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                showsUserLocation={false}
                showsMyLocationButton={true}
            >


                <Marker
                    coordinate={{
                        latitude:
                            selectedLocation
                                ? selectedLocation.latitude
                                : currentLocation.coords.latitude,

                        longitude:
                            selectedLocation
                                ? selectedLocation.longitude
                                : currentLocation.coords.longitude,
                    }}
                    title="My Location"
                />


                {destinationCoords && (

                    <Marker
                        coordinate={destinationCoords}
                        title="Destination"
                        pinColor="red"
                    />
                )}


                {destinationCoords && (

                    <MapViewDirections
                        origin={{
                            latitude: currentLocation.coords.latitude,
                            longitude: currentLocation.coords.longitude,
                        }}
                        destination={destinationCoords}
                        apikey="AIzaSyDna9Dx5XiojiFTSETophtWL5T1TXcGZp4"
                        strokeWidth={5}
                        strokeColor="red"
                    />
                )}

            </MapView>


            <View style={styles.topCard}>


                <View style={styles.inputRow}>

                    <View
                        style={[
                            styles.dot,
                            { backgroundColor: '#0C7A54' },
                        ]}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="From — pickup point"
                        placeholderTextColor="#bbb"
                        value={fromAddress}
                        onChangeText={setFromAddress}
                    />

                </View>

                <View style={styles.divider} />


                <View style={styles.inputRow}>

                    <View
                        style={[
                            styles.dot,
                            {
                                backgroundColor: '#e74c3c',
                                borderRadius: 3,
                            },
                        ]}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Where to?"
                        placeholderTextColor="#bbb"
                        value={toAddress}
                        onChangeText={setToAddress}
                    />

                    {toAddress.length > 0 && (

                        <TouchableOpacity
                            onPress={searchDestination}
                            style={styles.doneBtn}
                        >

                            <Text style={styles.doneTxt}>
                                Done
                            </Text>

                        </TouchableOpacity>
                    )}

                </View>

            </View>


            {showBottomSheet && (

                <View style={styles.sheet}>

                    <View style={styles.handle} />

                    {/* SEARCH BUTTON */}

                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('Searching', {

                                vehicleType: selectedType,

                                destinationCoords:
                                    destinationCoords,

                                currentCoords: {
                                    latitude:
                                        currentLocation.coords.latitude,

                                    longitude:
                                        currentLocation.coords.longitude,
                                },

                                pickupLabel: fromAddress,

                                dropLabel: toAddress,
                            })
                        }
                    >

                        <LinearGradient
                            colors={['#0B8F6A', '#1E88E5']}
                            style={styles.searchBtn}
                        >

                            <Text style={styles.searchBtnTxt}>
                                Search Lift →
                            </Text>

                        </LinearGradient>

                    </TouchableOpacity>

                </View>
            )}

        </View>
    );
}

const styles = StyleSheet.create({

    map: {
        flex: 1,
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    offlineTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#E24B4A',
        marginBottom: 8,
        textAlign: 'center',
    },

    offlineSubtext: {
        fontSize: 15,
        color: '#888',
        textAlign: 'center',
        paddingHorizontal: 40,
    },

    networkBanner: {
        position: 'absolute',
        top: 44,
        left: 16,
        right: 16,
        zIndex: 1000,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderRadius: 12,
        elevation: 6,
        backgroundColor: '#1D9E75',
    },

    bannerText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },

    topCard: {
        position: 'absolute',
        top: 50,
        left: 16,
        right: 16,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 10,
        elevation: 6,
        zIndex: 999,
    },

    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 6,
        paddingHorizontal: 4,
    },

    dot: {
        width: 9,
        height: 9,
        borderRadius: 5,
    },

    input: {
        flex: 1,
        fontSize: 13,
        color: '#1a1a1a',
    },

    divider: {
        borderTopWidth: 1,
        borderColor: '#f0f0f0',
        marginVertical: 2,
    },

    doneBtn: {
        backgroundColor: '#0C7A54',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },

    doneTxt: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },

    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        padding: 16,
        paddingBottom: 28,
        elevation: 12,
    },

    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#DADADA',
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 14,
    },

    sectionTitle: {
        color: '#111',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 14,
    },

    typeRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },

    typeBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },

    typeBtnSel: {
        backgroundColor: '#199572',
        borderColor: '#29cfa0',
    },

    typeTxt: {
        color: '#333',
        fontSize: 12,
        fontWeight: '600',
    },

    typeTxtSel: {
        color: '#FFFFFF',
    },

    searchBtn: {
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
        overflow: 'hidden',
    },

    searchBtnTxt: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
});
