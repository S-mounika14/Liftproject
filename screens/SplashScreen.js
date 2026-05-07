import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PermissionsScreen from './PermissionsScreen';

export default function SplashScreen({ navigation }) {
    const [showPermissions, setShowPermissions] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            checkLogin();
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    async function checkLogin() {
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            const role = await AsyncStorage.getItem('role');
            if (role === 'user') {
                navigation.replace('LiftSeekerMain');
            } else {
                navigation.replace('Main');
            }
        } else {
            setShowPermissions(true);
            //navigation.replace('JoinAs');
        }
    }

    function handleContinue() {
        setShowPermissions(false);
        navigation.replace('JoinAs');
    }

    return (
        <LinearGradient colors={['#0C7A54', '#1270B8']} style={styles.container}>
            <Image source={require('../assets/LiftImage.png')} style={styles.logoImage} />
            <Text style={styles.appName}>Lift</Text>
            <PermissionsScreen visible={showPermissions} onContinue={handleContinue} />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    logoImage: { width: 100, height: 100, resizeMode: 'contain' },
    appName: { fontSize: 42, fontWeight: '800', color: '#fff', letterSpacing: 2 },
});