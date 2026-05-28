import { useState, useRef } from "react";
import { Linking } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  PermissionsAndroid,
  Platform,
} from "react-native";

export default function QRVerifyScreen({ route, navigation }) {
  const rideRequest = route?.params?.rideRequest;

  if (!rideRequest) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Ride request not found</Text>
      </View>
    );
  }

  const [digits, setDigits] = useState(["", "", "", ""]);
  const inputs = useRef([]);
  const SEEKER_OTP = "1234";
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestCameraPermission] = useCameraPermissions();


  function handleVerify() {
    const enteredOtp = digits.join("");
    if (enteredOtp === SEEKER_OTP) {
      navigation.navigate("RideInProgress", { rideRequest });
    } else {
      Alert.alert("Wrong OTP", "Please check the OTP with the seeker.");
    }
  }

  async function handleOpenScanner() {
    const response = await requestCameraPermission();

    if (response.granted) {
      setShowCamera(true);
    } else {
      Alert.alert(
        "Camera Permission Required",
        "Please allow camera access in settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ],
      );
    }
  }

  function handleChange(text, index) {
    const onlyNumbers = text.replace(/[^0-9]/g, "");
    const updatedDigits = [...digits];
    updatedDigits[index] = onlyNumbers;
    setDigits(updatedDigits);
    if (onlyNumbers && index < 3) {
      inputs.current[index + 1].focus();
    }
  }

  function handleKeyPress(event, index) {
    if (event.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  }
  function handleScan({ data }) {
    setShowCamera(false);

    if (data === "1234") {
      navigation.navigate("RideInProgress", { rideRequest });
    } else {
      Alert.alert("Invalid QR", "This QR is not valid");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Verify Seeker</Text>
      <Text style={styles.subHeading}>
        {rideRequest.seekerName} · {rideRequest.pickup}
      </Text>
      {showCamera && (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={handleScan}
          />
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.label}>Ask seeker for their OTP</Text>

        <View style={styles.boxRow}>
          {[0, 1, 2, 3].map((item) => (
            <TextInput
              key={item}
              ref={(ref) => (inputs.current[item] = ref)}
              style={styles.otpBox}
              value={digits[item]}
              onChangeText={(text) => handleChange(text, item)}
              onKeyPress={(event) => handleKeyPress(event, item)}
              inputMode="numeric"
              maxLength={1}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>Verify & Ride</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleOpenScanner}>
          <Text style={styles.scanText}>Scan to Verify & Ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },
  subHeading: {
    fontSize: 13,
    color: "#777",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 22,
  },
  boxRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 30,
  },
  otpBox: {
    width: 56,
    height: 64,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#D4EBE2",
    backgroundColor: "#F5FAF7",
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
  },
  button: {
    width: "100%",
    backgroundColor: "#1270B8",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  scanText: {
    marginTop: 18,
    color: "#1270B8",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  cameraContainer: {
    width: "100%",
    height: 250,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 20,
  },

  camera: {
    flex: 1,
  },
});
