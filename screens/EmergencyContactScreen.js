import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Image,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EmergencyContactScreen({ navigation }) {

    const [contactName, setContactName] = useState('');
    const [relationship, setRelationship] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    useEffect(() => {
        loadSavedData();
    }, []);

    //EMAIL VALIDATION 

    function isValidEmail(text) {

        const emailRegex =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

        return emailRegex.test(text);
    }

    //LOAD SAVED DATA 

    async function loadSavedData() {

        try {

            const savedContactName =
                await AsyncStorage.getItem('contactName');

            const savedRelationship =
                await AsyncStorage.getItem('relationship');

            const savedPhone =
                await AsyncStorage.getItem('emergencyPhone');

            const savedEmail =
                await AsyncStorage.getItem('emergencyEmail');

            if (savedContactName) {
                setContactName(savedContactName);
            }

            if (savedRelationship) {
                setRelationship(savedRelationship);
            }

            if (savedPhone) {
                setPhone(savedPhone);
            }

            if (savedEmail) {
                setEmail(savedEmail);
            }

        } catch (error) {
            console.log('Error loading data', error);
        }
    }

    // EMAIL INPUT

    function handleEmailChange(text) {

        setEmail(text);

        if (!text.trim()) {

            setEmailError('Email is required');

        } else if (!isValidEmail(text)) {

            setEmailError('Invalid email format');

        } else {

            setEmailError('');
        }
    }

    //  PHONE INPUT

    function handlePhoneChange(text) {

        // only numbers allowed
        const cleanedText = text.replace(/[^0-9]/g, '');

        if (cleanedText.length <= 10) {
            setPhone(cleanedText);
        }
    }

    // NEXT BUTTON
    async function handleNext() {

        if (!contactName.trim()) {

            Alert.alert(
                'Required',
                'Please enter contact name'
            );

            return;
        }

        if (!relationship.trim()) {

            Alert.alert(
                'Required',
                'Please enter relationship'
            );

            return;
        }

        if (phone.length < 10) {

            Alert.alert(
                'Required',
                'Please enter a valid 10 digit phone number'
            );

            return;
        }

        if (!isValidEmail(email)) {

            Alert.alert(
                'Required',
                'Please enter a valid email address'
            );

            return;
        }

        try {

            // save data
            await AsyncStorage.setItem(
                'contactName',
                contactName
            );

            await AsyncStorage.setItem(
                'relationship',
                relationship
            );

            await AsyncStorage.setItem(
                'emergencyPhone',
                phone
            );

            await AsyncStorage.setItem(
                'emergencyEmail',
                email
            );

            navigation.navigate('VehicleInfo');

        } catch (error) {

            console.log('Storage save error', error);
        }
    }

    return (

        <View style={styles.container}>


            <LinearGradient
                colors={['#0C7A54', '#1270B8']}
                style={styles.header}
            >

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backBtn}
                >

                    <Image
                        source={require('../assets/arrow.png')}
                        style={styles.backIcon}
                    />

                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Emergency Contact
                </Text>

                <View style={{ width: 30 }} />

            </LinearGradient>


            <View style={styles.stepsRow}>
                <View style={[styles.step, styles.stepDone]} />
                <View style={[styles.step, styles.stepDone]} />
                <View style={[styles.step, styles.stepDone]} />
                <View style={[styles.step, styles.stepActive]} />
                <View style={styles.step} />
            </View>

            <ScrollView
                style={styles.body}
                showsVerticalScrollIndicator={false}
            >


                <Text style={styles.label}>
                    Contact Name
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter contact name"
                    value={contactName}
                    onChangeText={setContactName}
                />


                <Text style={styles.label}>
                    Relationship
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="e.g. Spouse, Parent, Friend"
                    value={relationship}
                    onChangeText={setRelationship}
                />


                <Text style={styles.label}>
                    Phone Number
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="+91 XXXXX XXXXX"
                    value={phone}
                    onChangeText={handlePhoneChange}
                    keyboardType="phone-pad"
                    maxLength={10}
                />


                <Text style={styles.label}>
                    Email Address
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter email address"
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                {emailError ? (
                    <Text style={styles.errorText}>
                        {emailError}
                    </Text>
                ) : null}


                <TouchableOpacity
                    style={styles.nextBtn}
                    onPress={handleNext}
                >

                    <LinearGradient
                        colors={['#0C7A54', '#1270B8']}
                        style={styles.nextBtnGrad}
                    >

                        <Text style={styles.nextBtnText}>
                            Next →
                        </Text>

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

    backIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        tintColor: '#fff',
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

