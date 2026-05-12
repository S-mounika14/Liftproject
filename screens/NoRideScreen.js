
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

export default function NoRideScreen({ navigation }) {

    function handleTryAgain() {
        navigation.navigate('Search');
    }

    function handleChangeRoute() {
        navigation.navigate('Search');
    }

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.center}>

                <View style={styles.iconCircle}>
                    <Text style={styles.iconTxt}>⏱</Text>
                </View>

                <Text style={styles.timeoutTxt}>
                    Request timed out
                </Text>

                <View style={styles.spacer} />

                <View style={styles.noRideCircle} />

                <Text style={styles.title}>
                    No rides available
                </Text>

                <Text style={styles.desc}>
                    No contributors accepted within 5 minutes on this route.
                </Text>

                <Text style={styles.desc2}>
                    Try again or check a different time.
                </Text>

                <View style={styles.routeRow}>

                    <View>
                        <Text style={styles.routeLabel}>From</Text>
                        <Text style={styles.routeVal}>Madhapur</Text>
                    </View>

                    <View style={styles.routeRight}>
                        <Text style={styles.routeLabel}>To</Text>
                        <Text style={styles.routeVal}>HITEC City</Text>
                    </View>

                </View>

                <TouchableOpacity onPress={handleTryAgain}>
                    <LinearGradient
                        colors={['#0C7A54', '#1270B8']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.tryBtn}
                    >
                        <Text style={styles.tryTxt}>
                            Try Again
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.changeBtn}
                    onPress={handleChangeRoute}
                >
                    <Text style={styles.changeTxt}>
                        Change Route
                    </Text>
                </TouchableOpacity>

            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#0a1628',
    },

    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },

    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(231,76,60,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(231,76,60,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

    iconTxt: {
        fontSize: 28,
    },

    timeoutTxt: {
        color: '#e74c3c',
        fontSize: 13,
        marginBottom: 20,
    },

    spacer: {
        height: 1,
        width: '80%',
        backgroundColor: 'rgba(255,255,255,0.07)',
        marginBottom: 20,
    },

    noRideCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(231,76,60,0.2)',
        marginBottom: 14,
    },

    title: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 8,
    },

    desc: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 12,
        textAlign: 'center',
    },

    desc2: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 11,
        marginBottom: 20,
    },

    routeRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 14,
        marginBottom: 20,
    },

    routeRight: {
        alignItems: 'flex-end',
    },

    routeLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        marginBottom: 3,
    },

    routeVal: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '500',
    },

    tryBtn: {
        width: '100%',
        borderRadius: 14,
        padding: 14,
        alignItems: 'center',
        marginBottom: 10,
    },

    tryTxt: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },

    changeBtn: {
        width: '100%',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        padding: 14,
        alignItems: 'center',
    },

    changeTxt: {
        color: '#fff',
        fontSize: 13,
    },

});

