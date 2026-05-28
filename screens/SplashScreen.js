// import React, { useEffect, useRef } from 'react';
// import { StyleSheet, Animated, StatusBar, View } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as NavigationBar from 'expo-navigation-bar';

// export default function SplashScreen({ navigation }) {
//     const logoOpacity = useRef(new Animated.Value(0)).current;
//     const logoTranslateY = useRef(new Animated.Value(50)).current;
//     const textOpacity = useRef(new Animated.Value(0)).current;

//     useEffect(() => {
//         NavigationBar.setBackgroundColorAsync('#1270B8');
//         NavigationBar.setButtonStyleAsync('light');
//         Animated.sequence([
//             Animated.parallel([
//                 Animated.timing(logoOpacity, {
//                     toValue: 1,
//                     duration: 800,
//                     useNativeDriver: true,
//                 }),
//                 Animated.timing(logoTranslateY, {
//                     toValue: 0,
//                     duration: 800,
//                     useNativeDriver: true,
//                 }),
//             ]),
//             Animated.timing(textOpacity, {
//                 toValue: 1,
//                 duration: 600,
//                 useNativeDriver: true,
//             }),
//         ]).start();

//         const timer = setTimeout(() => {
//             checkLogin();
//         }, 5500);
//         return () => clearTimeout(timer);
//     }, []);

//     async function checkLogin() {
//         const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
//         const onboardingDone = await AsyncStorage.getItem('onboardingDone');

//         if (isLoggedIn === 'true') {
//             const role = await AsyncStorage.getItem('role');

//             if (role === 'user') {
//                 navigation.replace('LiftSeekerMain');
//             } else {
//                 navigation.replace('Main');
//             }
//         } else {
//             if (onboardingDone === 'true') {
//                 navigation.replace('JoinAs');
//             } else {
//                 navigation.replace('Onboarding');
//             }
//         }
//     }

//     // async function checkLogin() {
//     //     const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
//     //     if (isLoggedIn === 'true') {
//     //         const role = await AsyncStorage.getItem('role');
//     //         if (role === 'user') {
//     //             navigation.replace('LiftSeekerMain');
//     //         } else {
//     //             navigation.replace('Main');
//     //         }
//     //     } else {
//     //         navigation.replace('JoinAs');
//     //     }
//     // }

//     return (

//         <View style={styles.container}>
//             <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
//             <Animated.Image
//                 source={require('../assets/newlogo1.jpg')}
//                 style={[
//                     styles.logoImage,
//                     {
//                         opacity: logoOpacity,
//                         transform: [{ translateY: logoTranslateY }],
//                     },
//                 ]}
//             />
//         </View>
//     );

// }

// const styles = StyleSheet.create({
//     container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//     logoImage: { width: 180, height: 180, resizeMode: 'contain', marginBottom: 6 },
//     appName: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: 1 },
// });

// // <PermissionsScreen visible={showPermissions} onContinue={handleContinue} />

import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen({ navigation }) {
  const circleOpacity = useRef(new Animated.Value(0)).current;
  const circleY = useRef(new Animated.Value(300)).current;
  const liftX = useRef(new Animated.Value(-200)).current;
  const plzX = useRef(new Animated.Value(200)).current;
  const pinY = useRef(new Animated.Value(-95)).current;
  const pinOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. Circle fade + scale
      Animated.parallel([
        Animated.timing(circleOpacity, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),

        Animated.timing(circleY, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),

      // 2. Lift from left + Plz from right
      Animated.parallel([
        Animated.timing(liftX, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,


          
        }),

        Animated.timing(plzX, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),

      // 3. Pin drop
      Animated.parallel([
        Animated.timing(pinY, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pinOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),

      // 4. Tagline fade
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(
        async () => {
  try {
    const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
    const onboardingDone = await AsyncStorage.getItem("onboardingDone");
    const role = await AsyncStorage.getItem("role");

    if (isLoggedIn === "true") {
      if (role === "user") {
        navigation.replace("LiftSeekerMain");
      } else {
        navigation.replace("Main");
      }
    } else if (onboardingDone === "true") {
      navigation.replace("JoinAs");
    } else {
      navigation.replace("Onboarding");
    }
  } catch (e) {
    console.log("AsyncStorage error:", e);
    navigation.replace("Onboarding"); // fallback
  }
}, 5000);
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Circle logo — splash1.png */}
      <Animated.Image
        source={require("../assets/splash1.png")}
        style={[
          styles.circle,
          {
            opacity: circleOpacity,
            transform: [{ translateY: circleY }],
          },
        ]}
      />

      {/* Row: Lift + Pin + Plz */}
      <View style={styles.row}>
        {/* "Lift" — slides from left */}
        <Animated.Text
          style={[styles.liftText, { transform: [{ translateX: liftX }] }]}
        >
          Lıft
        </Animated.Text>

        {/* Pin — drops from top above "i" */}
        <Animated.Image
          source={require("../assets/splash5.png")}
          style={[
            styles.pin,
            {
              opacity: pinOpacity,
              transform: [{ translateY: pinY }],
            },
          ]}
        />

        {/* "Plz" — slides from right */}
        <Animated.Text
          style={[styles.plzText, { transform: [{ translateX: plzX }] }]}
        >
          Plz
        </Animated.Text>
      </View>

      {/* Tagline */}
      <Animated.View style={[styles.taglineRow, { opacity: taglineOpacity }]}>
        <View style={styles.taglineLine} />
        <Text style={styles.taglineText}>Connects People Over Free Rides</Text>
        <View style={styles.taglineLine} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  circle: {
    width: 260,
    height: 260,
    resizeMode: "contain",
    marginBottom: -105,
    zIndex: 10,
  },

  // Row holding text + pin
  row: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },

  liftText: {
    fontFamily: "sans-serif-black",
    fontStyle: "italic",
    fontSize: 42,
    fontWeight: "800",
    color: "#1B2F7A",
    letterSpacing: -2,
    lineHeight: 90,
  },

  // Location pin (splash5.png) — sits above "i"
  pin: {
    width: 30,
    height: 16,
    resizeMode: "contain",
    position: "absolute",
    top: 19,
    left: 14, // adjust to sit above "i" exactly
    zIndex: 100,
  },

  // "Plz" text — orange gradient look
  plzText: {
    fontFamily: "sans-serif-black",
    fontStyle: "italic",
    fontSize: 42,
    fontWeight: "900",
    color: "#F5A623",
    letterSpacing: -2,
    lineHeight: 80,
    marginLeft: 4,
  },

  // Tagline row
  taglineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: -20,
  },

  taglineLine: {
    width: 18,
    height: 3,
    backgroundColor: "#F5A623",
    borderRadius: 2,
  },

  taglineText: {
    fontFamily: "Arial",
    fontSize: 13,
    fontWeight: "900", 
    color: "#1B2F7A",
    letterSpacing: 0.3,
},
});
