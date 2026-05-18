
import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BankDetailsScreen({ navigation }) {

    const [bankName, setBankName] = useState('');
    const [accountNo, setAccountNo] = useState('');
    const [accountType, setAccountType] = useState('current');
    const [ifsc, setIfsc] = useState('');
    const [bankAddress, setBankAddress] = useState('');
    const [pan, setPan] = useState('');

    const NAVY = '#1B2A6B';
    const LIGHT_NAVY = '#2A3F8F';
    const ORANGE = '#F5820A';

    useEffect(() => {
        loadSavedData();
    }, []);

    function isValidIfsc(code) {
        return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(code);
    }

    function isValidPan(value) {
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
    }

    async function loadSavedData() {

        try {

            const savedBankName = await AsyncStorage.getItem('bankName');
            const savedAccountNo = await AsyncStorage.getItem('accountNo');
            const savedAccountType = await AsyncStorage.getItem('accountType');
            const savedIfsc = await AsyncStorage.getItem('ifsc');
            const savedBankAddress = await AsyncStorage.getItem('bankAddress');

            if (savedBankName) {
                setBankName(savedBankName);
            }

            if (savedAccountNo) {
                setAccountNo(savedAccountNo);
            }

            if (savedAccountType) {
                setAccountType(savedAccountType);
            }

            if (savedIfsc) {
                setIfsc(savedIfsc);
            }

            if (savedBankAddress) {
                setBankAddress(savedBankAddress);
            }

        } catch (error) {
            console.log('Error loading bank data:', error);
        }
    }

    function handleAccountNoChange(text) {

        const numbersOnly = /^\d*$/;

        if (numbersOnly.test(text) && text.length <= 18) {
            setAccountNo(text);
        }
    }

    function handleIfscChange(text) {

        if (text.length <= 11) {
            setIfsc(text.toUpperCase());
        }
    }

    function handlePanChange(text) {

        if (text.length <= 10) {
            setPan(text.toUpperCase());
        }
    }

    async function handleNext() {

        if (!bankName.trim()) {
            Alert.alert('Required', 'Please enter bank name');
            return;
        }

        if (accountNo.length < 10 || accountNo.length > 18) {
            Alert.alert(
                'Required',
                'Account number must be 10–18 digits'
            );
            return;
        }

        if (bankName === 'SBI' && accountNo.length !== 11) {
            Alert.alert(
                'Invalid',
                'SBI account number must be 11 digits'
            );
            return;
        }

        if (
            bankName === 'HDFC' &&
            (accountNo.length < 13 || accountNo.length > 14)
        ) {
            Alert.alert(
                'Invalid',
                'HDFC account number must be 13–14 digits'
            );
            return;
        }

        if (!isValidIfsc(ifsc)) {
            Alert.alert(
                'Required',
                'Please enter a valid IFSC code'
            );
            return;
        }

        if (!isValidPan(pan)) {
            Alert.alert(
                'Required',
                'Enter valid PAN number'
            );
            return;
        }

        if (!bankAddress.trim()) {
            Alert.alert(
                'Required',
                'Please enter bank branch address'
            );
            return;
        }

        await AsyncStorage.setItem('bankName', bankName);
        await AsyncStorage.setItem('accountNo', accountNo);
        await AsyncStorage.setItem('accountType', accountType);
        await AsyncStorage.setItem('ifsc', ifsc);
        await AsyncStorage.setItem('pan', pan);
        await AsyncStorage.setItem('bankAddress', bankAddress);

        navigation.navigate('EmergencyContact');
    }

    return (

        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >

            <View style={styles.container}>

                <LinearGradient
                    colors={[NAVY, LIGHT_NAVY, NAVY]}
                    style={styles.header}
                >

                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                    >

                        <Image
                            source={require('../assets/arrow.png')}
                            style={styles.backImage}
                        />

                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Bank Details
                    </Text>

                    <View style={{ width: 30 }} />

                </LinearGradient>

                <View style={styles.stepsRow}>

                    <View style={[styles.step, styles.stepDone]} />
                    <View style={[styles.step, styles.stepDone]} />
                    <View style={[styles.step, styles.stepActive]} />
                    <View style={styles.step} />
                    <View style={styles.step} />

                </View>

                <ScrollView
                    style={styles.body}
                    showsVerticalScrollIndicator={false}
                >

                    <Text style={styles.label}>
                        Bank Name
                    </Text>

                    <View style={styles.radioRow}>

                        {['SBI', 'HDFC', 'ICICI', 'AXIS'].map((bank) => (

                            <TouchableOpacity
                                key={bank}
                                style={styles.radioOption}
                                onPress={() => setBankName(bank)}
                            >

                                <View style={styles.radioOuter}>

                                    {bankName === bank && (
                                        <View style={styles.radioInner} />
                                    )}

                                </View>

                                <Text style={styles.radioLabel}>
                                    {bank}
                                </Text>

                            </TouchableOpacity>

                        ))}

                    </View>

                    <Text style={styles.label}>
                        Account Number
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter account number"
                        value={accountNo}
                                                placeholderTextColor="#2A3F8F"

                        onChangeText={handleAccountNoChange}
                        keyboardType="number-pad"
                        maxLength={18}
                    />

                    <Text style={styles.label}>
                        Account Type
                    </Text>

                    <View style={styles.radioRow}>

                        <TouchableOpacity
                            style={styles.radioOption}
                            onPress={() => setAccountType('current')}
                        >

                            <View style={styles.radioOuter}>

                                {accountType === 'current' && (
                                    <View style={styles.radioInner} />
                                )}

                            </View>

                            <Text style={styles.radioLabel}>
                                Current
                            </Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.radioOption}
                            onPress={() => setAccountType('savings')}
                        >

                            <View style={styles.radioOuter}>

                                {accountType === 'savings' && (
                                    <View style={styles.radioInner} />
                                )}

                            </View>

                            <Text style={styles.radioLabel}>
                                Savings
                            </Text>

                        </TouchableOpacity>

                    </View>

                    <Text style={styles.label}>
                        IFSC Code
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="e.g. SBIN0001234"
                        value={ifsc}
                                                placeholderTextColor="#2A3F8F"

                        onChangeText={handleIfscChange}
                        autoCapitalize="characters"
                        maxLength={11}
                    />

                    {ifsc.length > 0 && !isValidIfsc(ifsc) && (

                        <Text style={styles.errorText}>
                            Invalid IFSC. Format: ABCD0123456
                        </Text>

                    )}

                    <Text style={styles.label}>
                        PAN Number
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="ABCDE1234F"
                                                placeholderTextColor="#2A3F8F"

                        value={pan}
                        onChangeText={handlePanChange}
                        maxLength={10}
                    />

                    {pan.length > 0 && !isValidPan(pan) && (

                        <Text style={styles.errorText}>
                            Invalid PAN format
                        </Text>

                    )}

                    <Text style={styles.label}>
                        Bank Branch Address
                    </Text>

                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Enter bank branch address"
                        value={bankAddress}
                        placeholderTextColor="#2A3F8F"
                        onChangeText={setBankAddress}
                        multiline
                        numberOfLines={3}
                    />

                    <TouchableOpacity
                        style={styles.nextBtn}
                        onPress={handleNext}
                    >

                        <LinearGradient
                            colors={[NAVY, LIGHT_NAVY, NAVY]}
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

    backImage: {
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
        justifyContent: 'center',
        paddingVertical: 12,
    },

    step: {
        width: 20,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D6DBF0',
        marginHorizontal: 2,
    },

    stepActive: {
        width: 30,
        backgroundColor: '#1B2A6B',
    },

    stepDone: {
        width: 22,
        backgroundColor: '#F5820A',
    },

    body: {
        paddingHorizontal: 20,
    },

    label: {
        fontSize: 11,
        fontWeight: '600',
        color: '#1B2A6B',
        marginBottom: 5,
        marginTop: 14,
    },

    input: {
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: '#F5820A',
        borderRadius: 10,
        padding: 11,
        fontSize: 13,
        color: '#1b2a6b',
    },

    radioRow: {
        flexDirection: 'row',
        marginTop: 4,
        marginBottom: 4,
    },

    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },

    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#1B2A6B',
        justifyContent: 'center',
        alignItems: 'center',
    },

    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 15,
        backgroundColor: '#1B2A6B',
    },

    radioLabel: {
        fontSize: 13,
        color: '#1B2A6B',
        fontWeight: '500',
        marginLeft: 8,
    },

    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },

    errorText: {
        color: 'red',
        fontSize: 11,
        marginTop: 3,
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

