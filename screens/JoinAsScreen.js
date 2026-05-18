// import { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as Contacts from 'expo-contacts';
// import { PermissionsAndroid, Platform } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function JoinAsScreen({ navigation }) {

//     const [selectedRole, setSelectedRole] = useState('rider');
//     const [step, setStep] = useState(-1);

//     // list of permissions to ask one by one
//     const permissions = [
//         { name: 'notifications', icon: 'notifications-outline' },
//         { name: 'contacts', icon: 'people-outline' },
//         { name: 'call logs', icon: 'time-outline' },
//         { name: 'sms', icon: 'chatbubble-outline' },
//         { name: 'phone calls', icon: 'call-outline' },
//     ];

//     // check if permissions already shown when screen opens
//     useEffect(() => {
//         checkPermissions();
//     }, []);

//     async function checkPermissions() {
//         const shown = await AsyncStorage.getItem('permissionsShown');
//         console.log('permissionsShown:', shown);
//         if (!shown) {
//             setStep(0);
//         }
//     }

//     // go to next permission step
//     function nextStep() {
//         if (step < permissions.length - 1) {
//             setStep(step + 1);
//         } else {
//             AsyncStorage.setItem('permissionsShown', 'true');
//             setStep(-1);
//         }
//     }

//     // handle allow button press for each permission
//     async function handleAllow() {
//         try {
//             if (permissions[step].name === 'contacts') {
//                 try {
//                     await Contacts.requestPermissionsAsync();
//                 } catch (e) { }
//             }

//             if (permissions[step].name === 'call logs') {
//                 try {
//                     if (Platform.OS === 'android') {
//                         await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CALL_LOG);
//                     }
//                 } catch (e) { }
//             }

//             if (permissions[step].name === 'sms') {
//                 try {
//                     if (Platform.OS === 'android') {
//                         await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_SMS);
//                     }
//                 } catch (e) { }
//             }

//             if (permissions[step].name === 'phone calls') {
//                 try {
//                     if (Platform.OS === 'android') {
//                         await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CALL_PHONE);
//                     }
//                 } catch (e) { }
//             }

//         } catch (e) { }

//         nextStep();
//     }

//     // when contributor card is pressed
//     function handleContributorPress() {
//         setSelectedRole('rider');
//         navigation.navigate('CreateAccount', { role: 'rider' });
//     }

//     // when lift seeker card is pressed
//     function handleLiftSeekerPress() {
//         setSelectedRole('user');
//         navigation.navigate('CreateAccount', { role: 'user' });
//     }

//     return (
//         <View style={styles.container}>

//             {/* top green blue banner with logo */}
//             <LinearGradient colors={['#0C7A54', '#1270B8']} style={styles.topBand}>
//                 <Image source={require('../assets/LiftImage.png')} style={styles.logoImage} />
//             </LinearGradient>

//             <View style={styles.body}>

//                 <Text style={styles.question}>Choose your role to get started</Text>

//                 {/* contributor card */}
//                 <TouchableOpacity
//                     style={[styles.roleCard, selectedRole === 'rider' && styles.roleCardSelected]}
//                     onPress={handleContributorPress}
//                 >
//                     <Image source={require('../assets/contributor1.png')} style={styles.roleImageFull} />
//                     <View style={styles.roleInfo}>
//                         <Text style={styles.roleName}>CONTRIBUTOR</Text>
//                     </View>
//                 </TouchableOpacity>

//                 {/* lift seeker card */}
//                 <TouchableOpacity
//                     style={[styles.roleCard, selectedRole === 'user' && styles.roleCardSelected]}
//                     onPress={handleLiftSeekerPress}
//                 >
//                     <Image source={require('../assets/customer1.png')} style={styles.roleImageFull} />
//                     <View style={styles.roleInfo}>
//                         <Text style={styles.roleName}>LIFT SEEKER</Text>
//                     </View>
//                 </TouchableOpacity>

//             </View>

//             {/* permission popup modal */}
//             <Modal
//                 visible={step !== -1}
//                 transparent={true}
//                 animationType="fade"
//                 statusBarTranslucent={true}
//             >
//                 <View style={styles.overlay}>
//                     <View style={styles.popup}>

//                         <Ionicons
//                             name={permissions[Math.max(step, 0)].icon}
//                             size={44}
//                             color="#1270B8"
//                             style={{ alignSelf: 'center', marginBottom: 12 }}
//                         />

//                         <Text style={styles.textMain}>
//                             Allow Lift to access your {permissions[Math.max(step, 0)].name}?
//                         </Text>

//                         <View style={styles.divider} />

//                         <TouchableOpacity onPress={handleAllow}>
//                             <Text style={styles.allow}>Allow</Text>
//                         </TouchableOpacity>

//                         <View style={styles.divider} />

//                         <TouchableOpacity onPress={nextStep}>
//                             <Text style={styles.deny}>Don't allow</Text>
//                         </TouchableOpacity>

//                     </View>
//                 </View>
//             </Modal>

//         </View>
//     );
// }


// const styles = StyleSheet.create({

//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },

//     topBand: {
//         height: 200,
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderBottomLeftRadius: 30,
//         borderBottomRightRadius: 30,
//     },

//     body: {
//         flex: 1,
//         paddingHorizontal: 20,
//     },

//     question: {
//         fontSize: 13,
//         color: '#040404',
//         textAlign: 'center',
//         marginBottom: 10,
//         marginTop: 10,
//     },

//     roleCard: {
//         borderWidth: 1.9,
//         borderColor: '#D4EBE2',
//         marginBottom: 20,
//         backgroundColor: '#FAFFFE',
//         height: 260,
//         borderRadius: 25,
//         width: '65%',
//         alignSelf: 'center',
//         overflow: 'hidden',
//     },

//     roleCardSelected: {
//         borderColor: '#0C7A54',
//         backgroundColor: '#EBF9F3',
//     },

//     roleInfo: {
//         alignItems: 'center',
//         marginTop: 3,
//     },

//     roleName: {
//         fontSize: 18,
//         fontWeight: '700',
//         color: '#1A2E25',
//     },

//     logoImage: {
//         width: 250,
//         height: 100,
//         resizeMode: 'contain',
//         marginTop: 70,
//     },

//     roleImageFull: {
//         width: '100%',
//         height: '220',
//         resizeMode: 'cover',
//         alignSelf: 'center',
//     },

//     overlay: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         paddingHorizontal: 30,
//     },

//     popup: {
//         width: '100%',
//         backgroundColor: '#fff',
//         borderRadius: 20,
//         paddingVertical: 25,
//         paddingHorizontal: 20,
//     },

//     textMain: {
//         textAlign: 'center',
//         fontSize: 15,
//         color: '#333',
//         marginBottom: 16,
//     },

//     divider: {
//         height: 0.5,
//         backgroundColor: '#ddd',
//         marginVertical: 4,
//     },

//     allow: {
//         textAlign: 'center',
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#1270B8',
//         paddingVertical: 12,
//     },

//     deny: {
//         textAlign: 'center',
//         fontSize: 15,
//         color: '#555',
//         paddingVertical: 12,
//     },

// });

import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NavigationBar from 'expo-navigation-bar';

export default function JoinAsScreen({ navigation }) {

    const [selectedRole, setSelectedRole] = useState('rider');
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync('#ffffff');
        NavigationBar.setButtonStyleAsync('dark');
    }, []);

    useEffect(() => {
        AsyncStorage.getItem('isRegistered').then(val => {
            if (val === 'true') {
                setIsRegistered(true);
            }
        });
    }, []);

    async function checkRegistration() {

        const value = await AsyncStorage.getItem('isRegistered');

        console.log('isRegistered value:', value);

        if (value === 'true') {
            setIsRegistered(true);
        }
    }

    // contributor
    function handleContributorPress() {
        setSelectedRole('rider');
        navigation.navigate('CreateAccount', { role: 'rider' });
    }

    // lift seeker
    function handleLiftSeekerPress() {
        setSelectedRole('user');
        navigation.navigate('CreateAccount', { role: 'user' });
    }

    return (

        <View style={styles.container}>

            {/* top logo section */}
            <View style={styles.topBand}>

                <Image
                    source={require('../assets/newlogo1.jpg')}
                    style={styles.logoImage}
                />

            </View>

            <View style={styles.body}>

                <Text style={styles.joinLabel}>
                    JOIN US AS A
                </Text>

                <View style={styles.cardsRow}>

                    {/* contributor */}
                    <TouchableOpacity
                        style={[
                            styles.roleCard,
                            selectedRole === 'rider' &&
                            styles.roleCardSelected
                        ]}
                        onPress={handleContributorPress}
                    >

                        <Image
                            source={require('../assets/contributor1.png')}
                            style={styles.roleImageFull}
                        />

                        <View style={styles.roleInfo}>

                            <Text style={styles.roleName}>
                                CONTRIBUTOR
                            </Text>

                        </View>

                    </TouchableOpacity>

                    {/* lift seeker */}
                    <TouchableOpacity
                        style={[
                            styles.roleCard,
                            selectedRole === 'user' &&
                            styles.roleCardSelected
                        ]}
                        onPress={handleLiftSeekerPress}
                    >

                        <Image
                            source={require('../assets/customer1.png')}
                            style={styles.roleImageFull}
                        />

                        <View style={styles.roleInfo}>

                            <Text style={styles.roleName}>
                                LIFT SEEKER
                            </Text>

                        </View>

                    </TouchableOpacity>

                </View>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    topBand: {
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    body: {
        flex: 1,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    joinLabel: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1B2A6B',
        textAlign: 'left',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        marginTop: 18,
        marginBottom: 23,
        letterSpacing: 1,
    },

    cardsRow: {
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
    },

    roleCard: {
        width: '57%',
        height: 210,
        borderWidth: 1.5,
        borderColor: '#FF6600',
        backgroundColor: '#FAFFFE',
        borderRadius: 22,
        overflow: 'hidden',
        alignItems: 'center',
        marginBottom: 29,
    },

    roleCardSelected: {
        borderColor: '#F5820A',
        backgroundColor: '#EBF9F3',
    },

    roleInfo: {
        alignItems: 'center',
        marginTop: 3,
    },

    roleName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1A2E25',
    },

    logoImage: {
        width: 250,
        height: 180,
        resizeMode: 'contain',
        marginTop: 70,
        borderRadius: 18,
    },

    roleImageFull: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
});