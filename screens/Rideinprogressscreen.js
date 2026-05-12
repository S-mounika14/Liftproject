
import { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native';

import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

export default function RideInProgressScreen({ route, navigation }) {

    const { rideRequest } = route.params;

    const [myLocation, setMyLocation] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    const mapRef = useRef(null);

    // Live contributor location
    useEffect(() => {

        let subscriber;

        async function startTracking() {

            subscriber = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 3000,
                    distanceInterval: 5,
                },
                (location) => {

                    const coords = location.coords;

                    setMyLocation(coords);

                    mapRef.current?.animateToRegion({
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    });
                }
            );
        }

        startTracking();

        return () => {
            if (subscriber) {
                subscriber.remove();
            }
        };

    }, []);

    // Complete ride
    function handleCompleteRide() {

        Alert.alert(
            'Complete Ride',
            'Are you sure you want to complete this ride?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Complete',
                    onPress: () => {

                        // Backend update here if needed

                        navigation.navigate('Map');
                    },
                },
            ]
        );
    }

    // Loading
    if (!myLocation) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4338ca" />
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <MapView
                ref={mapRef}
                style={styles.map}
                showsUserLocation={true}
                followsUserLocation={true}
                initialRegion={{
                    latitude: myLocation.latitude,
                    longitude: myLocation.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >

                {/* Contributor Vehicle */}
                <Marker
                    coordinate={myLocation}
                    tracksViewChanges={!imageLoaded}
                >
                    <Image
                        source={require('../assets/car-taxi.png')}
                        style={styles.vehicleImage}
                        onLoad={() => setImageLoaded(true)}
                    />
                </Marker>

                {/* Drop Location */}
                <Marker
                    coordinate={rideRequest.dropCoords}
                    title="Drop"
                    pinColor="red"
                />

                {/* Route */}
                <Polyline
                    coordinates={[
                        myLocation,
                        rideRequest.dropCoords,
                    ]}
                    strokeColor="#e53935"
                    strokeWidth={3}
                    lineDashPattern={[8, 4]}
                />

            </MapView>

            {/* Bottom Card */}
            <View style={styles.card}>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Dropping</Text>
                    <Text style={styles.name}>
                        {rideRequest.seekerName}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Destination</Text>

                    <Text style={styles.destination}>
                        {rideRequest.drop}
                    </Text>
                </View>

                <View style={styles.verifiedBox}>
                    <Text style={styles.verifiedText}>
                        ✓ Seeker Verified
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.completeButton}
                    onPress={handleCompleteRide}
                >
                    <Text style={styles.completeButtonText}>
                        Complete Ride
                    </Text>
                </TouchableOpacity>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    map: {
        flex: 1,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    vehicleImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },

    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10,
    },

    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },

    label: {
        fontSize: 12,
        color: '#888',
    },

    name: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111',
    },

    destination: {
        fontSize: 13,
        fontWeight: '600',
        color: '#111',
        maxWidth: '60%',
        textAlign: 'right',
    },

    verifiedBox: {
        backgroundColor: '#e8f5e9',
        borderRadius: 8,
        paddingVertical: 6,
        alignItems: 'center',
        marginBottom: 12,
    },

    verifiedText: {
        color: '#2e7d32',
        fontWeight: '600',
        fontSize: 13,
    },

    completeButton: {
        backgroundColor: '#1a7a4a',
        borderRadius: 12,
        paddingVertical: 13,
        alignItems: 'center',
    },

    completeButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },

});

