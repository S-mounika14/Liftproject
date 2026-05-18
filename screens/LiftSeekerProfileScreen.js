import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import * as ImagePicker from 'expo-image-picker';

import { Ionicons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';

export default function LiftSeekerProfileScreen({ navigation }) {

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [accountNo, setAccountNo] = useState('');
    const [stateCode, setStateCode] = useState('');
    const [photo, setPhoto] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    // ---------------- LOAD DATA ----------------

    async function loadData() {

        try {

            const savedName =
                await AsyncStorage.getItem('name');

            const savedPhone =
                await AsyncStorage.getItem('phone');

            const savedAccountNo =
                await AsyncStorage.getItem('accountNo');

            const savedAddress =
                await AsyncStorage.getItem('address');

            if (savedName) {
                setName(savedName);
            }

            if (savedPhone) {
                setPhone(savedPhone);
            }

            if (savedAccountNo) {
                setAccountNo(savedAccountNo);
            }

            // get state code from address

            if (savedAddress) {

                const parts = savedAddress.split(',');

                // state is near last part
                const state =
                    parts[parts.length - 2]?.trim();

                if (state) {

                    setStateCode(
                        state.substring(0, 2).toUpperCase()
                    );
                }
            }

        } catch (error) {

            console.log('Load data error', error);
        }
    }

    // ---------------- PICK PROFILE PHOTO ----------------

    async function pickPhoto() {

        try {

            const result =
                await ImagePicker.launchImageLibraryAsync({
                    mediaTypes:
                        ImagePicker.MediaTypeOptions.Images,

                    allowsEditing: true,

                    aspect: [1, 1],

                    quality: 1,
                });

            if (!result.canceled) {

                setPhoto(result.assets[0].uri);
            }

        } catch (error) {

            console.log('Image picker error', error);
        }
    }

    // ---------------- MASK ACCOUNT NUMBER ----------------

    function maskAccount(acc) {

        if (!acc) {
            return '—';
        }

        return (
            acc.substring(0, 2) +
            '*'.repeat(acc.length - 2)
        );
    }

    // ---------------- LOGOUT ----------------

    async function handleLogout() {

        await AsyncStorage.removeItem('isLoggedIn');

        navigation.replace('JoinAs');
    }

    // ---------------- DEACTIVATE ACCOUNT ----------------

    function handleDeactivate() {

        Alert.alert(
            'Deactivate Account',
            'Your account will be hidden. You can reactivate anytime by logging in again.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },

                {
                    text: 'Deactivate',
                    style: 'destructive',

                    onPress: async () => {

                        await AsyncStorage.setItem(
                            'isDeactivated',
                            'true'
                        );

                        await AsyncStorage.removeItem(
                            'isLoggedIn'
                        );

                        navigation.replace('JoinAs');
                    },
                },
            ]
        );
    }

    return (

        <View style={styles.container}>

            {/* TOP PROFILE SECTION */}

            <LinearGradient
                colors={['#1B2A6B', '#2A3F8F', '#1B2A6B']}

                style={styles.topBand}
            >

                <TouchableOpacity onPress={pickPhoto}>

                    {photo ? (

                        <Image
                            source={{ uri: photo }}
                            style={styles.avatar}
                        />

                    ) : (

                        <View style={styles.avatar}>

                            <Ionicons
                                name="person"
                                size={45}
                                color="#dbe3e0"
                            />

                        </View>
                    )}

                </TouchableOpacity>

                <Text style={styles.name}>
                    {name || 'User'}
                </Text>

                <Text style={styles.phone}>
                    {phone || ''}
                </Text>

            </LinearGradient>

            {/* DETAILS CARD */}

            <View style={styles.card}>

                {/* ACCOUNT NUMBER */}

                <View style={styles.row}>

                    <Ionicons
                        name="card-outline"
                        size={20}
                        color="#2a3f8f"
                    />

                    <Text style={styles.label}>
                        Account Number
                    </Text>

                    <Text style={styles.value}>
                        {maskAccount(accountNo)}
                    </Text>

                </View>

                <View style={styles.divider} />

                {/* UNIQUE ID */}

                <View style={styles.row}>

                    <Ionicons
                        name="location-outline"
                        size={20}
                        color="#2a3f8f"
                    />

                    <Text style={styles.label}>
                        Unique ID
                    </Text>

                    <Text style={styles.value}>
                        {stateCode || '—'}
                    </Text>

                </View>

                <View style={styles.divider} />

                {/* WALLET */}

                <TouchableOpacity
                    style={styles.row}
                    onPress={() => navigation.navigate('Wallet')}
                >

                    <Ionicons
                        name="wallet-outline"
                        size={20}
                        color="#1b2a6b"
                    />

                    <Text style={styles.label}>
                        Wallet
                    </Text>

                    <Text style={styles.menuArrow}>
                        ›
                    </Text>

                </TouchableOpacity>

            </View>

            {/* LOGOUT BUTTON */}

            <TouchableOpacity
                style={styles.logoutBtn}
                onPress={handleLogout}
            >
                <LinearGradient
                    colors={['#1B2A6B', '#2A3F8F', '#1B2A6B']}

                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                        padding: 14,
                        alignItems: 'center',
                        borderRadius: 14,
                    }}
                >
                    <Text style={styles.logoutText}>
                        Logout
                    </Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* DEACTIVATE ACCOUNT */}

            <TouchableOpacity
                style={styles.deactivateBtn}
                onPress={handleDeactivate}
            >

                <Text style={styles.deactivateText}>
                    Deactivate Account
                </Text>

            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },

    topBand: {
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },

    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        overflow: 'hidden',
    },

    name: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        marginTop: 8,
    },

    phone: {
        fontSize: 13,
        color: '#D4EBE2',
        marginTop: 2,
    },

    card: {
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 14,
        padding: 16,
        elevation: 2,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        gap: 10,
    },

    label: {
        flex: 1,
        fontSize: 14,
        color: '#1b2a6b',
        fontWeight: '500',
    },

    value: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1b2a6b',
    },

    menuArrow: {
        fontSize: 20,
        color: '#7A9490',
    },

    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
    },

    logoutBtn: {
    marginHorizontal: 16,
    padding: 14,
    alignItems: 'center',
},

    logoutText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },

    deactivateBtn: {
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 30,
        padding: 10,
        alignItems: 'center',
    },

    deactivateText: {
        color: '#bbb',
        fontSize: 12,
        textDecorationLine: 'underline',
    },
});

