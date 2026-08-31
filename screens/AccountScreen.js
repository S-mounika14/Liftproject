import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  Modal,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function AccountScreen({ navigation }) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const NAVY = "#1B2A6B";
  const LIGHT_NAVY = "#2A3F8F";
  const ORANGE = "#F5820A";

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      const savedName = await AsyncStorage.getItem("name");
      const savedLastName = await AsyncStorage.getItem("lastName");
      const savedPhone = await AsyncStorage.getItem("phone");
      const savedPhoto = await AsyncStorage.getItem("photo");

      console.log("Name:", savedName);
      console.log("Last Name:", savedLastName);
      console.log("Phone:", savedPhone);

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
      console.log("Error loading user data:", error);
    }
  }

  async function openCamera() {
    const { granted, canAskAgain } =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!granted && !canAskAgain) {
      Alert.alert(
        "Camera Permission Required",
        "Please allow camera access in settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      setImage(selectedImage);
      await AsyncStorage.setItem("photo", selectedImage);
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

      setImage(selectedImage);

      await AsyncStorage.setItem("photo", selectedImage);
    }
  }

  async function handleLogout() {
    await AsyncStorage.removeItem("isLoggedIn");

    navigation.replace("JoinAs");
  }

  const displayName = name ? `${name} ${lastName}` : "User";

  const displayPhone = phone || "No Number";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBand}>
        <View style={{ position: "relative" }}>
          <TouchableOpacity onPress={() => setShowPhotoOptions(true)}>
            {image ? (
              <Image source={{ uri: image }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar}>
                <Ionicons name="person" size={45} color="#7a7c85" />
              </View>
            )}
          </TouchableOpacity>

          {/* EDIT ICON */}
          <TouchableOpacity
            onPress={() => setShowPhotoOptions(true)}
            style={styles.editIcon}
          >
            <Ionicons name="pencil" size={14} color="#1b2a6b" />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.phone}>{displayPhone}</Text>
      </View>

      <View style={styles.menuCard}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Documents")}
        >
          <Ionicons
            name="document-text-outline"
            size={22}
            color="#1b2a6b"
            style={styles.menuIcon}
          />

          <Text style={styles.menuText}>KYC Documents</Text>

          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("VehicleInfo")}
        >
          <Ionicons
            name="car-outline"
            size={22}
            color="#1b2a6b"
            style={styles.menuIcon}
          />

          <Text style={styles.menuText}>Vehicle Documents</Text>

          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("BankDetails")}
        >
          <Ionicons
            name="card-outline"
            size={22}
            color="#1b2a6b"
            style={styles.menuIcon}
          />

          <Text style={styles.menuText}>Bank Account Details</Text>

          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("EmergencyContact")}
        >
          <Ionicons
            name="warning-outline"
            size={22}
            color="#1b2a6b"
            style={styles.menuIcon}
          />

          <Text style={styles.menuText}>Emergency Contact</Text>

          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setShowSupport(!showSupport)}
        >
          <Ionicons
            name="headset-outline"
            size={22}
            color="#1b2a6b"
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>Support</Text>
          <Ionicons
            name={showSupport ? "chevron-down" : "chevron-down"}
            size={15}
            color="#8896B3"
          />
        </TouchableOpacity>

        {showSupport && (
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#EDF0F8",
              marginHorizontal: 12,
              marginBottom: 8,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 12,
                gap: 8,
              }}
              onPress={() => Linking.openURL("tel:+918885556666")}
            >
              <Ionicons name="call-outline" size={16} color="#1b2a6b" />
              <Text
                style={{ fontSize: 13, color: "#1b2a6b", fontWeight: "500" }}
              >
                Call
              </Text>
            </TouchableOpacity>

            <View style={{ height: 1, backgroundColor: "#EDF0F8" }} />

            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 12,
                gap: 8,
              }}
              onPress={() =>
                Linking.openURL(
                  "https://api.whatsapp.com/send?phone=918885556666",
                )
              }
            >
              <Ionicons name="chatbubble-outline" size={16} color="#1b2a6b" />
              <Text
                style={{ fontSize: 13, color: "#1b2a6b", fontWeight: "500" }}
              >
                Chat
              </Text>
            </TouchableOpacity>

            <View style={{ height: 1, backgroundColor: "#EDF0F8" }} />

            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 12,
                gap: 8,
              }}
              onPress={() =>
                Linking.openURL(
                  "mailto:2080tecnologiesprivatelimited@gmail.com",
                )
              }
            >
              <Ionicons name="mail-outline" size={16} color="#1b2a6b" />
              <Text
                style={{ fontSize: 13, color: "#1b2a6b", fontWeight: "500" }}
              >
                Email
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <LinearGradient
          colors={["#1B2A6B", "#2A3F8F", "#1B2A6B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            padding: 14,
            alignItems: "center",
            borderRadius: 14,
          }}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        visible={showPhotoOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPhotoOptions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
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
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  topBand: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#1B2A6B",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1b2a6b",
    marginTop: 10,
  },

  phone: {
    fontSize: 13,
    color: "#1b2a6b",
    marginTop: 2,
  },

  menuCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 14,
    overflow: "visible",
    borderWidth: 1,
    borderColor: "#EDF0F8",
    elevation: 2,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },

  menuIcon: {
    marginRight: 12,
  },

  menuText: {
    flex: 1,
    fontSize: 14,
    color: "#1b2a6b",
    fontWeight: "500",
  },

  editIcon: {
    position: "absolute",
    right: 3,
    bottom: 2,
    backgroundColor: "#fff",
    width: 24,
    height: 24,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1b2a6b",
  },

  menuArrow: {
    fontSize: 20,
    color: "#8896B3",
  },

  menuDivider: {
    height: 1,
    backgroundColor: "#EDF0F8",
    marginLeft: 46,
  },

  logoutBtn: {
    marginHorizontal: 16,
    padding: 14,
    alignItems: "center",
    zIndex: 1,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 75,
    paddingTop: 16,
    paddingBottom: 402,
  },

  photoBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 3,
  },

  optionBtn: {
    paddingVertical: 12,
  },

  optionText: {
    fontSize: 15,
    color: "#1b2a6b",
    fontWeight: "600",
    marginLeft: 28,
  },
});
