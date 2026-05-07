import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';


export default function AccountScreen({ navigation, route }) {

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState(null);

  // load user data when screen opens
  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      let savedName = await AsyncStorage.getItem('name');
      let savedLastName = await AsyncStorage.getItem('lastName');
      let savedPhone = await AsyncStorage.getItem('phone');
      let savedPhoto = await AsyncStorage.getItem('photo');

      console.log('name is:', savedName);
      console.log('lastName:', savedLastName);
      console.log('phone:', savedPhone);

      if (savedName != null) {
        setName(savedName);
      }
      if (savedLastName != null) {
        setLastName(savedLastName);
      }
      if (savedPhone != null) {
        setPhone(savedPhone);
      }
      if (savedPhoto != null) {
        setImage(savedPhoto);
      }
    } catch (e) {
      console.log('error loading data', e);
    }
  }

  // open image picker to change profile photo
  async function openOptions() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled == false) {
      setImage(result.assets[0].uri);
    }
  }

  // logout function
  async function handleLogout() {
    await AsyncStorage.removeItem('isLoggedIn');
    navigation.replace('JoinAs');
  }

  let displayName = 'User';
  if (name != '') {
    displayName = name + ' ' + lastName;
  }

  let displayPhone = 'No Number';
  if (phone != '') {
    displayPhone = phone;
  }

  return (
    <ScrollView style={styles.container}>

      {/* top green/blue section with profile pic */}
      <LinearGradient colors={['#0C7A54', '#1270B8']} style={styles.topBand}>

        <TouchableOpacity onPress={openOptions}>
          {image != null ? (
            <Image source={{ uri: image }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Ionicons name="person" size={45} color="#0C7A54" />
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.phone}>{displayPhone}</Text>

      </LinearGradient>

      {/* menu options card */}
      <View style={styles.menuCard}>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Documents')}>
          <Ionicons name="document-text-outline" size={22} color="#0C7A54" style={styles.menuIcon} />
          <Text style={styles.menuText}>Documents</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('VehicleInfo')}>
          <Ionicons name="car-outline" size={22} color="#0C7A54" style={styles.menuIcon} />
          <Text style={styles.menuText}>Vehicle Info</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('BankDetails')}>
          <Ionicons name="card-outline" size={22} color="#0C7A54" style={styles.menuIcon} />
          <Text style={styles.menuText}>Bank Details</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('EmergencyContact')}>
          <Ionicons name="warning-outline" size={22} color="#0C7A54" style={styles.menuIcon} />
          <Text style={styles.menuText}>Emergency Contact</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        {/* help support - opens email */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            Linking.openURL('mailto:2080tecnologiesprivatelimited@gmail.com');
          }}
        >
          <Ionicons name="mail-outline" size={22} color="#0C7A54" style={styles.menuIcon} />
          <Text style={styles.menuText}>Help & Support</Text>
        </TouchableOpacity>

      </View>

      {/* logout button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },

  topBand: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    overflow: 'hidden',
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginTop: 6,
  },

  phone: {
    fontSize: 13,
    color: '#D4EBE2',
    marginTop: 2,
  },

  menuCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },

  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },

  menuText: {
    flex: 1,
    fontSize: 14,
    color: '#1A2E25',
    fontWeight: '500',
  },

  menuArrow: {
    fontSize: 20,
    color: '#7A9490',
  },

  menuDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 46,
  },

  logoutBtn: {
    marginHorizontal: 16,
    padding: 14,
    backgroundColor: '#FFF0F0',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF4D4D',
  },

  logoutText: {
    color: '#FF4D4D',
    fontWeight: '700',
    fontSize: 14,
  },

});