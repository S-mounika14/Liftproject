
import React, { useEffect, useRef, useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    PanResponder,
    Share,
} from 'react-native';

import MapView, { Marker, Polyline } from 'react-native-maps';

export default function RideStartedScreen({ route, navigation }) {

    const {
        pickupLabel,
        dropLabel,
        currentCoords,
        destinationCoords,
    } = route.params || {};

    const sheetAnim = useRef(new Animated.Value(0)).current;

    const SHEET_HEIGHT = 300;

    const [eta, setEta] = useState(12);
    const [progress, setProgress] = useState(0.1);
    const [arrived, setArrived] = useState(false);

    const origin = currentCoords || {
        latitude: 17.4435,
        longitude: 78.3772,
    };

    const destination = destinationCoords || {
        latitude: 17.4500,
        longitude: 78.3900,
    };

    // Bottom sheet drag
    const panResponder = PanResponder.create({

        onMoveShouldSetPanResponder: () => true,

        onPanResponderMove: (_, gesture) => {

            if (
                gesture.dy >= 0 &&
                gesture.dy <= SHEET_HEIGHT
            ) {
                sheetAnim.setValue(gesture.dy);
            }
        },

        onPanResponderRelease: (_, gesture) => {

            if (gesture.dy > 100) {

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

    // ETA progress simulation
    useEffect(() => {

        const interval = setInterval(() => {

            setEta((previousEta) => {

                const nextEta = previousEta - 1;

                if (nextEta <= 0) {
                    setArrived(true);
                    clearInterval(interval);
                    return 0;
                }

                return nextEta;
            });

            setProgress((previousProgress) => {

                const nextProgress = previousProgress + 0.05;

                return nextProgress >= 1
                    ? 1
                    : nextProgress;
            });

        }, 900);

        return () => clearInterval(interval);

    }, []);

    // Share trip
    async function handleShare() {

        await Share.share({
            message: `I am on my way to ${dropLabel || 'destination'}. Track my live trip.`,
        });
    }

    return (
        <View style={styles.container}>

            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: origin.latitude,
                    longitude: origin.longitude,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.03,
                }}
            >

                {/* Pickup */}
                <Marker
                    coordinate={origin}
                    pinColor="green"
                />

                {/* Destination */}
                <Marker
                    coordinate={destination}
                    pinColor="red"
                />

                {/* Route */}
                <Polyline
                    coordinates={[origin, destination]}
                    strokeWidth={5}
                    strokeColor="#0B8F6A"
                    lineDashPattern={[1]}
                />

            </MapView>

            {/* Arrived Screen */}
            {arrived && (

                <View style={styles.arrivedOverlay}>

                    <Text style={styles.arrivedEmoji}>
                        ✅
                    </Text>

                    <Text style={styles.arrivedTitle}>
                        You've Arrived!
                    </Text>

                    <Text style={styles.arrivedDestination}>
                        {dropLabel || 'Destination'}
                    </Text>

                    <View style={styles.tripSummary}>

                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryLabel}>
                                Distance
                            </Text>

                            <Text style={styles.summaryValue}>
                                3.2 km
                            </Text>
                        </View>

                        <View style={styles.summaryDivider} />

                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryLabel}>
                                Time Taken
                            </Text>

                            <Text style={styles.summaryValue}>
                                9 mins
                            </Text>
                        </View>

                    </View>

                    <Text style={styles.arrivedSubText}>
                        🤝 Thanks for using Community Lift
                    </Text>

                    <TouchableOpacity
                        style={styles.homeButton}
                        onPress={() =>
                            navigation.replace('LiftSeekerHome')
                        }
                    >
                        <Text style={styles.homeButtonText}>
                            Back to Home
                        </Text>
                    </TouchableOpacity>

                </View>
            )}

            {/* Bottom Sheet */}
            <Animated.View
                style={[
                    styles.sheet,
                    {
                        transform: [
                            { translateY: sheetAnim },
                        ],
                    },
                ]}
                {...panResponder.panHandlers}
            >

                <View style={styles.handle} />

                {/* Header */}
                <View style={styles.statusRow}>

                    <Text style={styles.statusText}>
                        Ride in Progress
                    </Text>

                    <View style={styles.etaBadge}>
                        <Text style={styles.etaText}>
                            {arrived
                                ? 'Arrived!'
                                : `ETA ${eta} mins`}
                        </Text>
                    </View>

                </View>

                {/* Progress */}
                <View style={styles.progressBackground}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: arrived
                                    ? '100%'
                                    : `${progress * 100}%`,
                            },
                        ]}
                    />
                </View>

                <View style={styles.progressLabels}>
                    <Text style={styles.progressLabel}>
                        {pickupLabel || 'Pickup'}
                    </Text>

                    <Text style={styles.progressLabel}>
                        {dropLabel || 'Drop'}
                    </Text>
                </View>

                {/* Destination Card */}
                <View style={styles.destinationCard}>

                    <View
                        style={[
                            styles.destinationDot,
                            { backgroundColor: '#E53935' },
                        ]}
                    />

                    <View>

                        <Text style={styles.destinationLabel}>
                            Destination
                        </Text>

                        <Text style={styles.destinationValue}>
                            {dropLabel || 'Destination'}
                        </Text>

                    </View>

                </View>

                {/* Share Button */}
                <TouchableOpacity
                    style={styles.shareButton}
                    onPress={handleShare}
                >
                    <Text style={styles.shareButtonText}>
                        Share Trip
                    </Text>
                </TouchableOpacity>

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

    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 14,
        paddingBottom: 24,
        elevation: 12,
    },

    handle: {
        width: 40,
        height: 4,
        borderRadius: 20,
        backgroundColor: '#D8D8D8',
        alignSelf: 'center',
        marginBottom: 12,
    },

    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    statusText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111',
    },

    etaBadge: {
        backgroundColor: '#EAF8F2',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },

    etaText: {
        color: '#0B8F6A',
        fontWeight: '700',
        fontSize: 12,
    },

    progressBackground: {
        height: 6,
        backgroundColor: '#E5E5E5',
        borderRadius: 6,
        marginBottom: 6,
    },

    progressFill: {
        height: 6,
        backgroundColor: '#0B8F6A',
        borderRadius: 6,
    },

    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14,
    },

    progressLabel: {
        color: '#888',
        fontSize: 10,
    },

    destinationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#F7F7F7',
        borderRadius: 12,
        padding: 10,
        marginBottom: 14,
    },

    destinationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },

    destinationLabel: {
        color: '#777',
        fontSize: 10,
    },

    destinationValue: {
        color: '#111',
        fontWeight: '700',
        fontSize: 13,
    },

    shareButton: {
        backgroundColor: '#EEF4FF',
        paddingVertical: 12,
        borderRadius: 50,
        alignItems: 'center',
    },

    shareButtonText: {
        color: '#1E88E5',
        fontWeight: '700',
        fontSize: 13,
    },

    arrivedOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },

    arrivedEmoji: {
        fontSize: 60,
        marginBottom: 16,
    },

    arrivedTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111',
        marginBottom: 6,
    },

    arrivedDestination: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0B8F6A',
        marginBottom: 24,
    },

    tripSummary: {
        flexDirection: 'row',
        backgroundColor: '#F7F7F7',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        width: '100%',
        justifyContent: 'space-around',
    },

    summaryBox: {
        alignItems: 'center',
    },

    summaryLabel: {
        color: '#888',
        fontSize: 11,
        marginBottom: 4,
    },

    summaryValue: {
        color: '#111',
        fontWeight: '700',
        fontSize: 16,
    },

    summaryDivider: {
        width: 1,
        backgroundColor: '#E0E0E0',
    },

    arrivedSubText: {
        fontSize: 13,
        color: '#888',
        marginBottom: 30,
    },

    homeButton: {
        backgroundColor: '#0B8F6A',
        paddingHorizontal: 50,
        paddingVertical: 14,
        borderRadius: 50,
    },

    homeButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },

});

