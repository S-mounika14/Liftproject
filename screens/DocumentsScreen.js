import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import TextRecognition from "@react-native-ml-kit/text-recognition";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import * as DocumentPicker from "expo-document-picker";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { LinearGradient } from "expo-linear-gradient";

import {
  AlertNotificationRoot,
  Dialog,
  ALERT_TYPE,
} from "react-native-alert-notification";

const NAVY = "#1B2A6B";
const ORANGE = "#F5820A";
const LIGHTNAVY = "#2A3F8F";

export default function DocumentsScreen({ navigation }) {
  const [aadhaar, setAadhaar] = useState("");
  const [otp, setOtp] = useState("");
  const [realOtp, setRealOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [panFile, setPanFile] = useState("");
  const [licenceFile, setLicenceFile] = useState("");
  const [address, setAddress] = useState("");
  const [aadharImage, setAadharImage] = useState(null);
  const [aadharNumber, setAadharNumber] = useState("");
  const [panImage, setPanImage] = useState(null);
  const [panNumber, setPanNumber] = useState("");
  const [dlFrontImage, setDlFrontImage] = useState(null);
  const [dlBackImage, setDlBackImage] = useState(null);
  const [dlNumber, setDlNumber] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    loadSavedData();
    getLocation();
  }, []);

  async function loadSavedData() {
    const aadhaarData = await AsyncStorage.getItem("aadhaar");
    const addressData = await AsyncStorage.getItem("address");
    const panData = await AsyncStorage.getItem("panFile");
    const licenceData = await AsyncStorage.getItem("licenceFile");
    if (aadhaarData) setAadhaar(aadhaarData);
    if (addressData) setAddress(addressData);
    if (panData) setPanFile(panData);
    if (licenceData) setLicenceFile(licenceData);
  }

  async function getLocation() {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") return;
    const location = await Location.getCurrentPositionAsync({});
    const addressResult = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    if (addressResult.length > 0) {
      const place = addressResult[0];
      const fullAddress =
        (place.street || "") +
        ", " +
        (place.city || "") +
        ", " +
        (place.region || "") +
        ", " +
        (place.postalCode || "");
      setAddress(fullAddress);
    }
  }

  async function pickFile(type) {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (result.assets && result.assets.length > 0) {
      const fileName = result.assets[0].name;
      if (type === "pan") setPanFile(fileName);
      if (type === "licence") setLicenceFile(fileName);
    }
  }

  function sendOtp() {
    if (aadhaar.length !== 12) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Invalid Aadhaar",
        textBody: "Aadhaar must be 12 digits",
        button: "OK",
      });
      return;
    }
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setRealOtp(newOtp);
    setOtpSent(true);
    alert("OTP is " + newOtp);
  }

  function verifyOtp() {
    if (otp === realOtp) {
      setVerified(true);
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: "Aadhaar Verified",
        button: "OK",
      });
    } else {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Wrong OTP",
        textBody: "Incorrect OTP",
        button: "Try Again",
      });
    }
  }

  function handleAadhaar(text) {
    const numbersOnly = text.replace(/[^0-9]/g, "");
    if (numbersOnly.length <= 12) setAadhaar(numbersOnly);
  }

  async function handleNext() {
    await AsyncStorage.setItem("aadhaar", aadhaar);
    await AsyncStorage.setItem("address", address);
    await AsyncStorage.setItem("panFile", panFile);
    await AsyncStorage.setItem("licenceFile", licenceFile);
    navigation.navigate("BankDetails");
  }

  // ✅ ADDED - was missing, caused crash
  async function recognizeText(uri) {
    try {
      const result = await TextRecognition.recognize(uri);
      return result;
    } catch (e) {
      console.error("OCR Error:", e);
      return { text: "" };
    }
  }

  async function uploadDocument(type) {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (result.canceled) return;

      const uri = result.assets[0].uri;
      const textResult = await recognizeText(uri);
      const text = textResult.text;

      console.log("OCR TEXT:", text);

      const aadhaarRegex = /\d{4}\s\d{4}\s\d{4}/;
      const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
      const dlRegex = /[A-Z]{2}[-\s]?\d{2}[-\s]?\d{4,13}/;

      if (type === "aadhar") {
        const match = text.match(aadhaarRegex);
        if (match) {
          setAadharImage(uri);
          setAadharNumber(match[0]);
          setMessage("Aadhaar Uploaded Successfully");
        } else {
          setMessage("Please upload valid Aadhaar");
          setMessageType("error");
        }
      }

      if (type === "pan") {
        const match = text.match(panRegex);
        if (match) {
          setPanImage(uri);
          setPanNumber(match[0]);
          setMessage("PAN Uploaded Successfully");
        } else {
          setMessage("Please upload valid PAN");
          setMessageType("error");
        }
      }

      if (type === "dlFront") {
        const dlRegex = /[A-Z]{2}[-\s]?\d{2}[-\s]?\d{4,13}/;
        const normalizedText = text
          .replace(/[\s\-\n\r]/g, "")
          .toUpperCase()
          .replace(/O/g, "0");
        const match = normalizedText.match(/[A-Z]{2}\d{14}/);

        if (match) {
          let dl = match[0];
          let state = dl.slice(0, 2);
          let rest = dl.slice(2).replace(/O/g, "0");
          console.log("DL NUMBER STATE:", state + rest);
          setDlNumber(state + rest);
          setDlFrontImage(uri);
          setMessage("");
          setMessageType("");
        } else {
          if (dlFrontImage) {
            setMessage(
              "Invalid Driving License front image. Previous document remains unchanged.",
            );
          } else {
            setMessage("Please upload valid Driving License front");
          }
          setMessageType("error");
        }
      }

      if (type === "dlBack") {
        const normalizedText = text
          .replace(/[\s\-\n\r]/g, "")
          .toUpperCase()
          .replace(/O/g, "0");
        const match = normalizedText.match(/[A-Z]{2}\d{14}/);

        if (match) {
          setDlBackImage(uri);
          setMessage("");
          setMessageType("");
        } else {
          setMessage("Please upload valid Driving License back");
          setMessageType("error");
        }
      }
    } catch (error) {
      console.error("Upload Error:", error.message);
      alert("Error: " + error.message);
    }
  }

  return (
    <AlertNotificationRoot>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Image
                source={require("../assets/arrow.png")}
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Contributor Documents</Text>
            <View style={{ width: 30 }} />
          </View>

          <ScrollView
            style={styles.body}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16 }}
          >
            {/* AADHAAR */}
            <View style={styles.card}>
              <View style={styles.rowTop}>
                <Text style={styles.title}>Aadhaar Card</Text>
                {/* ✅ CHANGED - shows Change button after upload */}
                <TouchableOpacity
                  style={styles.uploadBtn}
                  onPress={() => uploadDocument("aadhar")}
                >
                  <Ionicons
                    name="cloud-upload-outline"
                    size={18}
                    color="#fff"
                  />
                  <Text style={styles.uploadText}>
                    {aadharImage ? "Change" : "Upload"}
                  </Text>
                </TouchableOpacity>
              </View>

              {aadharImage && (
                <View style={styles.previewRow}>
                  <Image source={{ uri: aadharImage }} style={styles.image} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.numberLabel}>Aadhaar Number</Text>
                    <Text style={styles.numberValue}>{aadharNumber}</Text>
                    <Text
                      style={{
                        color: "green",
                        fontWeight: "600",
                        marginTop: 6,
                        fontSize: 12,
                      }}
                    >
                      ✓ Aadhaar Uploaded Successfully
                    </Text>
                  </View>
                </View>
              )}

              {messageType === "error" &&
                message === "Please upload valid Aadhaar" && (
                  <Text
                    style={{ color: "red", fontWeight: "600", marginTop: 8 }}
                  >
                    ✕ {message}
                  </Text>
                )}
            </View>
            
            {/* OTP */}
            <Text style={[styles.otpLabel, { marginTop: 16 }]}>Enter OTP</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.inputFlex, styles.orangeInput]}
                placeholder="Enter Aadhaar OTP"
                placeholderTextColor={LIGHTNAVY}
                value={otp}
                onChangeText={setOtp}
                inputMode="numeric"
                maxLength={4}
                editable={!verified}
              />
              <TouchableOpacity
                style={styles.buttonBox}
                onPress={verifyOtp}
                disabled={verified}
              >
                <LinearGradient
                  colors={
                    verified
                      ? ["#EDF0F8", "#EDF0F8"]
                      : ["#1B2A6B", "#2A3F8F", "#1B2A6B"]
                  }
                  style={styles.smallButton}
                >
                  <Text
                    style={[styles.buttonText, verified && styles.grayText]}
                  >
                    {verified ? "Verified ✓" : "Verify"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={{ marginBottom: 16 }} />


            {/* PAN */}
            <View style={styles.card}>
              <View style={styles.rowTop}>
                <Text style={styles.title}>PAN Card</Text>

                <TouchableOpacity
                  style={styles.uploadBtn}
                  onPress={() => uploadDocument("pan")}
                >
                  <Ionicons
                    name="cloud-upload-outline"
                    size={18}
                    color="#fff"
                  />
                  <Text style={styles.uploadText}>
                    {panImage ? "Change" : "Upload"}
                  </Text>
                </TouchableOpacity>
              </View>

              {panImage && (
                <View style={styles.previewRow}>
                  <Image source={{ uri: panImage }} style={styles.image} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.numberLabel}>PAN Number</Text>
                    <Text style={styles.numberValue}>{panNumber}</Text>
                    <Text style={styles.success}>
                      PAN Uploaded Successfully
                    </Text>
                  </View>
                </View>
              )}

              {messageType === "error" &&
                message === "Please upload valid PAN" && (
                  <Text
                    style={{
                      color: "red",
                      fontWeight: "600",
                      marginTop: 8,
                      fontSize: 12,
                    }}
                  >
                    ✕ {message}
                  </Text>
                )}
            </View>
            {/* LICENCE */}
            <View style={styles.card}>
              <Text style={styles.title}>Driving License</Text>
              <View style={styles.dlButtonsRow}>
                <TouchableOpacity
                  style={styles.smallBtn}
                  onPress={() => uploadDocument("dlFront")}
                >
                  {/* ✅ CHANGED - shows Change after upload */}
                  <Text style={styles.smallBtnText}>
                    {dlFrontImage ? "Change Front" : "Upload Front"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.smallBtn}
                  onPress={() => uploadDocument("dlBack")}
                >
                  {/* ✅ CHANGED - shows Change after upload */}
                  <Text style={styles.smallBtnText}>
                    {dlBackImage ? "Change Back" : "Upload Back"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dlImageRow}>
                {dlFrontImage && (
                  <Image
                    source={{ uri: dlFrontImage }}
                    style={styles.dlImage}
                  />
                )}
                {dlBackImage && (
                  <Image source={{ uri: dlBackImage }} style={styles.dlImage} />
                )}
              </View>

              {/* ✅ ADDED - shows DL number */}
              {dlNumber ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 8,
                    gap: 8,
                  }}
                >
                  <Text style={styles.numberLabel}>DL Number</Text>
                  <Text style={styles.numberValue}>{dlNumber}</Text>
                </View>
              ) : null}
              {dlFrontImage && dlBackImage && (
                <Text
                  style={{
                    color: "green",
                    fontWeight: "600",
                    marginTop: 6,
                    fontSize: 12,
                  }}
                >
                  ✓ Driving License Uploaded Successfully
                </Text>
              )}

              {messageType === "error" &&
                (message === "Please upload valid Driving License front" ||
                  message === "Please upload valid Driving License back" ||
                  message.includes("Invalid Driving License")) && (
                  <Text
                    style={{
                      color: "red",
                      fontWeight: "600",
                      marginTop: 8,
                      fontSize: 12,
                    }}
                  >
                    ✕ {message}
                  </Text>
                )}
            </View>
            {/* ADDRESS */}
            <Text style={styles.label}>Correspondence Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter your full address"
              placeholderTextColor="#A0AEC0"
              value={address}
              onChangeText={setAddress}
              multiline
            />
            {/* NEXT BUTTON */}
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <LinearGradient
                colors={["#1B2A6B", "#2A3F8F", "#1B2A6B"]}
                style={styles.nextBtnGrad}
              >
                <Text style={styles.nextBtnText}>Next →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFBFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#D6DBF0",
  },
  backBtn: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
    tintColor: "#1B2A6B",
  },
  headerTitle: {
    flex: 1,
    color: "#1B2A6B",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  body: { paddingHorizontal: 20 },
  label: { fontSize: 13, color: NAVY, fontWeight: "700", marginBottom: 15 },
  row: { flexDirection: "row", alignItems: "center" },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#D6DBF0",
    borderRadius: 10,
    padding: 11,
    fontSize: 13,
    color: NAVY,
  },
  inputFlex: { flex: 1 },
  orangeInput: { borderColor: "#D6DBF0", backgroundColor: "#fff" },
  buttonBox: { marginLeft: 8, borderRadius: 10, overflow: "hidden" },
  smallButton: {
    paddingHorizontal: 13,
    paddingVertical: 11,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  grayText: { color: "#8896B3" },
  otpLabel: {
    fontSize: 11,
    color: NAVY,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 4,
  },
  textArea: { height: 80, textAlignVertical: "top" },
  nextBtn: {
    borderRadius: 40,
    overflow: "hidden",
    marginTop: 20,
    marginBottom: 30,
  },
  nextBtnGrad: { padding: 14, alignItems: "center" },
  nextBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    elevation: 3,
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: { fontSize: 16, fontWeight: "700", color: "#1b2a6b" },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1b2a6b",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  uploadText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  previewRow: { flexDirection: "row", gap: 12 },
  image: { width: 120, height: 80, borderRadius: 10 },
  numberLabel: { fontSize: 12, color: "#777", marginTop: 6 },
  numberValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1b2a6b",
    marginTop: 4,
  },
  success: { color: "green", fontWeight: "600", marginTop: 10, fontSize: 12 },
  dlButtonsRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  smallBtn: {
    flex: 1,
    backgroundColor: "#1b2a6b",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  smallBtnText: { color: "#fff", fontWeight: "600" },
  dlImageRow: { flexDirection: "row", gap: 10, marginTop: 14 },
  dlImage: { width: 140, height: 90, borderRadius: 10 },
  mainMessage: {
    textAlign: "center",
    color: "#1b2a6b",
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: NAVY,
    marginTop: 18,
    marginBottom: 6,
  },
});
