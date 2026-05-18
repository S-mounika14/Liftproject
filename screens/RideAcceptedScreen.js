
import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    PanResponder,
    Image,
} from 'react-native';

// import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground } from 'react-native';

function DummyMap({ style }) {
  return (
    <ImageBackground
      source={require('../assets/map2.jpg')}
      style={[style, { flex: 1, width: '100%', height: '100%' }]}
      resizeMode="cover"
    >
    </ImageBackground>
  );
}

export default function RideAcceptedScreen({ route, navigation }) {

    const { pickupLabel, dropLabel } = route.params || {};

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const sheetAnim = useRef(new Animated.Value(0)).current;

    const SHEET_HEIGHT = 420;

    const contributor = {
        name: 'Ravi Kumar',
        vehicle: 'Bike',
        number: 'TS09 AB1234',
        otp: '4821',
    };

    const seekerLocation = {
        latitude: 17.4435,
        longitude: 78.3772,
    };

    const contributorLocation = {
        latitude: 17.4458,
        longitude: 78.3815,
    };

    const panResponder = PanResponder.create({

        onMoveShouldSetPanResponder: () => true,

        onPanResponderMove: (_, gesture) => {

            if (gesture.dy >= 0 && gesture.dy <= SHEET_HEIGHT) {
                sheetAnim.setValue(gesture.dy);
            }
        },

        onPanResponderRelease: (_, gesture) => {

            if (gesture.dy > 120) {

                Animated.timing(sheetAnim, {
                    toValue: SHEET_HEIGHT,
                    duration: 250,
                    useNativeDriver: true,
                }).start();

            } else {

                Animated.spring(sheetAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
            }
        },
    });

    useEffect(() => {

        Animated.loop(

            Animated.sequence([

                Animated.timing(pulseAnim, {
                    toValue: 1.5,
                    duration: 900,
                    useNativeDriver: true,
                }),

                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 900,
                    useNativeDriver: true,
                }),

            ])

        ).start();

    }, []);

    return (

        <View style={styles.container}>

            <DummyMap style={styles.map} />

            {/* <MapView
                style={styles.map}
                initialRegion={{
                    latitude: seekerLocation.latitude,
                    longitude: seekerLocation.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
            >

                <Marker
                    coordinate={seekerLocation}
                    pinColor="green"
                />

                <Marker coordinate={contributorLocation}>

                    <Animated.View
                        style={[
                            styles.contributorMarker,
                            {
                                transform: [{ scale: pulseAnim }],
                            },
                        ]}
                    >
                        <Text style={styles.markerEmoji}>
                            🏍️
                        </Text>
                    </Animated.View>

                </Marker>

                {[...Array(16)].map((_, index) => (

                    <Marker
                        key={index}
                        coordinate={{
                            latitude:
                                contributorLocation.latitude +
                                (
                                    (seekerLocation.latitude - contributorLocation.latitude) / 16
                                ) * index,

                            longitude:
                                contributorLocation.longitude +
                                (
                                    (seekerLocation.longitude - contributorLocation.longitude) / 16
                                ) * index,
                        }}
                    >
                        <View style={styles.dotMarker} />
                    </Marker>

                ))}

            </MapView> */}

            <View style={styles.statusPill}>

                <Text style={styles.statusText}>
                    Contributor arriving
                </Text>

                <Text style={styles.timeText}>
                    2 mins away
                </Text>

            </View>

            <Animated.View
                style={[
                    styles.sheet,
                    {
                        transform: [{ translateY: sheetAnim }],
                    },
                ]}
                {...panResponder.panHandlers}
            >

                <View style={styles.handle} />

                <Text style={styles.title}>
                    Contributor accepted your lift
                </Text>

                <View style={styles.etaContainer}>

                    <Text style={styles.etaText}>
                        Arriving in 2 mins
                    </Text>

                    <View style={styles.progressBackground}>
                        <View style={styles.progressFill} />
                    </View>

                </View>

                <View style={styles.profileCard}>

                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>RK</Text>
                    </View>

                    <View style={{ flex: 1 }}>

                        <Text style={styles.name}>
                            {contributor.name}
                        </Text>

                        <Text style={styles.vehicleInfo}>
                            {contributor.vehicle} • {contributor.number}
                        </Text>

                    </View>

                    <TouchableOpacity style={styles.chatButton}>
                        <Text style={styles.chatText}>Chat</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.callButton}>
                        <Text style={styles.callText}>Call</Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.locationCard}>

                    {/* pickup */}
                    <View style={styles.locationRow}>

                        <View
                            style={[
                                styles.locationDot,
                                { backgroundColor: '#1270b8' },
                            ]}
                        />

                        <View style={{ flex: 1 }}>

                            <Text style={styles.locationLabel}>
                                Pickup
                            </Text>

                            <Text style={styles.locationValue}>
                                {pickupLabel || 'Current Location'}
                            </Text>

                        </View>

                    </View>

                    <View style={styles.locationDivider} />

                    {/* drop */}
                    <View style={styles.locationRow}>

                        <View
                            style={[
                                styles.locationDot,
                                { backgroundColor: '#E53935' },
                            ]}
                        />

                        <View style={{ flex: 1 }}>

                            <Text style={styles.locationLabel}>
                                Drop
                            </Text>

                            <Text style={styles.locationValue}>
                                {dropLabel || 'Destination'}
                            </Text>

                        </View>

                        <View style={styles.distanceBadge}>

                            <Text style={styles.distanceText}>
                                3.2 km • ~9 mins
                            </Text>

                        </View>

                    </View>

                </View>

                <View style={styles.qrCard}>

                    <Text style={styles.qrLabel}>
                        Your Ride QR
                    </Text>

                    <Image
                        source={{
                            uri:
                                `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${contributor.otp}`,
                        }}
                        style={styles.qrImage}
                    />

                    <Text style={styles.qrNote}>
                        Show QR to contributor to start ride
                    </Text>

                </View>

                <View style={styles.buttonRow}>

                    <View>

                        <TouchableOpacity style={styles.cancelButton}>
                            <Text style={styles.cancelText}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.freeText}>
                            Free cancellation
                        </Text>

                    </View>

                    <TouchableOpacity style={styles.shareButton}>
                        <Text style={styles.shareText}>
                            Share Trip
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={() =>
                            navigation.replace(
                                'RideStarted',
                                {
                                    pickupLabel,
                                    dropLabel,

                                    currentCoords:
                                        route.params?.currentCoords ||
                                        seekerLocation,

                                    destinationCoords:
                                        route.params?.destinationCoords ||
                                        contributorLocation,
                                }
                            )
                        }
                    >
                        <Text style={styles.startText}>
                            Start Ride
                        </Text>
                    </TouchableOpacity>

                </View>

            </Animated.View>

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

    contributorMarker: {
        backgroundColor: '#FFFFFF',
        padding: 8,
        borderRadius: 40,
        elevation: 6,
    },

    markerEmoji: {
        fontSize: 20,
    },

    dotMarker: {
        width: 7,
        height: 7,
        borderRadius: 10,
        backgroundColor: '#E53935',
    },

    statusPill: {
        position: 'absolute',
        top: 55,
        right: 18,
            backgroundColor: '#2a3f8f',

        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
    },

    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },

    timeText: {
        color: '#DFF7EE',
        fontSize: 11,
        marginTop: 2,
    },

    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 12,
        paddingBottom: 16,
        elevation: 12,
    },

    handle: {
        width: 40,
        height: 4,
        borderRadius: 20,
        backgroundColor: '#D8D8D8',
        alignSelf: 'center',
        marginBottom: 8,
    },

    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111',
        marginBottom: 8,
    },

    etaContainer: {
        marginBottom: 8,
    },

    etaText: {
            color: '#2a3f8f',

        fontWeight: '700',
        fontSize: 12,
        marginBottom: 4,
    },

    progressBackground: {
        height: 3,
        backgroundColor: '#E5E5E5',
        borderRadius: 4,
    },

    progressFill: {
        width: '60%',
        height: 3,
            backgroundColor: '#2a3f8f',

        borderRadius: 4,
    },

    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
        borderRadius: 12,
        padding: 8,
        marginBottom: 8,
    },

    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#2a3f8f',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },

    avatarText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 13,
    },

    name: {
        fontSize: 13,
        fontWeight: '700',
        color: '#111',
    },

    vehicleInfo: {
        marginTop: 1,
        color: '#666',
        fontSize: 11,
    },

    chatButton: {
        backgroundColor: '#EEF4FF',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        marginLeft: 6,
    },

    chatText: {
        color: '#1E88E5',
        fontWeight: '700',
        fontSize: 12,
    },

    callButton: {
            backgroundColor: '#EEF4FF',

        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        marginLeft: 6,
    },

    callText: {
            color: '#2a3f8f',

        fontWeight: '700',
        fontSize: 12,
    },

    locationCard: {
        backgroundColor: '#F7F7F7',
        borderRadius: 12,
        padding: 8,
        marginBottom: 8,
    },

    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    locationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },

    locationDivider: {
        height: 1,
        backgroundColor: '#E8E8E8',
        marginVertical: 5,
        marginLeft: 16,
    },

    locationLabel: {
        color: '#777',
        fontSize: 10,
        marginBottom: 1,
    },

    locationValue: {
        color: '#111',
        fontWeight: '700',
        fontSize: 12,
    },

    distanceBadge: {
        backgroundColor: '#EEF4FF',
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 7,
    },

    distanceText: {
        color: '#2a3f8f',
        fontSize: 10,
        fontWeight: '700',
    },

    qrCard: {
        backgroundColor: '#F7F7F7',
        borderRadius: 12,
        padding: 8,
        alignItems: 'center',
        marginBottom: 8,
    },

    qrLabel: {
        color: '#777',
        marginBottom: 6,
        fontSize: 11,
    },

    qrImage: {
        width: 120,
        height: 120,
        borderRadius: 8,
    },

    qrNote: {
        color: '#777',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 6,
    },

    buttonRow: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },

    cancelButton: {
        backgroundColor: '#FEECEC',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
    },

    cancelText: {
        color: '#E53935',
        fontWeight: '700',
        fontSize: 13,
    },

    freeText: {
        color: '#E53935',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 2,
    },

    shareButton: {
        flex: 1,
        backgroundColor: '#EEF4FF',
        paddingVertical: 10,
        borderRadius: 50,
        alignItems: 'center',
    },

    shareText: {
        color: '#1E88E5',
        fontWeight: '700',
        fontSize: 12,
    },

    startButton: {
        flex: 1,
        backgroundColor: '#2a3f8f',
        paddingVertical: 10,
        borderRadius: 50,
        alignItems: 'center',
    },

    startText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 12,
    },

});

