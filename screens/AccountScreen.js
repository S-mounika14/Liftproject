
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function AccountScreen({ navigation }) {

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {

    try {

      const savedName = await AsyncStorage.getItem('name');
      const savedLastName = await AsyncStorage.getItem('lastName');
      const savedPhone = await AsyncStorage.getItem('phone');
      const savedPhoto = await AsyncStorage.getItem('photo');

      console.log('Name:', savedName);
      console.log('Last Name:', savedLastName);
      console.log('Phone:', savedPhone);

      if (savedName) {
        setName(savedName);
      }

      if (savedLastName) {
        setLastName(savedLastName);
      }

      if (savedPhone) {
        setPhone(savedPhone);
      }

      if (savedPhoto) {
        setImage(savedPhoto);
      }

    } catch (error) {
      console.log('Error loading user data:', error);
    }
  }

  async function openOptions() {

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {

      const selectedImage = result.assets[0].uri;

      setImage(selectedImage);
    }
  }

  async function handleLogout() {

    await AsyncStorage.removeItem('isLoggedIn');

    navigation.replace('JoinAs');
  }

  const displayName = name ? `${name} ${lastName}` : 'User';

  const displayPhone = phone || 'No Number';

  return (

    <ScrollView style={styles.container}>

      <LinearGradient
        colors={['#0C7A54', '#1270B8']}
        style={styles.topBand}
      >

        <TouchableOpacity onPress={openOptions}>

          {image ? (

            <Image
              source={{ uri: image }}
              style={styles.avatar}
            />

          ) : (

            <View style={styles.avatar}>
              <Ionicons
                name="person"
                size={45}
                color="#0C7A54"
              />
            </View>

          )}

        </TouchableOpacity>

        <Text style={styles.name}>
          {displayName}
        </Text>

        <Text style={styles.phone}>
          {displayPhone}
        </Text>

      </LinearGradient>

      <View style={styles.menuCard}>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Documents')}
        >

          <Ionicons
            name="document-text-outline"
            size={22}
            color="#0C7A54"
            style={styles.menuIcon}
          />

          <Text style={styles.menuText}>
            Documents
          </Text>

          <Text style={styles.menuArrow}>
            ›
          </Text>

        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('VehicleInfo')}
        >

          <Ionicons
            name="car-outline"
            size={22}
            color="#0C7A54"
            style={styles.menuIcon}
          />

          <Text style={styles.menuText}>
            Vehicle Info
          </Text>

          <Text style={styles.menuArrow}>
            ›
          </Text>

        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('BankDetails')}
        >

          <Ionicons
            name="card-outline"
            size={22}
            color="#0C7A54"
            style={styles.menuIcon}
          />

          <Text style={styles.menuText}>
            Bank Details
          </Text>

          <Text style={styles.menuArrow}>
            ›
          </Text>

        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('EmergencyContact')}
        >

          <Ionicons
            name="warning-outline"
            size={22}
            color="#0C7A54"
            style={styles.menuIcon}
          />

          <Text style={styles.menuText}>
            Emergency Contact
          </Text>

          <Text style={styles.menuArrow}>
            ›
          </Text>

        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            Linking.openURL(
              'mailto:2080tecnologiesprivatelimited@gmail.com'
            )
          }
        >

          <Ionicons
            name="mail-outline"
            size={22}
            color="#0C7A54"
            style={styles.menuIcon}
          />

          <Text style={styles.menuText}>
            Help & Support
          </Text>

        </TouchableOpacity>

      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
      >

        <Text style={styles.logoutText}>
          Logout
        </Text>

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

