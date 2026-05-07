import { useState,useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VehicleInfoScreen({ navigation }) {

    const [bikeSelected, setBikeSelected] = useState(false);
    const [carSelected, setCarSelected] = useState(false);
    const [policyNo, setPolicyNo] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [insuranceCompany, setInsuranceCompany] = useState('');
    const [rcFile, setRcFile] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    async function pickRCFile() {
        let result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
        if (result.assets && result.assets.length > 0) {
            setRcFile(result.assets[0].name);
        }
    }
    useEffect(() => {
        async function loadSaved() {
            const vt = await AsyncStorage.getItem('vehicleType');
            const pn = await AsyncStorage.getItem('policyNo');
            const ed = await AsyncStorage.getItem('expiryDate');
            const ic = await AsyncStorage.getItem('insuranceCompany');
            const rc = await AsyncStorage.getItem('rcFile');
            if (vt === 'bike' || vt === 'both') setBikeSelected(true);
            if (vt === 'car' || vt === 'both') setCarSelected(true);
            if (pn) setPolicyNo(pn);
            if (ed) setExpiryDate(ed);
            if (ic) setInsuranceCompany(ic);
            if (rc) setRcFile(rc);
        }
        loadSaved();
    }, []);

    function handleDateConfirm(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        setExpiryDate(`${day} / ${month} / ${year}`);
        setShowDatePicker(false);
    }

    // FIX: Validate before submitting
    async function handleSubmit() {
        if (!bikeSelected && !carSelected) {
            Alert.alert('Required', 'Please select at least one vehicle type');
            return;
        }
        if (!rcFile) {
            Alert.alert('Required', 'Please upload your RC document');
            return;
        }
        if (policyNo.length < 10) {
            Alert.alert('Required', 'Enter valid policy number');
            return;
        }
        if (!expiryDate) {
            Alert.alert('Required', 'Please select insurance expiry date');
            return;
        }
        if (!insuranceCompany.trim()) {
            Alert.alert('Required', 'Please enter insurance company name');
            return;
        }
        await AsyncStorage.removeItem('vehicleType'); // 🔥 clear old
        await AsyncStorage.setItem('vehicleType', bikeSelected && carSelected ? 'both' : bikeSelected ? 'bike' : 'car');
        await AsyncStorage.setItem('policyNo', policyNo);
        await AsyncStorage.setItem('expiryDate', expiryDate);
        await AsyncStorage.setItem('insuranceCompany', insuranceCompany);
        await AsyncStorage.setItem('rcFile', rcFile || '');
        navigation.navigate('Main');
        // Alert.alert('Success', 'Registration submitted successfully!');
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.container}>

                <LinearGradient colors={['#0C7A54', '#1270B8']} style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Image
                            source={require('../assets/arrow.png')}
                            style={{ width: 30, height: 30, resizeMode: 'contain', tintColor: '#fff' }}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Vehicle Information</Text>
                    <View style={{ width: 30 }} />
                </LinearGradient>

                <View style={styles.stepsRow}>
                    <View style={[styles.step, styles.stepDone]} />
                    <View style={[styles.step, styles.stepDone]} />
                    <View style={[styles.step, styles.stepDone]} />
                    <View style={[styles.step, styles.stepDone]} />
                    <View style={[styles.step, styles.stepActive]} />
                </View>

                <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

                    {/* VEHICLE TYPE */}
                    <Text style={styles.sectionTitle}>Vehicle Type</Text>
                    <Text style={styles.label}>Select all that apply</Text>
                    <View style={styles.checkRow}>

                        <TouchableOpacity
                            style={[styles.checkBox, bikeSelected && styles.checkBoxSelected]}
                            onPress={() => setBikeSelected(!bikeSelected)}
                        >
                            <View style={[styles.checkbox, bikeSelected && styles.checkboxChecked]}>
                                {bikeSelected && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text style={[styles.checkLabel, bikeSelected && styles.checkLabelSelected]}>Bike</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.checkBox, carSelected && styles.checkBoxSelected]}
                            onPress={() => setCarSelected(!carSelected)}
                        >
                            <View style={[styles.checkbox, carSelected && styles.checkboxChecked]}>
                                {carSelected && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text style={[styles.checkLabel, carSelected && styles.checkLabelSelected]}>Car</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.divider} />

                    {/* RC DOCUMENT */}
                    <Text style={styles.sectionTitle}>Registration Certificate</Text>
                    <TouchableOpacity style={styles.uploadBtn} onPress={pickRCFile}>
                        <Text style={styles.uploadText}>{rcFile ? '✓  ' + rcFile : ' Upload RC Document'}</Text>
                    </TouchableOpacity>

                    <View style={{ alignItems: 'flex-end', marginTop: 1, marginBottom: 5 }}>
                        <TouchableOpacity onPress={() => pickFile(setLicenceFile)}>
                            <Text style={{ fontSize: 13, color: '#0C7A54', textDecorationLine: 'underline', fontWeight: '600' }}>
                                Upload Updated Document
                            </Text>
                        </TouchableOpacity>
                    </View>



                    <View style={styles.divider} />

                    {/* INSURANCE */}
                    <Text style={styles.sectionTitle}>Insurance Particulars</Text>

                    <Text style={styles.label}>Policy Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter policy number (e.g. ICICI-1234567890-01)"
                        value={policyNo}
                        onChangeText={(text) => {
                            if (/^[a-zA-Z0-9/-]*$/.test(text)) {
                                setPolicyNo(text);
                            }
                        }}
                        keyboardType="default"
                        maxLength={25}
                    />
                    {policyNo.length > 0 && policyNo.length < 10 && (
                        <Text style={styles.errorText}>Policy number must be at least 10 characters</Text>
                    )}

                    <Text style={styles.label}>Date of Expiry</Text>
                    <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                        <Text style={{ color: expiryDate ? '#1A2E25' : '#aaa', fontSize: 13 }}>
                            {expiryDate || 'DD / MM / YYYY'}
                        </Text>
                    </TouchableOpacity>

                    <DateTimePickerModal
                        isVisible={showDatePicker}
                        mode="date"
                        minimumDate={new Date()}
                        onConfirm={handleDateConfirm}
                        onCancel={() => setShowDatePicker(false)}
                    />

                    <Text style={styles.label}>Insurance Company</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter insurance company name"
                        value={insuranceCompany}
                        onChangeText={setInsuranceCompany}
                    />

                    <TouchableOpacity style={styles.nextBtn} onPress={handleSubmit}>
                        <LinearGradient colors={['#0C7A54', '#1270B8']} style={styles.nextBtnGrad}>
                            <Text style={styles.nextBtnText}>Submit Registration ✓</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: '#fff' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 14,
        paddingHorizontal: 16,
    },

    backBtn: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },

    headerTitle: {
        flex: 1,
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
        textAlign: 'center',
    },

    stepsRow: { flexDirection: 'row', gap: 5, justifyContent: 'center', paddingVertical: 12 },
    step: { width: 20, height: 4, borderRadius: 2, backgroundColor: '#D4EBE2' },
    stepActive: { width: 30, backgroundColor: '#0C7A54' },
    stepDone: { width: 22, backgroundColor: '#22C98A' },

    body: { paddingHorizontal: 20 },

    sectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: '#1270B8',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: 14,
        marginBottom: 6,
    },

    label: { fontSize: 11, fontWeight: '600', color: '#7A9490', marginBottom: 5, marginTop: 10 },

    input: {
        backgroundColor: '#F5FAF7',
        borderWidth: 1,
        borderColor: '#D4EBE2',
        borderRadius: 10,
        padding: 11,
        fontSize: 13,
        color: '#1A2E25',
    },

    checkRow: { flexDirection: 'row', gap: 10, marginBottom: 6 },

    checkBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#F5FAF7',
        borderWidth: 1,
        borderColor: '#D4EBE2',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },

    checkBoxSelected: { backgroundColor: '#EBF9F3', borderColor: '#0C7A54' },

    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: '#D4EBE2',
        justifyContent: 'center',
        alignItems: 'center',
    },

    checkboxChecked: { backgroundColor: '#0C7A54', borderColor: '#0C7A54' },
    checkmark: { color: '#fff', fontSize: 11, fontWeight: '700' },
    checkLabel: { fontSize: 13, color: '#7A9490', fontWeight: '500' },
    checkLabelSelected: { color: '#0C7A54', fontWeight: '700' },

    uploadBtn: {
        backgroundColor: '#F5FAF7',
        borderWidth: 1.5,
        borderColor: '#9FD4BE',
        borderStyle: 'dashed',
        borderRadius: 10,
        padding: 14,
        alignItems: 'center',
        marginBottom: 10,
    },

    uploadText: { color: '#0C7A54', fontWeight: '600', fontSize: 13 },
    divider: { borderTopWidth: 1, borderColor: '#EAF2EE', marginVertical: 14 },
    errorText: { color: 'red', fontSize: 11, marginTop: 3 },

    nextBtn: { borderRadius: 40, overflow: 'hidden', marginTop: 24, marginBottom: 30 },
    nextBtnGrad: { padding: 14, alignItems: 'center' },
    nextBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

});