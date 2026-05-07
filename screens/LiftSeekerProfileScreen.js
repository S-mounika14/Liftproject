import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
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

    async function loadData() {
        const n = await AsyncStorage.getItem('name');
        const p = await AsyncStorage.getItem('phone');
        const acc = await AsyncStorage.getItem('accountNo');
        const address = await AsyncStorage.getItem('address');

        if (n) setName(n);
        if (p) setPhone(p);
        if (acc) setAccountNo(acc);

        if (address) {
            const parts = address.split(',');
            // state is 3rd last part in address
            const state = parts[parts.length - 2]?.trim();
            if (state) setStateCode(state.substring(0, 2).toUpperCase());
        }
    }

    async function pickPhoto() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setPhoto(result.assets[0].uri);
        }
    }

    function maskAccount(acc) {
        if (!acc) return '—';
        return acc.substring(0, 2) + '*'.repeat(acc.length - 2);
    }

    return (
        <View style={styles.container}>

            <LinearGradient colors={['#0C7A54', '#1270B8']} style={styles.topBand}>

                <TouchableOpacity onPress={pickPhoto}>
                    {photo ? (
                        <Image source={{ uri: photo }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={45} color="#0C7A54" />
                        </View>
                    )}
                </TouchableOpacity>

                <Text style={styles.name}>{name || 'User'}</Text>
                <Text style={styles.phone}>{phone || ''}</Text>

            </LinearGradient>

            <View style={styles.card}>

                <View style={styles.row}>
                    <Ionicons name="card-outline" size={20} color="#0C7A54" />
                    <Text style={styles.label}>Account Number</Text>
                    <Text style={styles.value}>{maskAccount(accountNo)}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Ionicons name="location-outline" size={20} color="#0C7A54" />
                    <Text style={styles.label}>Unique ID</Text>
                    <Text style={styles.value}>{stateCode || '—'}</Text>
                </View>

                <View style={styles.divider} />

                {/* 👇 NEW */}
                <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Wallet')}>
                    <Ionicons name="wallet-outline" size={20} color="#0C7A54" />
                    <Text style={styles.label}>Wallet</Text>
                    <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

            </View>

            <TouchableOpacity
                style={styles.logoutBtn}
                onPress={async () => {
                    await AsyncStorage.removeItem('isLoggedIn');
                    navigation.replace('JoinAs');
                }}
            >
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: '#f9f9f9' },

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

    name: { fontSize: 16, fontWeight: '700', color: '#fff', marginTop: 8 },
    phone: { fontSize: 13, color: '#D4EBE2', marginTop: 2 },

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

    label: { flex: 1, fontSize: 14, color: '#1A2E25', fontWeight: '500' },
    value: { fontSize: 14, fontWeight: '700', color: '#0C7A54' },
    menuArrow: { fontSize: 20, color: '#7A9490' },

    divider: { height: 1, backgroundColor: '#F0F0F0' },

    logoutBtn: {
        marginHorizontal: 16,
        padding: 14,
        backgroundColor: '#FFF0F0',
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FF4D4D',
    },

    logoutText: { color: '#FF4D4D', fontWeight: '700', fontSize: 14 },

});