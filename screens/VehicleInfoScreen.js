
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VehicleInfoScreen({ navigation }) {

  const [bikeSelected, setBikeSelected] = useState(false);
  const [carSelected, setCarSelected] = useState(false);

  const [policyNo, setPolicyNo] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [insuranceCompany, setInsuranceCompany] = useState('');

  const [rcFile, setRcFile] = useState(null);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const NAVY = '#1B2A6B';
  const LIGHT_NAVY = '#2A3F8F';
  const ORANGE = '#F5820A';

  // Load saved data
  useEffect(() => {

    async function loadSavedData() {

      const vehicleType = await AsyncStorage.getItem('vehicleType');
      const savedPolicyNo = await AsyncStorage.getItem('policyNo');
      const savedExpiryDate = await AsyncStorage.getItem('expiryDate');
      const savedInsuranceCompany = await AsyncStorage.getItem('insuranceCompany');
      const savedRCFile = await AsyncStorage.getItem('rcFile');

      if (vehicleType === 'bike' || vehicleType === 'both') {
        setBikeSelected(true);
      }

      if (vehicleType === 'car' || vehicleType === 'both') {
        setCarSelected(true);
      }

      if (savedPolicyNo) {
        setPolicyNo(savedPolicyNo);
      }

      if (savedExpiryDate) {
        setExpiryDate(savedExpiryDate);
      }

      if (savedInsuranceCompany) {
        setInsuranceCompany(savedInsuranceCompany);
      }

      if (savedRCFile) {
        setRcFile(savedRCFile);
      }

    }

    loadSavedData();

  }, []);

  // Pick RC file
  async function pickRCFile() {

    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
    });

    if (result.assets && result.assets.length > 0) {
      setRcFile(result.assets[0].name);
    }

  }

  // Date picker confirm
  function handleDateConfirm(date) {

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    setExpiryDate(`${day} / ${month} / ${year}`);

    setShowDatePicker(false);

  }

  // Submit form
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

    // Save vehicle type
    let selectedVehicle = '';

    if (bikeSelected && carSelected) {
      selectedVehicle = 'both';
    } else if (bikeSelected) {
      selectedVehicle = 'bike';
    } else {
      selectedVehicle = 'car';
    }

    await AsyncStorage.removeItem('vehicleType');

    await AsyncStorage.setItem('vehicleType', selectedVehicle);
    await AsyncStorage.setItem('policyNo', policyNo);
    await AsyncStorage.setItem('expiryDate', expiryDate);
    await AsyncStorage.setItem('insuranceCompany', insuranceCompany);
    await AsyncStorage.setItem('rcFile', rcFile || '');

    navigation.navigate('Main');

  }

  return (

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      <View style={styles.container}>

        {/* Header */}
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
              style={styles.backIcon}
            />

          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Vehicle Information
          </Text>

          <View style={{ width: 30 }} />

        </LinearGradient>

        {/* Steps */}
        <View style={styles.stepsRow}>

          <View style={[styles.step, styles.stepDone]} />
          <View style={[styles.step, styles.stepDone]} />
          <View style={[styles.step, styles.stepDone]} />
          <View style={[styles.step, styles.stepDone]} />
          <View style={[styles.step, styles.stepActive]} />

        </View>

        <ScrollView
          style={styles.body}
          showsVerticalScrollIndicator={false}
        >

          {/* Vehicle Type */}
          <Text style={styles.sectionTitle}>
            Vehicle Type
          </Text>

          <Text style={styles.label}>
            Select all that apply
          </Text>

          <View style={styles.checkRow}>

            {/* Bike */}
            <TouchableOpacity
              style={[
                styles.checkBox,
                bikeSelected && styles.checkBoxSelected,
              ]}
              onPress={() => {
                setBikeSelected(true);
                setCarSelected(false);
              }}
            >

              <View style={styles.radioOuter}>
                {bikeSelected && <View style={styles.radioInner} />}
              </View>

              <Text
                style={[
                  styles.checkLabel,
                  bikeSelected && styles.checkLabelSelected,
                ]}
              >
                Bike
              </Text>

            </TouchableOpacity>

            {/* Car */}
            <TouchableOpacity
              style={[
                styles.checkBox,
                carSelected && styles.checkBoxSelected,
              ]}
              onPress={() => {
                setCarSelected(true);
                setBikeSelected(false);
              }}
            >

              <View style={styles.radioOuter}>
                {carSelected && <View style={styles.radioInner} />}
              </View>

              <Text
                style={[
                  styles.checkLabel,
                  carSelected && styles.checkLabelSelected,
                ]}
              >
                Car
              </Text>

            </TouchableOpacity>

          </View>

          <View style={styles.divider} />

          {/* RC Upload */}
          <Text style={styles.sectionTitle}>
            Registration Certificate
          </Text>

          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={pickRCFile}
          >

            <Text style={styles.uploadText}>
              {rcFile
                ? `✓ ${rcFile}`
                : ' Upload RC Document'}
            </Text>

          </TouchableOpacity>

          <View style={styles.updateDocWrap}>

            <TouchableOpacity onPress={pickRCFile}>

              <Text style={styles.updateDocText}>
                Upload Updated Document
              </Text>

            </TouchableOpacity>

          </View>

          <View style={styles.divider} />

          {/* Insurance */}
          <Text style={styles.sectionTitle}>
            Insurance Particulars
          </Text>

          {/* Policy Number */}
          <Text style={styles.label}>
            Policy Number
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter policy number (e.g. ICICI-1234567890-01)"
            placeholderTextColor="#2a3f8f"
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

            <Text style={styles.errorText}>
              Policy number must be at least 10 characters
            </Text>

          )}

          {/* Expiry Date */}
          <Text style={styles.label}>
            Date of Expiry
          </Text>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >

            <Text
              style={{
                color: expiryDate ? '#1A2E25' : '#2A3F8F',
                fontSize: 13,
              }}
            >
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

          {/* Insurance Company */}
          <Text style={styles.label}>
            Insurance Company
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter insurance company name"
            value={insuranceCompany}
              placeholderTextColor="#2a3f8f"

            onChangeText={setInsuranceCompany}
          />

          {/* Submit */}
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={handleSubmit}
          >

            <LinearGradient
              colors={[NAVY, LIGHT_NAVY, NAVY]}
              style={styles.nextBtnGrad}
            >

              <Text style={styles.nextBtnText}>
                Submit Registration ✓
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
    backgroundColor: '#D6DBF0',
  },

  stepDone: {
    width: 22,
    backgroundColor: '#F5820A',
  },

  stepActive: {
    width: 30,
    backgroundColor: '#1B2A6B',
  },

  body: {
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1B2A6B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 14,
    marginBottom: 6,
  },

  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1B2A6B',
    marginBottom: 5,
    marginTop: 10,
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#F5820A',
    borderRadius: 10,
    padding: 11,
    fontSize: 13,
    color: '#1B2A6B',
  },

  checkRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 6,
  },

  checkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F5820A',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  

 checkBoxSelected: {
  backgroundColor: '#9bafd9',
  borderColor: '#1B2A6B',
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
    borderRadius: 5,
    backgroundColor: '#1b2a6b',
  },

  checkLabel: {
    fontSize: 13,
    color: '#8896B3',
    fontWeight: '500',
  },

  checkLabelSelected: {
    color: '#1B2A6B',
    fontWeight: '700',
  },

  uploadBtn: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#F5820A',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginBottom: 10,
  },

 

  uploadText: {
    color: '#1b2a6b',
    fontWeight: '600',
    fontSize: 13,
  },

  updateDocWrap: {
    alignItems: 'flex-end',
    marginTop: 1,
    marginBottom: 5,
  },

  updateDocText: {
    fontSize: 13,
    color: '#F5820A',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },

  divider: {
    borderTopWidth: 1,
    borderColor: '#EDF0F8',
    marginVertical: 14,
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

