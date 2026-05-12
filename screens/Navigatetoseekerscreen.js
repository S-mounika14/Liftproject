import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NavigateToSeekerScreen({ route, navigation }) {

    const { rideRequest } = route.params;
    const [myLocation, setMyLocation] = useState(null);
    const [vehicleType, setVehicleType] = useState('bike');
    const [eta, setEta] = useState('3 min');
    const mapRef = useRef(null);

    useEffect(() => {
        async function getVehicleType() {
            const vt = await AsyncStorage.getItem('vehicleType');
            setVehicleType(vt || 'bike');
        }

        getVehicleType();
    }, []);

    useEffect(() => {
        let subscriber;
        (async () => {
            subscriber = await Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 5 },
                (loc) => setMyLocation(loc.coords)
            );
        })();
        return () => {
            if (subscriber) {
                subscriber.remove();
            }
        };
    }, []);

    useEffect(() => {
        if (myLocation && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: myLocation.latitude,
                longitude: myLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
    }, [myLocation]);

    if (!myLocation) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0C7A54" />
            </View>
        );
    }
    return (
        <View style={{ flex: 1 }}>

            <MapView
                ref={mapRef}
                style={styles.map}
                showsUserLocation={false}
                followsUserLocation={false}
                initialRegion={{
                    latitude: myLocation.latitude,
                    longitude: myLocation.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >


                {/* contributor — bike or car */}
                <Marker coordinate={myLocation} tracksViewChanges={false}>
                    <Image
                        source={
                            vehicleType === 'car' || vehicleType === 'both'
                                ? require('../assets/car-taxi.png')
                                : require('../assets/bike-ride.png')
                        }
                        style={styles.bikeImg}
                    />
                </Marker>

                {/* seeker */}
                <Marker coordinate={rideRequest.dropCoords}>
                    <View style={styles.seekerPin}>
                        <Text style={styles.seekerEmoji}>🙋</Text>
                    </View>
                </Marker>

                {/* ETA label in middle of route */}
                <Marker
                    coordinate={{
                        latitude: (rideRequest.seekerCoords.latitude + rideRequest.dropCoords.latitude) / 2,
                        longitude: (rideRequest.seekerCoords.longitude + rideRequest.dropCoords.longitude) / 2,
                    }}
                    anchor={{ x: 0.5, y: 0.5 }}
                >
                    <View style={styles.etaBubble}>
                        <Text style={styles.etaText}>{eta}</Text>
                    </View>
                </Marker>

                {/* dashed route line */}
                <Polyline
                    coordinates={[rideRequest.seekerCoords, rideRequest.dropCoords]}
                    strokeColor="#4338ca"
                    strokeWidth={4}
                    lineDashPattern={[8, 4]}
                />

            </MapView>

            {/* bottom card */}
            <View style={styles.card}>

                <View style={styles.userRow}>

                    <View style={styles.userAvatar}>
                        <Text style={{ fontSize: 22 }}>🙋</Text>
                    </View>

                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.userName}>{rideRequest.seekerName}</Text>
                        <Text style={styles.userPickup}>{rideRequest.pickup}</Text>
                    </View>

                    <TouchableOpacity style={styles.callBtn}>
                        <Text style={{ fontSize: 18 }}>📞</Text>
                        <Text style={{ fontSize: 13 }}>Call</Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.dropBox}>
                    <Text style={styles.dropLabel}>Drop destination</Text>
                    <Text style={styles.dropText}>📍 {rideRequest.drop}</Text>
                </View>

                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => navigation.navigate('QRVerify', { rideRequest })}
                >
                    <Text style={styles.btnText}>Arrived — Verify Seeker</Text>
                </TouchableOpacity>

            </View>

        </View >
    );
}

const styles = StyleSheet.create({
    map: { flex: 1 },

    seekerPin: { backgroundColor: '#fff', borderRadius: 24, padding: 6, elevation: 4, borderWidth: 2, borderColor: '#e53935' },
    seekerEmoji: { fontSize: 22 },

    etaBubble: { backgroundColor: '#4338ca', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
    etaText: { color: '#fff', fontWeight: '700', fontSize: 12 },

    card: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, paddingBottom: 28, elevation: 12 },
    handle: { width: 40, height: 4, backgroundColor: '#e0e0e0', borderRadius: 4, alignSelf: 'center', marginBottom: 16 },

    // pickup drop dots
    tripRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    dotsCol: { alignItems: 'center', marginRight: 12, paddingTop: 4 },
    dotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0C7A54' },
    dottedLine: { width: 2, height: 28, borderLeftWidth: 2, borderColor: '#ccc', borderStyle: 'dashed', marginVertical: 3 },
    dotRed: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#e53935' },
    tripInfo: { flex: 1 },
    tripStop: { marginBottom: 10 },
    stopLabel: { fontSize: 10, color: '#aaa' },
    stopValue: { fontSize: 13, fontWeight: '600', color: '#111' },
    etaSide: { alignItems: 'center', marginLeft: 10 },
    etaSideText: { fontSize: 16, fontWeight: '700', color: '#4338ca' },
    etaSideLabel: { fontSize: 10, color: '#aaa' },

    divider: { height: 0.5, backgroundColor: '#eee', marginBottom: 12 },

    seekerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    seekerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f0faf5', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#0C7A54' },
    seekerName: { fontSize: 14, fontWeight: '700', color: '#111' },
    seekerSub: { fontSize: 12, color: '#888', marginTop: 2 },

    btn: { backgroundColor: '#0C7A54', borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
    btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

    bikeWrap: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },

    bikeImg: {
        width: 38,
        height: 38,
        resizeMode: 'contain',
    },

    avatarWrap: {
        backgroundColor: '#fff',
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#5c6bc0',
    },

    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },

    userAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'center',
    },

    userName: {
        fontSize: 17,
        fontWeight: '700',
    },

    userPickup: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },

    callBtn: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 8,
        alignItems: 'center',
    },

    dropBox: {
        backgroundColor: '#f3f0ea',
        borderRadius: 16,
        padding: 14,
        marginBottom: 16,
    },

    dropLabel: {
        color: '#666',
        marginBottom: 5,
    },

    dropText: {
        fontSize: 22,
        fontWeight: '700',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});