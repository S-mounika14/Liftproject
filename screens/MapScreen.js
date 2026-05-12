import { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, ActivityIndicator,
    Image, TouchableOpacity, BackHandler, Alert, Animated
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function MapScreen({ navigation }) {

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);
    const [vehicleType, setVehicleType] = useState('');
    const [isConnected, setIsConnected] = useState(true);
    const [showBackOnline, setShowBackOnline] = useState(false);
    const [todayRides, setTodayRides] = useState(3); // replace with real count from your backend
    const [rideRequest, setRideRequest] = useState(null); // { seekerName, pickup, drop, distance }
    const [countdown, setCountdown] = useState(15);
    const [currentAddress, setCurrentAddress] = useState('');
    const [imageLoaded, setImageLoaded] = useState(false);

    const bannerAnim = useRef(new Animated.Value(-60)).current;
    const sheetAnim = useRef(new Animated.Value(300)).current;
    const mapRef = useRef(null);
    const countdownRef = useRef(null);

    // NETWORK DETECTION — unchanged
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
        Animated.spring(bannerAnim, { toValue: 0, useNativeDriver: true, speed: 20, bounciness: 4 }).start();
    };

    const hideBanner = () => {
        Animated.timing(bannerAnim, { toValue: -60, duration: 300, useNativeDriver: true })
            .start(() => setShowBackOnline(false));
    };

    // LOCATION TRACKING — unchanged
    useEffect(() => {
        let subscriber;
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') { setErrorMsg('Please allow location permission'); return; }
            subscriber = await Location.watchPositionAsync(
                { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 1000, distanceInterval: 1 },
                async (loc) => {
                    setLocation(loc);

                    const address = await Location.reverseGeocodeAsync({
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude,
                    });

                    setCurrentAddress(
                        `${address[0]?.name || ''}, ${address[0]?.street || ''}`
                    );
                    mapRef.current?.animateToRegion({
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    });
                }
            );
        })();
        return () => { if (subscriber) subscriber.remove(); };
    }, []);

    // VEHICLE TYPE — unchanged
    useFocusEffect(
        useCallback(() => {
            (async () => {
                const vt = await AsyncStorage.getItem('vehicleType');
                console.log('=== VEHICLE TYPE FROM STORAGE ===', vt);
                setVehicleType(vt || '');
                console.log('=== VEHICLE TYPE SET TO ===', vt || '');
            })();
        }, [])
    );

    // BACK HANDLER — unchanged
    useEffect(() => {
        const backAction = () => {
            Alert.alert('Exit', 'Choose an option', [
                { text: 'Exit Window', onPress: () => navigation.replace('JoinAs') },
                { text: 'Exit App', onPress: () => BackHandler.exitApp() }
            ], { cancelable: true });
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, []);

    // SIMULATE incoming ride request — replace this block with your real socket/API listener
    useEffect(() => {
        if (!location) return;
        const timer = setTimeout(() => {
            incomingRideRequest({
                seekerName: 'Priya S.',
                pickup: currentAddress,
                drop: 'Gachibowli Flyover',
                distance: '0.8 km',

                seekerCoords: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                },

                dropCoords: {
                    latitude: location.coords.latitude + 0.002,
                    longitude: location.coords.longitude + 0.002,
                },
            });
        }, 2000);
        return () => clearTimeout(timer);
    }, [location]);

    const incomingRideRequest = (request) => {
        setRideRequest(request);
        setCountdown(15);
        Animated.spring(sheetAnim, { toValue: 0, useNativeDriver: true, speed: 14, bounciness: 4 }).start();

        // countdown timer
        countdownRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    dismissRequest(); // auto-dismiss on timeout
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const dismissRequest = () => {
        clearInterval(countdownRef.current);
        Animated.timing(sheetAnim, { toValue: 300, duration: 300, useNativeDriver: true })
            .start(() => setRideRequest(null));
    };

    const handleAccept = () => {
        dismissRequest();
        navigation.navigate('NavigateToSeeker', { rideRequest }); // your next screen
    };

    const handleReject = () => {
        dismissRequest();
        // your backend: mark rejected, fetch next nearby request
    };

    // LOADING / ERROR / OFFLINE STATES — unchanged
    if (!location && !errorMsg) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0C7A54" />
                <Text style={styles.loadingText}>Getting your location...</Text>
            </View>
        );
    }

    if (errorMsg) {
        return <View style={styles.center}><Text style={styles.errorText}>{errorMsg}</Text></View>;
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

            {/* BACK ONLINE BANNER */}
            {showBackOnline && (
                <Animated.View style={[styles.networkBanner, styles.bannerOnline, { transform: [{ translateY: bannerAnim }] }]}>
                    <Text style={styles.bannerText}>Back Online</Text>
                </Animated.View>
            )}

            {/* ON / OFF TOGGLE */}
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

            {/* MAP */}
            <MapView
                ref={mapRef}
                style={styles.map}
                showsUserLocation={false}
                key={isAvailable ? 'on' : 'off'}
                initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                {isAvailable && (
                    <>
                        {console.log('=== MARKER RENDERING ===', 'vehicleType:', vehicleType, 'imageLoaded:', imageLoaded)}
                        <Marker
                            coordinate={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude
                            }}
                            tracksViewChanges={false}
                        >
                            <View style={{
                                backgroundColor: '#fff',
                                padding: 6,
                                borderRadius: 25,
                                elevation: 14
                            }}>
                                <Text style={{ fontSize: 26 }}>
                                    {vehicleType === 'car' ? '🚗' : '🏍️'}
                                </Text>
                            </View>
                        </Marker>
                    </>
                )}
            </MapView>

            {/* TODAY'S RIDES CARD */}
            <View style={styles.statCard}>
                <Text style={styles.statVal}>{todayRides}</Text>
                <Text style={styles.statLbl}>Today's rides</Text>
            </View>

            {/* RIDE REQUEST BOTTOM SHEET */}
            {rideRequest && (
                <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetAnim }] }]}>

                    <View style={styles.sheetHeader}>
                        <View style={styles.sheetIcon}><Text style={{ fontSize: 20 }}>🙋</Text></View>
                        <View>
                            <Text style={styles.sheetTitle}>Ride request nearby!</Text>
                            <Text style={styles.sheetCountdown}>⏱ Respond in {countdown}s…</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.sheetRow}>
                        <Text style={styles.sheetLabel}>Seeker</Text>
                        <Text style={styles.sheetVal}>{rideRequest.seekerName}</Text>
                    </View>
                    <View style={styles.sheetRow}>
                        <Text style={styles.sheetLabel}>Pickup</Text>
                        <Text style={styles.sheetVal}>{rideRequest.pickup}</Text>
                    </View>
                    <View style={styles.sheetRow}>
                        <Text style={styles.sheetLabel}>Drop</Text>
                        <Text style={styles.sheetVal}>{rideRequest.drop}</Text>
                    </View>
                    <View style={styles.sheetRow}>
                        <Text style={styles.sheetLabel}>Distance from you</Text>
                        <Text style={[styles.sheetVal, styles.distanceBadge]}>{rideRequest.distance}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.btnRow}>
                        <TouchableOpacity style={styles.btnReject} onPress={handleReject}>
                            <Text style={styles.btnText}> Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnAccept} onPress={handleAccept}>
                            <Text style={styles.btnText}> Accept</Text>
                        </TouchableOpacity>
                    </View>

                </Animated.View>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    map: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    offlineTitle: { fontSize: 22, fontWeight: '700', color: '#E24B4A', marginBottom: 8, textAlign: 'center' },
    offlineSubtext: { fontSize: 15, color: '#888', textAlign: 'center', paddingHorizontal: 40 },
    loadingText: { marginTop: 10, color: '#0C7A54' },
    errorText: { color: 'red', textAlign: 'center', paddingHorizontal: 20 },

    // network banner
    networkBanner: { position: 'absolute', top: 44, left: 16, right: 16, zIndex: 1000, paddingVertical: 10, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 12, elevation: 6 },
    bannerOnline: { backgroundColor: '#1D9E75' },
    bannerText: { color: '#fff', fontWeight: '700', fontSize: 14 },

    // toggle
    toggleBox: { position: 'absolute', top: 40, right: 20, zIndex: 999, flexDirection: 'row', backgroundColor: '#fff', borderRadius: 30, padding: 4, elevation: 5 },
    toggleBtn: { paddingVertical: 5, paddingHorizontal: 13, borderRadius: 18 },
    activeToggle: { backgroundColor: 'green' },
    inactiveToggle: { backgroundColor: 'red' },
    toggleText: { fontSize: 14, fontWeight: '700', color: '#000' },

    // today's rides card
    statCard: { position: 'absolute', bottom: 24, left: 20, backgroundColor: '#fff', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 18, elevation: 4, alignItems: 'center' },
    statVal: { fontSize: 22, fontWeight: '700', color: '#4338ca' },
    statLbl: { fontSize: 11, color: '#888', marginTop: 2 },

    // ride request sheet
    sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, elevation: 10, maxHeight: '60%' },
    sheetHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
    sheetIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff3e0', alignItems: 'center', justifyContent: 'center' },
    sheetTitle: { fontSize: 14, fontWeight: '600', color: '#111' },
    sheetCountdown: { fontSize: 12, color: '#e65100', marginTop: 2 },
    divider: { height: 0.5, backgroundColor: '#e0e0e0', marginVertical: 10 },
    sheetRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    sheetLabel: { fontSize: 12, color: '#888' },
    sheetVal: { fontSize: 12, fontWeight: '600', color: '#111' },
    distanceBadge: { color: '#2e7d32', backgroundColor: '#e8f5e9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
    btnRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
    btnReject: { flex: 1, backgroundColor: '#c0392b', borderRadius: 10, paddingVertical: 11, alignItems: 'center' },
    btnAccept: { flex: 1, backgroundColor: '#1a7a4a', borderRadius: 10, paddingVertical: 11, alignItems: 'center' },
    btnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});