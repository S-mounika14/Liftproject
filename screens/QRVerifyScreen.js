import { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';

export default function QRVerifyScreen({ route, navigation }) {

    const { rideRequest } = route.params;

    const [digits, setDigits] = useState(['', '', '', '']);

    const inputs = useRef([]);

    // demo OTP
    const SEEKER_OTP = '1234';

    // verify otp
    function handleVerify() {

        const enteredOtp = digits.join('');

        if (enteredOtp === SEEKER_OTP) {

            navigation.navigate('RideInProgress', {
                rideRequest,
            });

        } else {

            Alert.alert(
                'Wrong OTP',
                'Please check the OTP with the seeker.'
            );
        }
    }

    function handleChange(text, index) {

        const onlyNumbers = text.replace(/[^0-9]/g, '');

        const updatedDigits = [...digits];

        updatedDigits[index] = onlyNumbers;

        setDigits(updatedDigits);

        // move to next box
        if (onlyNumbers && index < 3) {
            inputs.current[index + 1].focus();
        }
    }

    // move back on backspace
    function handleKeyPress(event, index) {

        if (
            event.nativeEvent.key === 'Backspace' &&
            !digits[index] &&
            index > 0
        ) {
            inputs.current[index - 1].focus();
        }
    }

    return (

        <View style={styles.container}>

            <Text style={styles.heading}>
                Verify Seeker
            </Text>

            <Text style={styles.subHeading}>
                {rideRequest.seekerName} · {rideRequest.pickup}
            </Text>

            <View style={styles.card}>

                <Text style={styles.label}>
                    Ask seeker for their OTP
                </Text>

                <View style={styles.boxRow}>

                    {[0, 1, 2, 3].map((item) => (

                        <TextInput
                            key={item}
                            ref={(ref) => inputs.current[item] = ref}
                            style={styles.otpBox}
                            value={digits[item]}
                            onChangeText={(text) => handleChange(text, item)}
                            onKeyPress={(event) => handleKeyPress(event, item)}
                            keyboardType="number-pad"
                            maxLength={1}
                        />

                    ))}

                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleVerify}
                >
                    <Text style={styles.buttonText}>
                        Verify & Start Ride
                    </Text>
                </TouchableOpacity>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 40,
    },

    heading: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111',
        marginBottom: 6,
    },

    subHeading: {
        fontSize: 13,
        color: '#777',
        marginBottom: 30,
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 28,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },

    label: {
        fontSize: 14,
        color: '#555',
        marginBottom: 22,
    },

    boxRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 30,
    },

    otpBox: {
        width: 56,
        height: 64,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#D4EBE2',
        backgroundColor: '#F5FAF7',
        textAlign: 'center',
        fontSize: 28,
        fontWeight: '700',
        color: '#111',
    },

    button: {
        width: '100%',
        backgroundColor: '#1270B8',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },

});

