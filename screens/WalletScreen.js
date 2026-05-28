import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

export default function WalletScreen() {

    const [balance, setBalance] = useState(200); 
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        loadWallet();
    }, []);

    async function loadWallet() {
        const bal = await AsyncStorage.getItem('walletBalance');
        if (bal) {
            setBalance(parseInt(bal));
            setIsActive(parseInt(bal) >= 100);
        } else {
            await AsyncStorage.setItem('walletBalance', '200');
        }
    }

    async function recharge() {
        const newBalance = balance + 100;
        await AsyncStorage.setItem('walletBalance', String(newBalance));
        setBalance(newBalance);
        setIsActive(true);
        Alert.alert('Success', '₹100 added to wallet!');
    }

    return (
        <View style={styles.container}>

            <LinearGradient colors={['#0C7A54', '#1270B8']} style={styles.topBand}>

                
                <Text style={styles.walletLabel}>Wallet Balance</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <LottieView
                        source={require('../assets/lottie/gold-coin.json')}
                        autoPlay
                        loop
                        style={{ width: 40, height: 40 }}
                    />
                    <Text style={styles.balanceText}>{balance}</Text>
                </View>

                <View style={[styles.badge, isActive ? styles.activeBadge : styles.expiredBadge]}>
                    <Text style={styles.badgeText}>
                        {isActive ? '✓ Subscription Active' : '✗ Subscription Expired'}
                    </Text>
                </View>

            </LinearGradient>

            {/* 1 month recharge only */}
            <View style={styles.card}>
                <Text style={styles.planTitle}>Monthly Subscription</Text>
                <Text style={styles.planSub}>Get 1 month access to book rides</Text>
                <TouchableOpacity style={styles.rechargeBtn} onPress={recharge}>
                    <Text style={styles.rechargeText}>Pay ₹100</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: '#f9f9f9' },

    topBand: {
        height: 280,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },

    walletLabel: { color: '#D4EBE2', fontSize: 23, fontWeight: '600', marginTop: 8 },
    balanceText: { color: '#fff', fontSize: 48, fontWeight: '800', marginTop: 4 },

    badge: {
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },

    activeBadge: { backgroundColor: '#22C98A' },
    expiredBadge: { backgroundColor: '#FF4D4D' },
    badgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },

    card: {
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 14,
        padding: 20,
        elevation: 2,
        alignItems: 'center',
    },

    planTitle: { fontSize: 16, fontWeight: '700', color: '#1A2E25' },
    planSub: { fontSize: 12, color: '#7A9490', marginTop: 4, marginBottom: 16 },

    rechargeBtn: {
        backgroundColor: '#0C7A54',
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 30,
    },

    rechargeText: { color: '#fff', fontWeight: '700', fontSize: 14 },

});
