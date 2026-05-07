import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EmergencyContactScreen({ navigation }) {

    const [contactName, setContactName] = useState('');
    const [relationship, setRelationship] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    // check if email format is correct
    function isValidEmail(text) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;
        return emailRegex.test(text);
    }

    // load saved data when screen opens
    useEffect(() => {
        loadSavedData();
    }, []);

    async function loadSavedData() {
        try {
            let savedContactName = await AsyncStorage.getItem('contactName');
            let savedRelationship = await AsyncStorage.getItem('relationship');
            let savedPhone = await AsyncStorage.getItem('emergencyPhone');
            let savedEmail = await AsyncStorage.getItem('emergencyEmail');

            if (savedContactName != null) setContactName(savedContactName);
            if (savedRelationship != null) setRelationship(savedRelationship);
            if (savedPhone != null) setPhone(savedPhone);
            if (savedEmail != null) setEmail(savedEmail);
        } catch (e) {
            console.log('error loading data', e);
        }
    }

    // handle email input and show error if invalid
    function handleEmailChange(text) {
        setEmail(text);
        if (!text) {
            setEmailError('Email is required');
        } else if (!isValidEmail(text)) {
            setEmailError('Invalid email format');
        } else {
            setEmailError('');
        }
    }

    // handle phone input - only allow 10 digits
    function handlePhoneChange(text) {
        if (text.length <= 10) {
            setPhone(text);
        }
    }

    // validate all fields and go to next screen
    async function handleNext() {

        if (!contactName.trim()) {
            Alert.alert('Required', 'Please enter contact name');
            return;
        }

        if (!relationship.trim()) {
            Alert.alert('Required', 'Please enter relationship');
            return;
        }

        if (phone.length < 10) {
            Alert.alert('Required', 'Please enter a valid 10 digit phone number');
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert('Required', 'Please enter a valid email address');
            return;
        }

        // save all data to storage
        await AsyncStorage.setItem('contactName', contactName);
        await AsyncStorage.setItem('relationship', relationship);
        await AsyncStorage.setItem('emergencyPhone', phone);
        await AsyncStorage.setItem('emergencyEmail', email);

        navigation.navigate('VehicleInfo');
    }

    return (
        <View style={styles.container}>

            {/* header */}
            <LinearGradient colors={['#0C7A54', '#1270B8']} style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Image
                        source={require('../assets/arrow.png')}
                        style={{ width: 30, height: 30, resizeMode: 'contain', tintColor: '#fff' }}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Emergency Contact</Text>
                <View style={{ width: 30 }} />
            </LinearGradient>

            {/* step progress bar */}
            <View style={styles.stepsRow}>
                <View style={[styles.step, styles.stepDone]} />
                <View style={[styles.step, styles.stepDone]} />
                <View style={[styles.step, styles.stepDone]} />
                <View style={[styles.step, styles.stepActive]} />
                <View style={styles.step} />
            </View>

            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

                <Text style={styles.label}>Contact Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter contact name"
                    value={contactName}
                    onChangeText={setContactName}
                />

                <Text style={styles.label}>Relationship</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Spouse, Parent, Friend"
                    value={relationship}
                    onChangeText={setRelationship}
                />

                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="+91 XXXXX XXXXX"
                    value={phone}
                    onChangeText={handlePhoneChange}
                    keyboardType="phone-pad"
                    maxLength={10}
                />

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter email address"
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                    <LinearGradient colors={['#0C7A54', '#1270B8']} style={styles.nextBtnGrad}>
                        <Text style={styles.nextBtnText}>Next →</Text>
                    </LinearGradient>
                </TouchableOpacity>

            </ScrollView>

        </View>
    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 14,
        paddingHorizontal: 16,
    },

    backBtn: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

    headerTitle: {
        flex: 1,
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
        textAlign: 'center',
    },

    stepsRow: {
        flexDirection: 'row',
        gap: 5,
        justifyContent: 'center',
        paddingVertical: 12,
    },

    step: {
        width: 20,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D4EBE2',
    },

    stepActive: {
        width: 30,
        backgroundColor: '#0C7A54',
    },

    stepDone: {
        width: 22,
        backgroundColor: '#22C98A',
    },

    body: {
        paddingHorizontal: 20,
    },

    label: {
        fontSize: 11,
        fontWeight: '600',
        color: '#7A9490',
        marginBottom: 5,
        marginTop: 14,
    },

    input: {
        backgroundColor: '#F5FAF7',
        borderWidth: 1,
        borderColor: '#D4EBE2',
        borderRadius: 10,
        padding: 11,
        fontSize: 13,
        color: '#1A2E25',
    },

    errorText: {
        color: 'red',
        fontSize: 10,
        marginTop: 4,
    },

    nextBtn: {
        borderRadius: 40,
        overflow: 'hidden',
        marginTop: 24,
        marginBottom: 30,
    },

    nextBtnGrad: {
        padding: 14,
        alignItems: 'center',
    },

    nextBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },

});