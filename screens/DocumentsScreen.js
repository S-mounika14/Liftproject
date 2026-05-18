// SIMPLE BEGINNER FRIENDLY VERSION
// SAME UI + SAME FUNCTIONALITY

import React, { useEffect, useState } from 'react';

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { LinearGradient } from 'expo-linear-gradient';

import {
    AlertNotificationRoot,
    Dialog,
    ALERT_TYPE,
} from 'react-native-alert-notification';

const NAVY = '#1B2A6B';
const ORANGE = '#F5820A';
const LIGHTNAVY = '#2A3F8F'

export default function DocumentsScreen({ navigation }) {

    const [aadhaar, setAadhaar] = useState('');
    const [otp, setOtp] = useState('');

    const [realOtp, setRealOtp] = useState('');

    const [otpSent, setOtpSent] = useState(false);
    const [verified, setVerified] = useState(false);

    const [panFile, setPanFile] = useState('');
    const [licenceFile, setLicenceFile] = useState('');

    const [address, setAddress] = useState('');

    useEffect(() => {

        loadSavedData();
        getLocation();

    }, []);

    // LOAD SAVED DATA

    async function loadSavedData() {

        const aadhaarData = await AsyncStorage.getItem('aadhaar');
        const addressData = await AsyncStorage.getItem('address');

        const panData = await AsyncStorage.getItem('panFile');
        const licenceData = await AsyncStorage.getItem('licenceFile');

        if (aadhaarData) {
            setAadhaar(aadhaarData);
        }

        if (addressData) {
            setAddress(addressData);
        }

        if (panData) {
            setPanFile(panData);
        }

        if (licenceData) {
            setLicenceFile(licenceData);
        }
    }

    // GET LOCATION

    async function getLocation() {

        const permission =
            await Location.requestForegroundPermissionsAsync();

        if (permission.status !== 'granted') {
            return;
        }

        const location =
            await Location.getCurrentPositionAsync({});

        const addressResult =
            await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

        if (addressResult.length > 0) {

            const place = addressResult[0];

            const fullAddress =
                (place.street || '') + ', ' +
                (place.city || '') + ', ' +
                (place.region || '') + ', ' +
                (place.postalCode || '');

            setAddress(fullAddress);
        }
    }

    // PICK FILE

    async function pickFile(type) {

        const result =
            await DocumentPicker.getDocumentAsync({
                type: '*/*',
            });

        if (result.assets && result.assets.length > 0) {

            const fileName = result.assets[0].name;

            if (type === 'pan') {
                setPanFile(fileName);
            }

            if (type === 'licence') {
                setLicenceFile(fileName);
            }
        }
    }

    // SEND OTP

    function sendOtp() {

        if (aadhaar.length !== 12) {

            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'Invalid Aadhaar',
                textBody: 'Aadhaar must be 12 digits',
                button: 'OK',
            });

            return;
        }

        const newOtp =
            Math.floor(1000 + Math.random() * 9000).toString();

        setRealOtp(newOtp);

        setOtpSent(true);

        alert('OTP is ' + newOtp);
    }

    // VERIFY OTP

    function verifyOtp() {

        if (otp === realOtp) {

            setVerified(true);

            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Success',
                textBody: 'Aadhaar Verified',
                button: 'OK',
            });

        } else {

            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'Wrong OTP',
                textBody: 'Incorrect OTP',
                button: 'Try Again',
            });
        }
    }

    // AADHAAR INPUT

    function handleAadhaar(text) {

        const numbersOnly =
            text.replace(/[^0-9]/g, '');

        if (numbersOnly.length <= 12) {
            setAadhaar(numbersOnly);
        }
    }

    // NEXT BUTTON

    async function handleNext() {

        await AsyncStorage.setItem('aadhaar', aadhaar);

        await AsyncStorage.setItem('address', address);

        await AsyncStorage.setItem('panFile', panFile);

        await AsyncStorage.setItem('licenceFile', licenceFile);

        navigation.navigate('BankDetails');
    }

    return (

        <AlertNotificationRoot>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >

                <View style={styles.container}>

                    {/* HEADER */}

                    <LinearGradient
                        colors={['#1B2A6B', '#2A3F8F', '#1B2A6B']}
                        style={styles.header}
                    >

                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => navigation.goBack()}
                        >

                            <Image
                                source={require('../assets/arrow.png')}
                                style={styles.backIcon}
                            />

                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>
                            Contributor Documents
                        </Text>

                        <View style={{ width: 30 }} />

                    </LinearGradient>

                    {/* STEP BAR */}

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
                    >

                        {/* AADHAAR */}



                        <Text
                            style={[
                                styles.sectionTitle,
                                { marginTop: 14 }
                            ]}
                        >
                            Aadhaar Card
                        </Text>

                        <View style={styles.row}>

                            <TextInput
                                style={[
                                    styles.input,
                                    styles.inputFlex,
                                    styles.orangeInput,
                                ]}
                                placeholder="XXXX XXXX XXXX"
                                placeholderTextColor={LIGHTNAVY}
                                value={aadhaar}
                                onChangeText={handleAadhaar}
                                keyboardType="numeric"
                                maxLength={12}
                                editable={!otpSent}
                            />

                            <TouchableOpacity
                                style={styles.buttonBox}
                                onPress={sendOtp}
                                disabled={otpSent}
                            >

                                <LinearGradient
                                    colors={
                                        otpSent
                                            ? ['#EDF0F8', '#EDF0F8']
                                            : ['#1B2A6B', '#2A3F8F', '#1B2A6B']
                                    }
                                    style={styles.smallButton}
                                >

                                    <Text
                                        style={[
                                            styles.buttonText,
                                            otpSent && styles.grayText,
                                        ]}
                                    >

                                        {otpSent ? 'Sent ✓' : 'Send OTP'}

                                    </Text>

                                </LinearGradient>

                            </TouchableOpacity>

                        </View>

                        {/* OTP */}

                        <Text style={styles.otpLabel}>
                            Enter OTP
                        </Text>

                        <View style={styles.row}>

                            <TextInput
                                style={[
                                    styles.input,
                                    styles.inputFlex,
                                    styles.orangeInput,
                                ]}
                                placeholder="Enter Aadhaar OTP"
                                placeholderTextColor={LIGHTNAVY}
                                value={otp}
                                onChangeText={setOtp}
                                keyboardType="numeric"
                                maxLength={4}
                                editable={!verified}
                            />

                            <TouchableOpacity
                                style={styles.buttonBox}
                                onPress={verifyOtp}
                                disabled={verified}
                            >

                                <LinearGradient
                                    colors={
                                        verified
                                            ? ['#EDF0F8', '#EDF0F8']
                                            : ['#1B2A6B', '#2A3F8F', '#1B2A6B']
                                    }
                                    style={styles.smallButton}
                                >

                                    <Text
                                        style={[
                                            styles.buttonText,
                                            verified && styles.grayText,
                                        ]}
                                    >

                                        {verified ? 'Verified ✓' : 'Verify'}

                                    </Text>

                                </LinearGradient>

                            </TouchableOpacity>

                        </View>

                        {/* PAN */}

                        <Text style={styles.sectionTitle}>
                            PAN Card
                        </Text>

                        <TouchableOpacity
                            style={styles.uploadBtn}
                            onPress={() => pickFile('pan')}
                        >

                            <Text style={styles.uploadText}>

                                {panFile
                                    ? '✓ ' + panFile
                                    : '⬆ Upload PAN Card'}

                            </Text>

                        </TouchableOpacity>

                        {/* LICENCE */}

                        <Text style={styles.sectionTitle}>
                            Driving Licence
                        </Text>

                        <TouchableOpacity
                            style={styles.uploadBtn}
                            onPress={() => pickFile('licence')}
                        >

                            <Text style={styles.uploadText}>

                                {licenceFile
                                    ? '✓ ' + licenceFile
                                    : '⬆ Upload Driving Licence'}

                            </Text>

                        </TouchableOpacity>

                        <View style={{ alignItems: 'flex-end' }}>

                            <TouchableOpacity
                                onPress={() => pickFile('licence')}
                            >

                                <Text style={styles.updateLink}>
                                    Upload Updated Document
                                </Text>

                            </TouchableOpacity>

                        </View>

                        {/* ADDRESS */}


                        <Text style={styles.label}>
                            Full Address
                        </Text>

                        <TextInput
                            style={[
                                styles.input,
                                styles.textArea,
                            ]}
                            placeholder="Enter your full address"
                            placeholderTextColor="#A0AEC0"
                            value={address}
                            onChangeText={setAddress}
                            multiline
                        />

                        {/* NEXT BUTTON */}

                        <TouchableOpacity
                            style={styles.nextBtn}
                            onPress={handleNext}
                        >

                            <LinearGradient
                                colors={['#1B2A6B', '#2A3F8F', '#1B2A6B']}
                                style={styles.nextBtnGrad}
                            >

                                <Text style={styles.nextBtnText}>
                                    Next →
                                </Text>

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
        backgroundColor: '#FAFBFF',
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
        width: 22,
        height: 22,
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
        justifyContent: 'center',
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#EDF0F8',
    },

    step: {
        width: 20,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D6DBF0',
        marginHorizontal: 3,
    },

    stepDone: {
        backgroundColor: ORANGE,
    },

    stepActive: {
        width: 30,
        backgroundColor: NAVY,
    },

    body: {
        paddingHorizontal: 20,
    },

    sectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: NAVY,
        marginTop: 18,
        marginBottom: 6,
    },

    label: {
        fontSize: 11,
        color: NAVY,
        fontWeight: '700',
        marginBottom: 15,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    input: {
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: '#F5820A',
        borderRadius: 10,
        padding: 11,
        fontSize: 13,
        color: NAVY,
    },

    inputFlex: {
        flex: 1,
    },

    orangeInput: {
        borderColor: ORANGE,
        backgroundColor: '#fff',
    },

    buttonBox: {
        marginLeft: 8,
        borderRadius: 10,
        overflow: 'hidden',
    },

    smallButton: {
        paddingHorizontal: 13,
        paddingVertical: 11,
        alignItems: 'center',
    },

    buttonText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },

    grayText: {
        color: '#8896B3',
    },

    otpLabel: {
        fontSize: 11,
        color: NAVY,
        fontWeight: '700',
        marginTop: 8,
        marginBottom: 4,
    },

    uploadBtn: {
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: ORANGE,
        borderStyle: 'dashed',
        borderRadius: 10,
        padding: 13,
        alignItems: 'center',
        marginBottom: 8,
    },

    uploadText: {
        color: NAVY,
        fontWeight: '600',
        fontSize: 13,
    },

    updateLink: {
        fontSize: 12,
        color: ORANGE,
        textDecorationLine: 'underline',
        marginBottom: 10,
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