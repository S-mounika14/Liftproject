import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from './screens/SplashScreen';
import JoinAsScreen from './screens/JoinAsScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import DocumentsScreen from './screens/DocumentsScreen';
import BankDetailsScreen from './screens/BankDetailsScreen';
import EmergencyContactScreen from './screens/EmergencyContactScreen';
import VehicleInfoScreen from './screens/VehicleInfoScreen';
import MapScreen from './screens/MapScreen';
import AddRideScreen from './screens/AddRideScreen';
import MyRidesScreen from './screens/MyRidesScreen';
import AccountScreen from './screens/AccountScreen';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import PermissionsScreen from './screens/PermissionsScreen';
import LiftSeekerHomeScreen from './screens/LiftSeekerHomeScreen';
import ReferScreen from './screens/ReferScreen';
import HistoryScreen from './screens/HistoryScreen';
import LiftSeekerProfileScreen from './screens/LiftSeekerProfileScreen';
import WalletScreen from './screens/WalletScreen';
import * as Battery from 'expo-battery';
import { useState, useEffect } from 'react';
import { Modal, TouchableOpacity, StyleSheet } from 'react-native';
import AddressScreen from './screens/AddressScreen';


import SearchingScreen from './screens/SearchingScreen';
import NoRideScreen from './screens/NoRideScreen';
import RideAcceptedScreen from './screens/RideAcceptedScreen';
import RideStartedScreen from './screens/RideStartedScreen';

import NavigateToSeekerScreen from './screens/Navigatetoseekerscreen';
import QRVerifyScreen from './screens/QRVerifyScreen';
import RideInProgressScreen from './screens/Rideinprogressscreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ContributorHomeStack = createStackNavigator();



function BottomTabs({ route }) {
  const { name, lastName, phone } = route.params || {};

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'AddRide') iconName = 'add-circle';
          else if (route.name === 'MyRides') iconName = 'car';
          else if (route.name === 'Account') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0C7A54',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={ContributorHomeStackNavigator} />


      {/* <Tab.Screen name="AddRide" component={AddRideScreen} /> */}
      <Tab.Screen name="MyRides" component={MyRidesScreen} />

      <Tab.Screen
        name="Account"
        component={AccountScreen}
        initialParams={{ name, lastName, phone }}
      />

    </Tab.Navigator>
  );
}

function LiftSeekerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Refer') iconName = 'gift';
          else if (route.name === 'History') iconName = 'time';
          else if (route.name === 'Profile') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0C7A54',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Refer" component={ReferScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />

      <Tab.Screen name="Profile" component={LiftSeekerProfileScreen} />
      <Tab.Screen
        name="Address"
        component={AddressScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location-outline" size={size} color={color} />
          ),
          tabBarLabel: 'Address'
        }}
      />

    </Tab.Navigator>
  );
}

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="LiftSeekerHome" component={LiftSeekerHomeScreen} />
      <HomeStack.Screen name="Searching" component={SearchingScreen} />
      <HomeStack.Screen name="NoRide" component={NoRideScreen} />
      <HomeStack.Screen name="RideAccepted" component={RideAcceptedScreen} />
      <HomeStack.Screen name="RideStarted" component={RideStartedScreen} />

    </HomeStack.Navigator>
  );
}

function ContributorHomeStackNavigator() {
  return (
    <ContributorHomeStack.Navigator screenOptions={{ headerShown: false }}>
      <ContributorHomeStack.Screen name="Map" component={MapScreen} />
      <ContributorHomeStack.Screen name="NavigateToSeeker" component={NavigateToSeekerScreen} />
      <ContributorHomeStack.Screen name="QRVerify" component={QRVerifyScreen} />
      <ContributorHomeStack.Screen name="RideInProgress" component={RideInProgressScreen} />
    </ContributorHomeStack.Navigator>
  );
}

export default function App() {

  const [lowBattery, setLowBattery] = useState(false);

  useEffect(() => {
    // check once on start
    Battery.getBatteryLevelAsync().then(level => {
      console.log('Battery level:', level);
      if (level < 0.64) setLowBattery(true);
    });

    // listen for changes
    const subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {

      if (batteryLevel < 0.64) setLowBattery(true);
      else setLowBattery(false);
    });

    return () => subscription.remove(); // cleanup
  }, []);
  return (
    <NavigationContainer>
      <Modal visible={lowBattery} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.box}>
            <Text style={styles.title}>🔋 Low Battery</Text>
            <Text>Battery below 6%. Please charge your phone.</Text>
            <TouchableOpacity onPress={() => setLowBattery(false)}>
              <Text style={styles.btn}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="JoinAs" component={JoinAsScreen} />
        <Stack.Screen
          name="CreateAccount"
          component={CreateAccountScreen}
          options={{ animation: 'slide_from_left' }} />


        <Stack.Screen name="Documents" component={DocumentsScreen} />
        <Stack.Screen name="BankDetails" component={BankDetailsScreen} />
        <Stack.Screen name="EmergencyContact" component={EmergencyContactScreen} />
        <Stack.Screen name="VehicleInfo" component={VehicleInfoScreen} />
        <Stack.Screen name="Main" component={BottomTabs} />
        {/* <Stack.Screen name="LiftSeekerMain" component={LiftSeekerTabs} /> */}
        <Stack.Screen name="Permissions" component={PermissionsScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="LiftSeekerMain" component={LiftSeekerTabs} />

        <Stack.Screen
          name="Profile"
          component={LiftSeekerProfileScreen}
          options={{
            headerShown: false,
            presentation: 'transparentModal',
            animation: 'none'
          }}
        />



      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  box: { backgroundColor: 'white', padding: 24, borderRadius: 12, alignItems: 'center', width: 280 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  btn: { marginTop: 16, color: '#0C7A54', fontWeight: 'bold', fontSize: 16 },
});