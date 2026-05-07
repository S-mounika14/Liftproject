import { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, ActivityIndicator,
    Image, TouchableOpacity, BackHandler, Alert, Animated
} from 'react-native';

import MapView, { Marker, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export default function MapScreen({ navigation }) {

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);
    const [vehicleType, setVehicleType] = useState('');

    //  NETWORK STATE
    const [isConnected, setIsConnected] = useState(true);
    const [showBackOnline, setShowBackOnline] = useState(false);
    const bannerAnim = useRef(new Animated.Value(-60)).current;

    const mapRef = useRef(null);

    // NETWORK DETECTION
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
        let subscriber;

        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setErrorMsg('Please allow location permission');
                return;
            }

            subscriber = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 3000,
                    distanceInterval: 5,
                },
                (loc) => {
                    setLocation(loc);

                    // 🔥 MOVE MAP WITH USER
                    mapRef.current?.animateToRegion({
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    });
                }
            );
        })();

        return () => {
            if (subscriber) subscriber.remove();
        };
    }, []);

    //  GET VEHICLE TYPE
    useEffect(() => {
        (async () => {
            const vt = await AsyncStorage.getItem('vehicleType');
            setVehicleType(vt || '');
        })();
    }, []);

    useEffect(() => {
        const backAction = () => {
            Alert.alert(
                'Exit',
                'Choose an option',
                [
                    {
                        text: 'Exit Window',
                        onPress: () => navigation.replace('JoinAs'),
                    },
                    {
                        text: 'Exit App',
                        onPress: () => BackHandler.exitApp(),
                    }
                ],
                { cancelable: true }
            );
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    if (!location && !errorMsg) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0C7A54" />
                <Text style={styles.loadingText}>Getting your location...</Text>
            </View>
        );
    }

    if (errorMsg) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
        );
    }

   
    if (!isConnected) {
        return (
            <View style={styles.center}>
                <Text style={styles.offlineTitle}>Oops! No Internet</Text>
                <Text style={styles.offlineSubtext}>Check your Wi-Fi or mobile data</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>

            {showBackOnline && (
                <Animated.View
                    style={[
                        styles.networkBanner,
                        styles.bannerOnline,
                        { transform: [{ translateY: bannerAnim }] }
                    ]}
                >
                    <Text style={styles.bannerText}>Back Online</Text>
                </Animated.View>
            )}

            <View style={styles.toggleBox}>
                <TouchableOpacity
                    style={[styles.toggleBtn, isAvailable && styles.activeToggle]}
                    onPress={() => setIsAvailable(true)}
                >
                    <Text style={styles.toggleText}>ON</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.toggleBtn, !isAvailable && styles.inactiveToggle]}
                    onPress={() => setIsAvailable(false)}
                >
                    <Text style={styles.toggleText}>OFF</Text>
                </TouchableOpacity>
            </View>

            {/* <TouchableOpacity style={styles.walletBtn}>
                <LottieView
                    source={require('../assets/lottie/gold-coin.json')}
                    autoPlay
                    loop
                    style={{ width: 40, height: 40 }}
                />
                <Text style={styles.walletAmount}>₹200</Text>
            </TouchableOpacity> */}
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <UrlTile
                    urlTemplate="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    maximumZ={19}
                    subdomains={['a', 'b', 'c', 'd']}
                />

                {isAvailable && (
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                    >
                        <Image
                            source={
                                vehicleType === 'car' || vehicleType === 'both'
                                    ? require('../assets/car-taxi.png')
                                    : require('../assets/bike-ride.png')
                            }
                            style={{ width: 40, height: 40 }}
                        />
                    </Marker>
                )}
            </MapView>

        </View>
    );
}

const styles = StyleSheet.create({

    map: { flex: 1 },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    offlineEmoji: {
        fontSize: 60,
        marginBottom: 16,
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
        justifyContent: 'center',
        borderRadius: 12,  
        elevation: 6,
    },

    bannerOnline: {
        backgroundColor: '#1D9E75',
    },

    bannerText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },

    toggleBox: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 999,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 4,
        elevation: 5,
    },

    walletBtn: {
        position: 'absolute',
        top: 90,
        right: 24,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        borderRadius: 20,
        elevation: 5,
        zIndex: 600,
    },

    walletAmount: {
        fontWeight: '700',
        fontSize: 14,
        color: '#000',
        marginLeft: 5
    },

    toggleBtn: {
        paddingVertical: 5,
        paddingHorizontal: 13,
        borderRadius: 18
    },

    activeToggle: { backgroundColor: 'green' },
    inactiveToggle: { backgroundColor: 'red' },

    toggleText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000',
    },

    loadingText: {
        marginTop: 10,
        color: '#0C7A54',
    },

    errorText: {
        color: 'red',
        textAlign: 'center',
        paddingHorizontal: 20,
    }
});