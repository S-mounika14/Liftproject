import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import * as Location from 'expo-location';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function AddRideScreen({ navigation }) {

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [vehicle, setVehicle] = useState('bike');
  const [time, setTime] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  async function getCurrentLocation() {

    const permission = await Location.requestForegroundPermissionsAsync();

    if (permission.status !== 'granted') {
      return;
    }

    let location = await Location.getLastKnownPositionAsync();

    if (!location) {

      location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
    }

    const address = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    if (address.length > 0) {

      const place = address[0];

      const fullAddress = [
        place.subregion,
        place.district,
        place.city,
        place.region,
      ]
        .filter(Boolean)
        .join(', ');

      setFrom(fullAddress);
    }
  }

  function handleTimeConfirm(date) {

    const hours = date.getHours();
    const minutes = date.getMinutes();

    let ampm = 'AM';

    if (hours >= 12) {
      ampm = 'PM';
    }

    let formattedHour = hours % 12;

    if (formattedHour === 0) {
      formattedHour = 12;
    }

    const formattedMinutes = String(minutes).padStart(2, '0');

    const finalTime =
      formattedHour + ':' + formattedMinutes + ' ' + ampm;

    setTime(finalTime);

    setShowPicker(false);
  }

  function handleTimeCancel() {
    setShowPicker(false);
  }

  function handleCreateRide() {

    if (!from || !to) {
      alert('Fill all fields');
      return;
    }

    if (!time) {
      alert('Select time');
      return;
    }

    navigation.navigate('MyRides', {
      newRide: {
        from: from,
        to: to,
        vehicle: vehicle,
        time: time,
      },
    });
  }

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Offer a Ride
      </Text>

      <View style={styles.card}>

        <Text style={styles.label}>
          From
        </Text>

        <TouchableOpacity onPress={getCurrentLocation}>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={from}
          onChangeText={setFrom}
        />

        <Text style={styles.label}>
          To
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter destination"
          value={to}
          onChangeText={setTo}
        />

        <Text style={styles.label}>
          Departure Time
        </Text>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowPicker(true)}
        >

          <Text
            style={{
              color: time ? '#1A2E25' : '#aaa',
            }}
          >
            {time ? time : 'Select Time'}
          </Text>

        </TouchableOpacity>

        <Text style={styles.label}>
          Vehicle Type
        </Text>

        <View style={styles.row}>

          <TouchableOpacity
            style={[
              styles.vehicleBtn,
              vehicle === 'bike' && styles.selected,
            ]}
            onPress={() => setVehicle('bike')}
          >

            <Text
              style={
                vehicle === 'bike'
                  ? styles.selectedText
                  : styles.text
              }
            >
              Bike
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.vehicleBtn,
              vehicle === 'car' && styles.selected,
            ]}
            onPress={() => setVehicle('car')}
          >

            <Text
              style={
                vehicle === 'car'
                  ? styles.selectedText
                  : styles.text
              }
            >
              Car
            </Text>

          </TouchableOpacity>

        </View>

      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateRide}
      >

        <Text style={styles.buttonText}>
          Create Ride
        </Text>

      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={showPicker}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={handleTimeCancel}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5FAF7',
    padding: 20,
    marginTop: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0C7A54',
    textAlign: 'center',
    marginBottom: 15,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#D4EBE2',
  },

  label: {
    fontSize: 12,
    color: '#7A9490',
    marginTop: 10,
    marginBottom: 5,
  },

  input: {
    backgroundColor: '#F5FAF7',
    borderWidth: 1,
    borderColor: '#D4EBE2',
    borderRadius: 12,
    padding: 10,
    fontSize: 13,
  },

  useLocation: {
    color: '#0C7A54',
    fontSize: 12,
    marginBottom: 5,
  },

  row: {
    flexDirection: 'row',
    marginTop: 10,
  },

  vehicleBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4EBE2',
    alignItems: 'center',
    backgroundColor: '#F5FAF7',
    marginRight: 10,
  },

  selected: {
    backgroundColor: '#EBF9F3',
    borderColor: '#0C7A54',
  },

  text: {
    color: '#7A9490',
  },

  selectedText: {
    color: '#0C7A54',
    fontWeight: '700',
  },

  button: {
    marginTop: 20,
    backgroundColor: '#0C7A54',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },

});
