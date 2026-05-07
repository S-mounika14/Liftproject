import React, { useState, useEffect } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';

export default function DocumentsScreen({ navigation }) {

    const [aadhaar, setAadhaar] = useState('');
    const [aadhaarOtp, setAadhaarOtp] = useState('');
    const [aadhaarVerified, setAadhaarVerified] = useState(false);
    const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false);
    const [generatedAadhaarOtp, setGeneratedAadhaarOtp] = useState('');
    const [address, setAddress] = useState('');
    const [panFile, setPanFile] = useState(null);
    const [licenceFile, setLicenceFile] = useState(null);

    // pick file from device
    async function pickFile(setFile) {
        let result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
        if (result.assets && result.assets.length > 0) {
            setFile(result.assets[0].name);
        }
    }

    // load saved data when screen opens
    useEffect(() => {
        loadSavedData();
    }, []);

    async function loadSavedData() {
        try {
            let savedAadhaar = await AsyncStorage.getItem('aadhaar');
            let savedAddress = await AsyncStorage.getItem('address');
            let savedPan = await AsyncStorage.getItem('panFile');
            let savedLicence = await AsyncStorage.getItem('licenceFile');

            if (savedAadhaar != null) setAadhaar(savedAadhaar);
            if (savedAddress != null) setAddress(savedAddress);
            if (savedPan != null) setPanFile(savedPan);
            if (savedLicence != null) setLicenceFile(savedLicence);
        } catch (e) {
            console.log('error loading saved data', e);
        }
    }

    // get address from current location
    useEffect(() => {
        getAddressFromLocation();
    }, []);

    async function getAddressFromLocation() {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        const currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest
        });

        const addressResponse = await Location.reverseGeocodeAsync({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
        });

        if (addressResponse.length > 0) {
            const p = addressResponse[0];

            // log to see what fields you actually get
            console.log('Full address object:', JSON.stringify(p, null, 2));

            const fullAddress = [
                p.streetNumber,
                p.street,
                p.name,
                p.subregion,
                p.district,
                p.city,
                p.region,
                p.postalCode
            ]
                .filter(Boolean)
                .join(', ');

            setAddress(fullAddress);
        }
    }

    // send otp to verify aadhaar
    function handleSendAadhaarOtp() {
        if (aadhaar.length < 12) {
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'Invalid Aadhaar',
                textBody: 'Aadhaar must be 12 digits',
                button: 'OK',
            });
            return;
        }
        var otp = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedAadhaarOtp(otp);
        setAadhaarOtpSent(true);
        alert("Your Aadhaar OTP is " + otp);
    }

    // verify aadhaar otp entered by user
    function handleVerifyAadhaarOtp() {
        if (aadhaarOtp.length < 4) {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: 'Enter OTP',
                textBody: 'Please enter the 4 digit OTP',
                button: 'OK',
            });
            return;
        }
        if (aadhaarOtp === generatedAadhaarOtp) {
            setAadhaarVerified(true);
            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Success',
                textBody: 'Aadhaar verified successfully',
                button: 'OK',
            });
        } else {
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'Wrong OTP',
                textBody: 'The OTP you entered is incorrect',
                button: 'Try Again',
            });
        }
    }

    // handle aadhaar number input - only allow 12 digits
    function handleAadhaarChange(text) {
        if (text.length <= 12) {
            setAadhaar(text);
        }
    }

    // validate all fields and go to next screen
    async function handleNext() {

        // if (!aadhaarVerified) {
        //     Dialog.show({
        //         type: ALERT_TYPE.WARNING,
        //         title: 'Required',
        //         textBody: 'Please verify your Aadhaar first',
        //         button: 'OK'
        //     });
        //     return;
        // }

        // if (!panFile) {
        //     Dialog.show({
        //         type: ALERT_TYPE.WARNING,
        //         title: 'Required',
        //         textBody: 'Please upload your PAN card',
        //         button: 'OK'
        //     });
        //     return;
        // }

        // if (!licenceFile) {
        //     Dialog.show({
        //         type: ALERT_TYPE.WARNING,
        //         title: 'Required',
        //         textBody: 'Please upload your Driving Licence',
        //         button: 'OK'
        //     });
        //     return;
        // }

        // if (!address.trim()) {
        //     Dialog.show({
        //         type: ALERT_TYPE.WARNING,
        //         title: 'Required',
        //         textBody: 'Please enter your address',
        //         button: 'OK'
        //     });
        //     return;
        // }

        // save all data to storage
        await AsyncStorage.setItem('aadhaar', aadhaar);
        await AsyncStorage.setItem('address', address);
        await AsyncStorage.setItem('panFile', panFile || '');
        await AsyncStorage.setItem('licenceFile', licenceFile || '');

        navigation.navigate('BankDetails');
    }

    return (
        <AlertNotificationRoot>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.container}>

                    {/* header */}
                    <LinearGradient colors={['#0C7A54', '#1270B8']} style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <Image
                                source={require('../assets/arrow.png')}
                                style={{ width: 30, height: 30, resizeMode: 'contain', tintColor: '#fff' }}
                            />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Contributor Documents</Text>
                        <View style={{ width: 30 }} />
                    </LinearGradient>

                    {/* step progress bar */}
                    <View style={styles.stepsRow}>
                        <View style={[styles.step, styles.stepDone]} />
                        <View style={[styles.step, styles.stepActive]} />
                        <View style={styles.step} />
                        <View style={styles.step} />
                        <View style={styles.step} />
                    </View>

                    <ScrollView
                        style={styles.body}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >

                        {/* aadhaar section */}
                        <Text style={styles.sectionTitle}>Aadhaar Card</Text>
                        <Text style={styles.label}>Aadhaar Number</Text>
                        <View style={styles.row}>
                            <TextInput
                                style={[
                                    styles.input,
                                    styles.inputFlex,
                                    aadhaarOtpSent && styles.inputDisabled
                                ]}
                                placeholder="XXXX XXXX XXXX"
                                value={aadhaar}
                                onChangeText={handleAadhaarChange}
                                keyboardType="number-pad"
                                maxLength={12}
                                editable={!aadhaarOtpSent}
                            />
                            <TouchableOpacity
                                style={[styles.verifyBtn, aadhaarOtpSent && styles.verifiedBtn]}
                                onPress={handleSendAadhaarOtp}
                                disabled={aadhaarOtpSent}
                            >
                                <Text style={[styles.verifyText, aadhaarOtpSent && styles.verifiedText]}>
                                    {aadhaarOtpSent ? 'Sent ✓' : 'Send OTP'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.otpLabel}>Enter OTP</Text>
                        <View style={styles.row}>
                            <TextInput
                                style={[
                                    styles.input,
                                    styles.inputFlex,
                                    aadhaarVerified && styles.inputDisabled
                                ]}
                                placeholder="Enter Aadhaar OTP"
                                value={aadhaarOtp}
                                onChangeText={setAadhaarOtp}
                                keyboardType="number-pad"
                                maxLength={4}
                                editable={!aadhaarVerified}
                            />
                            <TouchableOpacity
                                style={[styles.verifyBtn, aadhaarVerified && styles.verifiedBtn]}
                                onPress={handleVerifyAadhaarOtp}
                                disabled={aadhaarVerified}
                            >
                                <Text style={[styles.verifyText, aadhaarVerified && styles.verifiedText]}>
                                    {aadhaarVerified ? 'Verified ✓' : 'Verify'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* pan card section */}
                        <Text style={styles.sectionTitle}>PAN Card</Text>
                        <TouchableOpacity style={styles.uploadBtn} onPress={() => pickFile(setPanFile)}>
                            <Text style={styles.uploadText}>
                                {panFile ? '✓  ' + panFile : ' Upload PAN Card'}
                            </Text>
                        </TouchableOpacity>

                        {/* driving licence section */}
                        <Text style={styles.sectionTitle}>Driving Licence</Text>
                        <TouchableOpacity style={styles.uploadBtn} onPress={() => pickFile(setLicenceFile)}>
                            <Text style={styles.uploadText}>
                                {licenceFile ? '✓  ' + licenceFile : 'Upload Driving Licence'}
                            </Text>
                        </TouchableOpacity>

                        <View style={{ alignItems: 'flex-end', marginTop: 1, marginBottom: 5 }}>
                            <TouchableOpacity onPress={() => pickFile(setLicenceFile)}>
                                <Text style={{ fontSize: 13, color: '#0C7A54', textDecorationLine: 'underline', fontWeight: '600' }}>
                                    Upload Updated Document
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* address section */}
                        <Text style={styles.sectionTitle}>Address</Text>
                        <Text style={styles.label}>Full Address</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Enter your full address"
                            value={address}
                            onChangeText={setAddress}
                            multiline
                            numberOfLines={3}
                        />

                        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                            <LinearGradient colors={['#0C7A54', '#1270B8']} style={styles.nextBtnGrad}>
                                <Text style={styles.nextBtnText}>Next →</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                    </ScrollView>

                </View>
            </KeyboardAvoidingView>
        </AlertNotificationRoot>
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

    sectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: '#1270B8',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: 14,
        marginBottom: 6,
    },

    label: {
        fontSize: 11,
        fontWeight: '600',
        color: '#7A9490',
        marginBottom: 5,
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

    inputFlex: {
        flex: 1,
    },

    inputDisabled: {
        backgroundColor: '#F0F0F0',
        opacity: 0.6,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    verifyBtn: {
        backgroundColor: '#0C7A54',
        paddingHorizontal: 12,
        paddingVertical: 11,
        borderRadius: 10,
    },

    verifiedBtn: {
        backgroundColor: '#E2F7EE',
        borderWidth: 1.5,
        borderColor: '#22C98A',
    },

    verifyText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },

    verifiedText: {
        color: '#0C7A54',
    },

    otpLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#7A9490',
        marginTop: 8,
        marginBottom: 4,
    },

    uploadBtn: {
        backgroundColor: '#F5FAF7',
        borderWidth: 1.5,
        borderColor: '#9FD4BE',
        borderStyle: 'dashed',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
        marginBottom: 10,
    },

    uploadText: {
        color: '#0C7A54',
        fontWeight: '600',
        fontSize: 13,
    },

    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },

    nextBtn: {
        borderRadius: 40,
        overflow: 'hidden',
        marginTop: 20,
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