// import { useState, useEffect } from 'react';
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     StyleSheet,
//     Image
// } from 'react-native';

// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as NavigationBar from 'expo-navigation-bar';

// export default function JoinAsScreen({ navigation }) {

//     const [selectedRole, setSelectedRole] = useState('rider');
//     const [isRegistered, setIsRegistered] = useState(false);

//     useEffect(() => {
//         NavigationBar.setBackgroundColorAsync('#ffffff');
//         NavigationBar.setButtonStyleAsync('dark');
//     }, []);

//     useEffect(() => {
//         AsyncStorage.getItem('isRegistered').then(val => {
//             if (val === 'true') {
//                 setIsRegistered(true);
//             }
//         });
//     }, []);

//     async function checkRegistration() {

//         const value = await AsyncStorage.getItem('isRegistered');

//         console.log('isRegistered value:', value);

//         if (value === 'true') {
//             setIsRegistered(true);
//         }
//     }

//     // contributor
//     function handleContributorPress() {
//         setSelectedRole('rider');
//         navigation.navigate('CreateAccount', { role: 'rider' });
//     }

//     // lift seeker
//     function handleLiftSeekerPress() {
//         setSelectedRole('user');
//         navigation.navigate('CreateAccount', { role: 'user' });
//     }

//     return (

//         <View style={styles.container}>

//             {/* top logo section */}
//             <View style={styles.topBand}>

//                 <Image
//                     source={require('../assets/newlogo1.jpg')}
//                     style={styles.logoImage}
//                 />

//             </View>

//             <View style={styles.body}>

//                 <Text style={styles.joinLabel}>
//                     JOIN US AS A
//                 </Text>

//                 <View style={styles.cardsRow}>

//                     {/* contributor */}
//                     <TouchableOpacity
//                         style={[
//                             styles.roleCard,
//                             selectedRole === 'rider' &&
//                             styles.roleCardSelected
//                         ]}
//                         onPress={handleContributorPress}
//                     >

//                         <Image
//                             source={require('../assets/contributor1.png')}
//                             style={styles.roleImageFull}
//                         />

//                         <View style={styles.roleInfo}>

//                             <Text style={styles.roleName}>
//                                 CONTRIBUTOR
//                             </Text>

//                         </View>

//                     </TouchableOpacity>

//                     {/* lift seeker */}
//                     <TouchableOpacity
//                         style={[
//                             styles.roleCard,
//                             selectedRole === 'user' &&
//                             styles.roleCardSelected
//                         ]}
//                         onPress={handleLiftSeekerPress}
//                     >

//                         <Image
//                             source={require('../assets/customer1.png')}
//                             style={styles.roleImageFull}
//                         />

//                         <View style={styles.roleInfo}>

//                             <Text style={styles.roleName}>
//                                 LIFT SEEKER
//                             </Text>

//                         </View>

//                     </TouchableOpacity>

//                 </View>

//             </View>

//         </View>
//     );
// }

// const styles = StyleSheet.create({

//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },

//     topBand: {
//         height: 250,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#fff',
//     },

//     body: {
//         flex: 1,
//         paddingHorizontal: 20,
//         alignItems: 'center',
//         justifyContent: 'flex-start',
//     },

//     joinLabel: {
//         fontSize: 20,
//         fontWeight: '800',
//         color: '#1B2A6B',
//         textAlign: 'left',
//         alignSelf: 'flex-start',
//         paddingHorizontal: 10,
//         marginTop: 18,
//         marginBottom: 23,
//         letterSpacing: 1,
//     },

//     cardsRow: {
//         flexDirection: 'column',
//         width: '100%',
//         alignItems: 'center',
//     },

//     roleCard: {
//         width: '57%',
//         height: 210,
//         borderWidth: 1.5,
//         borderColor: '#FF6600',
//         backgroundColor: '#FAFFFE',
//         borderRadius: 22,
//         overflow: 'hidden',
//         alignItems: 'center',
//         marginBottom: 29,
//     },

//     roleCardSelected: {
//         borderColor: '#F5820A',
//         backgroundColor: '#EBF9F3',
//     },

//     roleInfo: {
//         alignItems: 'center',
//         marginTop: 3,
//     },

//     roleName: {
//         fontSize: 13,
//         fontWeight: '700',
//         color: '#1A2E25',
//     },

//     logoImage: {
//         width: 250,
//         height: 180,
//         resizeMode: 'contain',
//         marginTop: 70,
//         borderRadius: 18,
//     },

//     roleImageFull: {
//         width: '100%',
//         height: 180,
//         resizeMode: 'cover',
//     },
// });

import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as NavigationBar from "expo-navigation-bar";

export default function JoinAsScreen({ navigation }) {
  const [selectedRole, setSelectedRole] = useState("rider");
  const [isRegistered, setIsRegistered] = useState(false);

  // animation values
  const logoAnim = useRef(new Animated.Value(0)).current;
  const logoSlide = useRef(new Animated.Value(60)).current;
  const labelAnim = useRef(new Animated.Value(0)).current;
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#ffffff");
    NavigationBar.setButtonStyleAsync("dark");
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("isRegistered").then((val) => {
      if (val === "true") {
        setIsRegistered(true);
      }
    });
  }, []);

  // run animations on mount
  useEffect(() => {
    Animated.sequence([
      // logo fades in + slides up
      Animated.parallel([
        Animated.timing(logoAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(logoSlide, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // small pause then label fades in
      Animated.delay(100),
      Animated.timing(labelAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // card 1 fades in
      Animated.delay(100),
      Animated.timing(card1Anim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // card 2 fades in
      Animated.delay(100),
      Animated.timing(card2Anim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
  askPermissions();
});
  }, []);

  async function checkRegistration() {
    const value = await AsyncStorage.getItem("isRegistered");
    console.log("isRegistered value:", value);
    if (value === "true") {
      setIsRegistered(true);
    }
  }

  function handleContributorPress() {
    setSelectedRole("rider");
    navigation.navigate("CreateAccount", { role: "rider" });
  }

  function handleLiftSeekerPress() {
    setSelectedRole("user");
    navigation.navigate("CreateAccount", { role: "user" });
  }

 const askPermissions = async () => {
  const cameraResult = await Camera.requestCameraPermissionsAsync();

  if (cameraResult.status === "granted") {
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  }
};

  



  return (
    <View style={styles.container}>
      {/* top logo section */}
      <View style={styles.topBand}>
        <Animated.View
          style={{
            opacity: logoAnim,
            transform: [{ translateY: logoSlide }],
          }}
        >
          <Image
            source={require("../assets/tagline.png")}
            style={styles.logoImage}
          />

          <View style={styles.taglineContainer}>
            <View style={styles.taglineLine} />

            <Text style={styles.taglineText}>
              Connects People Over Free Rides
            </Text>

            <View style={styles.taglineLine} />
          </View>
        </Animated.View>
      </View>

      <View style={styles.body}>
        <Animated.Text style={[styles.joinLabel, { opacity: labelAnim }]}>
          JOIN US AS A
        </Animated.Text>

        <View style={styles.cardsRow}>
          {/* contributor */}
          <Animated.View
            style={{ opacity: card1Anim, width: "100%", alignItems: "center" }}
          >
            <TouchableOpacity
              style={[
                styles.roleCard,
                selectedRole === "rider" && styles.roleCardSelected,
              ]}
              onPress={handleContributorPress}
            >
              <Image
                source={require("../assets/contributor1.png")}
                style={styles.roleImageFull}
              />
              <View style={styles.roleInfo}>
                <Text style={styles.roleName}>CONTRIBUTOR</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* lift seeker */}
          <Animated.View
            style={{ opacity: card2Anim, width: "100%", alignItems: "center" }}
          >
            <TouchableOpacity
              style={[
                styles.roleCard,
                selectedRole === "user" && styles.roleCardSelected,
              ]}
              onPress={handleLiftSeekerPress}
            >
              <Image
                source={require("../assets/customer1.png")}
                style={styles.roleImageFull}
              />
              <View style={styles.roleInfo}>
                <Text style={styles.roleName}>LIFT SEEKER</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  topBand: {
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 20,
  },

  body: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  joinLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1B2A6B",
    textAlign: "left",
    alignSelf: "center",
    paddingHorizontal: 10,
    marginTop: 14,
    marginBottom: 14,
    letterSpacing: 1,
  },

  cardsRow: {
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
  },

  roleCard: {
    width: "50%",
    height: 178,
    borderWidth: 1.5,
    borderColor: "#FF6600",
    backgroundColor: "#FAFFFE",
    borderRadius: 22,
    overflow: "hidden",
    alignItems: "center",
    marginBottom: 40,
  },

  roleCardSelected: {
    borderColor: "#F5820A",
    backgroundColor: "#EBF9F3",
  },

  roleInfo: {
    alignItems: "center",
    marginTop: 3,
  },

  roleName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A2E25",
  },

  logoImage: {
    width: 280,
    height: 230,
    resizeMode: "cover",
    marginTop: -10,
    borderRadius: 18,
  },

  taglineContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -15,
  },

  taglineLine: {
    width: 22,
    height: 3,
    backgroundColor: "#F5A623",
    borderRadius: 2,
  },

  taglineText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1B2F7A",
    textAlign: "center",
    marginTop: -48,
    marginHorizontal: 8,
  },

  taglineLine: {
    width: 30,
    height: 3,
    marginTop: -48,

    backgroundColor: "#F5A623",
    borderRadius: 2,
  },
  roleImageFull: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
});
