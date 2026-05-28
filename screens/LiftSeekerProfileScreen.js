import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Linking } from "react-native";

const TERMS = [
  "I agree to share my ride location during active rides.",
  "I agree to receive ride notifications and updates.",
  "I confirm my details provided are correct.",
  "I agree to Lift Terms & Privacy Policy.",
  "I am above 18 years old.",
];

export default function LiftSeekerProfileScreen({ navigation }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [photo, setPhoto] = useState(null);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  // Date picker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

  const [maritalStatus, setMaritalStatus] = useState("");
  const [anniversaryDate, setAnniversaryDate] = useState("");
  const [isAnniversaryPicker, setIsAnniversaryPicker] = useState(false);

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [checkedTerms, setCheckedTerms] = useState({});
  const [showMaritalModal, setShowMaritalModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const keys = [
        "name",
        "phone",
        "accountNo",
        "address",
        "email",
        "dob",
        "gender",
        "photo",
        "maritalStatus",
        "anniversaryDate",
        "termsAccepted",
      ];
      const pairs = await AsyncStorage.multiGet(keys);
      const data = Object.fromEntries(pairs.map(([k, v]) => [k, v]));

      if (data.name) setName(data.name);
      if (data.phone) setPhone(data.phone);
      if (data.accountNo) setAccountNo(data.accountNo);
      if (data.email) setEmail(data.email);
      if (data.dob) setDob(data.dob);
      if (data.gender) setGender(data.gender);
      if (data.photo) setPhoto(data.photo);
      if (data.maritalStatus) setMaritalStatus(data.maritalStatus);
      if (data.anniversaryDate) setAnniversaryDate(data.anniversaryDate);
      if (data.termsAccepted) {
        setTermsAccepted(JSON.parse(data.termsAccepted));
      }
      console.log("DOB:", data.dob);
      console.log("Gender:", data.gender);

      // Derive 2-letter state code from saved address
      if (data.address) {
        const parts = data.address.split(",");
        const state = parts[parts.length - 2]?.trim();
        if (state) setStateCode(state.substring(0, 2).toUpperCase());
      }
    } catch (err) {
      console.log("loadData error", err);
    }
  }

  async function handleSaveProfile() {
    try {
      await AsyncStorage.multiSet([
        ["name", name],
        ["phone", phone],
        ["email", email],
        ["gender", gender],
        ["maritalStatus", maritalStatus],
        ["dob", dob],
        ["anniversaryDate", anniversaryDate],
        ["termsAccepted", JSON.stringify(termsAccepted)],
      ]);

      setIsEditing(false);

      Alert.alert("Success", "Profile updated successfully.");
    } catch (err) {
      console.log("save profile error", err);
    }
  }

  function openDatePicker(type = "dob") {
    setIsAnniversaryPicker(type === "anniversary");

    if (type === "dob" && dob) {
      const parsed = new Date(dob);
      if (!isNaN(parsed)) {
        setPickerDate(parsed);
      }
    }

    if (type === "anniversary" && anniversaryDate) {
      const parsed = new Date(anniversaryDate);
      if (!isNaN(parsed)) {
        setPickerDate(parsed);
      }
    }

    setShowDatePicker(true);
  }

  async function onDateSelected(event, selectedDate) {
    setShowDatePicker(false);

    if (event.type === "dismissed") return;
    if (!selectedDate) return;

    const formatted = selectedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    if (isAnniversaryPicker) {
      setAnniversaryDate(formatted);
      await AsyncStorage.setItem("anniversaryDate", formatted);
    } else {
      setDob(formatted);
      await AsyncStorage.setItem("dob", formatted);
    }
  }

  // ─── PHOTO PICKER ─────────────────────────────────────────────────────────

  async function openCamera() {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhoto(uri);
      await AsyncStorage.setItem("photo", uri);
    }
  }

async function openGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;

      setPhoto(selectedImage);

      await AsyncStorage.setItem("photo", selectedImage);
    }
  }
  async function handleLogout() {
    await AsyncStorage.removeItem("isLoggedIn");
    navigation.replace("JoinAs");
  }

  function handleDeactivate() {
    Alert.alert(
      "Deactivate Account",
      "Your account will be hidden. You can reactivate anytime by logging in again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Deactivate",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.setItem("isDeactivated", "true");
            await AsyncStorage.removeItem("isLoggedIn");
            navigation.replace("JoinAs");
          },
        },
      ],
    );
  }
  const allChecked = TERMS.every((_, index) => checkedTerms[index]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* FIXED TOP */}
      <View style={styles.topBand}>
        <TouchableOpacity
          onPress={() => setShowPhotoOptions(true)}
          style={styles.avatarWrapper}
        >
          <View style={styles.avatarBorder}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar}>
                <Ionicons name="person" size={45} color="#ccc" />
              </View>
            )}
          </View>

          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={12} color="#fff" />
          </View>
        </TouchableOpacity>

        <Text style={styles.name}>{name || "User"}</Text>

        <Text style={styles.uniqueIdBelow}>ID: {stateCode || "—"}</Text>
      </View>

      {/* ONLY BOTTOM SCROLL */}

      <View style={{ flex: 1 }}>
        {/* ── PERSONAL INFORMATION CARD ── */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeading}>Personal Information</Text>

            <TouchableOpacity
              onPress={() => {
                if (isEditing) {
                  handleSaveProfile();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? (
                <View style={styles.saveBtn}>
                  <Text style={styles.saveBtnText}>Save</Text>
                </View>
              ) : (
                <Ionicons name="create" size={25} color="#1b2a6b" />
              )}
            </TouchableOpacity>
          </View>

          <EditableRow
            icon="person-outline"
            label="Name"
            value={name}
            setValue={setName}
            isEditing={isEditing}
          />
          <View style={styles.divider} />
          <EditableRow
            icon="call-outline"
            label="Phone Number"
            value={phone}
            setValue={setPhone}
            isEditing={isEditing}
            inputMode="tel"
          />
          <View style={styles.divider} />
          <EditableRow
            icon="mail-outline"
            label="Email"
            value={email}
            setValue={setEmail}
            isEditing={isEditing}
            inputMode="email"
          />
          <View style={styles.divider} />
          <TouchableOpacity
            disabled={!isEditing}
            onPress={() => {
              setEmail("");
            }}
          >
            <Text
              style={{
                color: "#1270B8",
                fontSize: 12,
                textDecorationLine: "underline",
                alignSelf: "flex-end",
                marginTop: 0,
                marginBottom: 5,
                fontWeight: "700",
              }}
            >
              Update Email
            </Text>
          </TouchableOpacity>
          <View style={[styles.infoRow, { paddingVertical: 10 }]}>
            <Ionicons name="male-female-outline" size={18} color="#2a3f8f" />
            <Text style={styles.infoLabel}>Gender</Text>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              {["Male", "Female", "Other"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
                  onPress={async () => {
                    if (isEditing) {
                      setGender(option);
                      await AsyncStorage.setItem("gender", option);
                    }
                  }}
                >
                  <Ionicons
                    name={
                      gender === option ? "radio-button-on" : "radio-button-off"
                    }
                    size={16}
                    color="#1b2a6b"
                  />
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#1b2a6b",
                      fontWeight: "500",
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.divider} />
          <DobRow
            label="Date of Birth"
            dob={dob}
            onPress={() => openDatePicker("dob")}
            isEditing={isEditing}
          />
          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.infoRow}
            activeOpacity={0.7}
            onPress={() => {
              if (isEditing) {
                setShowMaritalModal(true);
              }
            }}
          >
            <Ionicons name="heart-outline" size={18} color="#2a3f8f" />

            <Text style={styles.infoLabel}>Marital Status</Text>

            <Text style={styles.infoValue}>{maritalStatus || "Select"}</Text>
          </TouchableOpacity>

          {maritalStatus?.toLowerCase() === "married" && (
            <>
              <View style={styles.divider} />

              <DobRow
                label="Anniversary"
                dob={anniversaryDate}
                onPress={() => openDatePicker("anniversary")}
                isEditing={isEditing}
              />
            </>
          )}
        </View>

        <>
          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.infoRow}
            activeOpacity={0.7}
            onPress={() => setShowTermsModal(true)}
          >
            <Ionicons
              name={termsAccepted ? "checkbox" : "square-outline"}
              size={20}
              color="#1b2a6b"
            />

            <Text style={styles.infoLabel}>Terms & Conditions</Text>

            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
        </>

        {/* ── LOGOUT BUTTON ── */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LinearGradient
            colors={["#1B2A6B", "#2A3F8F", "#1B2A6B"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoutGradient}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* ── DEACTIVATE LINK ── */}
      <TouchableOpacity style={styles.deactivateBtn} onPress={handleDeactivate}>
        <Text style={styles.deactivateText}>Deactivate Account</Text>
      </TouchableOpacity>

      {/* ── NATIVE DATE PICKER (shown inline on iOS, dialog on Android) ── */}
      {showDatePicker && (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={new Date()}
          onChange={onDateSelected}
        />
      )}
      <Modal visible={showTermsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Terms & Conditions</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {TERMS.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.termRow}
                  activeOpacity={0.7}
                  onPress={() => {
                    setCheckedTerms((prev) => ({
                      ...prev,
                      [index]: !prev[index],
                    }));
                  }}
                >
                  <Ionicons
                    name={checkedTerms[index] ? "checkbox" : "square-outline"}
                    size={20}
                    color="#1b2a6b"
                  />

                  <Text style={styles.termText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              disabled={!allChecked}
              style={[
                styles.acceptBtn,
                !allChecked && {
                  backgroundColor: "#bbb",
                },
              ]}
              onPress={async () => {
                setTermsAccepted(true);

                await AsyncStorage.setItem(
                  "termsAccepted",
                  JSON.stringify(true),
                );

                setShowTermsModal(false);
              }}
            >
              <Text style={styles.acceptBtnText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showPhotoOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPhotoOptions(false)}
      >
        <TouchableOpacity
          style={[
            styles.modalOverlay,
            { justifyContent: "flex-start", paddingTop: 180 },
          ]}
          activeOpacity={1}
          onPress={() => setShowPhotoOptions(false)}
        >
          <View style={styles.photoBox}>
            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => {
                setShowPhotoOptions(false);
                openCamera();
              }}
            >
              <Text style={styles.optionText}>📷 Take a new picture</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => {
                setShowPhotoOptions(false);
                openGallery();
              }}
            >
              <Text style={styles.optionText}>🖼 Upload from gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowPhotoOptions(false)}
            ></TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showMaritalModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMaritalModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowMaritalModal(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.smallModal}>
            <Text style={styles.modalTitle}>Select Marital Status</Text>

            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => {
                setMaritalStatus("Married");
                setShowMaritalModal(false);
              }}
            >
              <Ionicons
                name={
                  maritalStatus === "Married"
                    ? "radio-button-on"
                    : "radio-button-off"
                }
                size={20}
                color="#1b2a6b"
              />

              <Text style={styles.radioText}>Married</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => {
                setMaritalStatus("Unmarried");
                setAnniversaryDate("");
                setShowMaritalModal(false);
              }}
            >
              <Ionicons
                name={
                  maritalStatus === "Unmarried"
                    ? "radio-button-on"
                    : "radio-button-off"
                }
                size={20}
                color="#1b2a6b"
              />

              <Text style={styles.radioText}>Unmarried</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function EditableRow({
  icon,
  label,
  value,
  setValue,
  isEditing,
  keyboardType = "default",
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color="#2a3f8f" />

      <Text style={styles.infoLabel}>{label}</Text>

      {isEditing ? (
        <TextInput
          style={styles.singleInput}
          value={value}
          onChangeText={setValue}
          keyboardType={keyboardType}
          placeholder={`Enter ${label}`}
          placeholderTextColor="#bbb"
        />
      ) : (
        <Text style={styles.infoValue}>{value || "—"}</Text>
      )}
    </View>
  );
}

// ─── DATE OF BIRTH ROW ────────────────────────────────────────────────────────

function DobRow({ label, dob, onPress, isEditing }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name="calendar-outline" size={18} color="#2a3f8f" />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{dob || "Not set"}</Text>
      {isEditing && (
        <TouchableOpacity onPress={onPress}>
          <Ionicons name="calendar-outline" size={18} color="#1b2a6b" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // ── Top white card ──
  topBand: {
    paddingTop: 55,
    paddingBottom: 20,
    alignItems: "center",
  },

  avatarWrapper: {
    position: "relative",
  },

  saveBtn: {
    backgroundColor: "#1b2a6b",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  saveBtnText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  // Navy blue ring around avatar
  avatarBorder: {
    width: 95,
    height: 95,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#1B2A6B",
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 38,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  radioText: {
    marginLeft: 2,
    fontSize: 11,
    color: "#1b2a6b",
    fontWeight: "500",
  },

  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
  },

  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#2a3f8f",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },

  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2a3f8f",
  },

  cameraBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2ECC71",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  photoBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    alignSelf: "center",
    width: "70%",
  },

  optionBtn: {
    paddingVertical: 10,
  },

  optionText: {
    fontSize: 15,
    color: "#1b2a6b",
    fontWeight: "600",
    paddingLeft: 30,
  },

  singleInput: {
    flex: 1,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "600",
    color: "#1b2a6b",
    paddingVertical: 0,
  },

  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1b2a6b",
    marginTop: 10,
  },

  accountBelow: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
  },

  uniqueIdBelow: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },

  // ── Personal info card ──
  sectionWrapper: {
    backgroundColor: "#fff",
    margin: 4,
    borderRadius: 18,
    padding: 18,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  sectionHeading: {
    fontSize: 13,
    fontWeight: "900",
    color: "#1b2a6b",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 13,
    gap: 8,
    borderRadius: 10,
  },

  infoLabel: {
    flex: 1,
    fontSize: 13,
    color: "#444",
    fontWeight: "500",
  },

  infoValue: {
    flexShrink: 1,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "600",
    color: "#1b2a6b",
    marginLeft: 10,
  },

  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
  },

  // ── Logout button ──
  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 6,
    borderRadius: 14,
    overflow: "hidden",
  },

  logoutGradient: {
    padding: 14,
    alignItems: "center",
    borderRadius: 14,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  deactivateBtn: {
    alignSelf: "flex-end",
    marginTop: 28,
    marginRight: 16,
    marginBottom: 13,
  },

  deactivateText: {
    color: "#bbb",
    fontSize: 12,
    textDecorationLine: "underline",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },

  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 12,
    maxHeight: "68%",
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1b2a6b",
    marginBottom: 15,
  },

  termRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 10,
  },

  termText: {
    flex: 1,
    fontSize: 13,
    color: "#333",
    lineHeight: 20,
  },

  acceptBtn: {
    backgroundColor: "#1b2a6b",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  acceptBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  smallModal: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
  },

  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 10,
  },

  radioText: {
    fontSize: 14,
    color: "#222",
  },
});
