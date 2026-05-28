import { useState, useEffect } from "react";
import bankData from "../assets/banknames.json";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";

export default function BankDetailsScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [bankName, setBankName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [accountType, setAccountType] = useState("savings");
  const [ifsc, setIfsc] = useState("");
  const [bankAddress, setBankAddress] = useState("");
  const [pan, setPan] = useState("");
  const [open, setOpen] = useState(false);

  const NAVY = "#1B2A6B";
  const LIGHT_NAVY = "#2A3F8F";
  const ORANGE = "#F5820A";

  useEffect(() => {
    loadSavedData();
    fetchBanks();
  }, []);

  function isValidIfsc(code) {
    return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(code);
  }

  async function loadSavedData() {
    try {
      const savedBankName = await AsyncStorage.getItem("bankName");
      const savedAccountNo = await AsyncStorage.getItem("accountNo");
      const savedAccountType = await AsyncStorage.getItem("accountType");
      const savedIfsc = await AsyncStorage.getItem("ifsc");
      const savedBankAddress = await AsyncStorage.getItem("bankAddress");

      if (savedBankName) {
        setBankName(savedBankName);
      }

      if (savedAccountNo) {
        setAccountNo(savedAccountNo);
      }

      if (savedAccountType) {
        setAccountType(savedAccountType);
      }

      if (savedIfsc) {
        setIfsc(savedIfsc);
      }

      if (savedBankAddress) {
        setBankAddress(savedBankAddress);
      }
    } catch (error) {
      console.log("Error loading bank data:", error);
    }
  }

  function handleAccountNoChange(text) {
    const numbersOnly = /^\d*$/;

    if (numbersOnly.test(text) && text.length <= 18) {
      setAccountNo(text);
    }
  }

  function handleIfscChange(text) {
  let upperText = text.toUpperCase();
  if (upperText.length <= 11) {
    setIfsc(upperText);
    if (upperText.length === 11) {
      fetchBankDetails(upperText);
    }
  }
}

  // function handleIfscChange(text) {
  //   let upperText = text.toUpperCase();

  //   // first 4 letters should not change
  //   if (upperText.length >= 4) {
  //     upperText = ifsc.substring(0, 4) + upperText.substring(4);
  //   }

  //   if (upperText.length <= 11) {
  //     setIfsc(upperText);
    
  //   }
  // }

  function handlePanChange(text) {
    if (text.length <= 10) {
      setPan(text.toUpperCase());
    }
  }

  async function handleNext() {
    if (!bankName.trim()) {
      Alert.alert("Required", "Please enter bank name");
      return;
    }

    if (!/^\d{9,18}$/.test(accountNo)) {
      Alert.alert(
        "Invalid Account Number",
        "Please enter a valid account number (9–18 digits)",
      );
      return;
    }

    if (!isValidIfsc(ifsc)) {
      Alert.alert("Required", "Please enter a valid IFSC code");
      return;
    }

    if (!bankAddress.trim()) {
      Alert.alert("Required", "Please enter bank branch address");
      return;
    }

    await AsyncStorage.setItem("bankName", bankName);
    await AsyncStorage.setItem("accountNo", accountNo);
    await AsyncStorage.setItem("accountType", accountType);
    await AsyncStorage.setItem("ifsc", ifsc);
    await AsyncStorage.setItem("bankAddress", bankAddress);
    await AsyncStorage.setItem("bankName", selectedBank?.label || bankName);

    navigation.navigate("EmergencyContact");
  }

  function fetchBanks() {
    try {
      const formatted = Object.entries(bankData)
        .map(([ifscPrefix, name]) => ({
          label: String(name),
          value: String(ifscPrefix),
          ifsc: String(ifscPrefix),
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setItems(formatted);
    } catch (err) {
      console.log("Failed to load banks:", err);
      Alert.alert("Error", "Could not load bank list.");
    }
  }

  async function fetchBankDetails(ifscCode) {
  if (ifscCode.length === 11) {
    try {
       Alert.alert("Fetching", "Calling API for: " + ifscCode);
      const res = await fetch(`https://ifsc.razorpay.com/${ifscCode}`);
      const data = await res.json();
       Alert.alert("Success", "Address: " + data.ADDRESS);
      setBankAddress(data.ADDRESS || "");
      setBankName(data.BANK || "");
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  }
}
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require("../assets/arrow.png")}
              style={styles.backImage}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Bank Details</Text>

          <View style={{ width: 30 }} />
        </View>

        <ScrollView
          style={styles.body}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          
         
        >
          <Text style={styles.label}>Bank Name</Text>

         <DropDownPicker
  open={open}
  value={bankName}
  items={items}
  setOpen={setOpen}
  setItems={setItems}
  setValue={(callback) => {
    const value = callback(bankName);
    setBankName(value);

    const selectedBank = items.find((b) => b.value === value);

    if (selectedBank) {
      setIfsc(selectedBank.ifsc);
    }
  }}
  searchable={true}
  placeholder="Select Bank"
  searchPlaceholder="Search bank"
  listMode="FLATLIST"
  modalProps={{
    animationType: "slide",
  }}
  modalTitle="Select Bank"
  style={styles.dropdown}
  dropDownContainerStyle={styles.dropdownContainer}
  placeholderStyle={{
    color: "#2A3F8F",
    fontSize: 13,
  }}
  selectedItemLabelStyle={{
    color: "#1B2A6B",
    fontWeight: "700",
  }}
  labelStyle={{
    color: "#1B2A6B",
    fontSize: 13,
  }}
  searchTextInputStyle={{
    borderColor: "#D6DBF0",
    color: "#1B2A6B",
    fontSize: 13,
  }}
  listItemLabelStyle={{
    color: "#1B2A6B",
    fontSize: 13,
  }}
  selectedItemContainerStyle={{
    backgroundColor: "#EEF1FB",
  }}
  itemSeparator={true}
  itemSeparatorStyle={{
    backgroundColor: "#D6DBF0",
  }}
/>
          <Text style={styles.label}>Account Number</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter account number"
            value={accountNo}
            placeholderTextColor="#2A3F8F"
            onChangeText={handleAccountNoChange}
            keyboardType="number-pad"
            maxLength={18}
          />

          <Text style={styles.label}>Account Type</Text>

          <View style={styles.radioRow}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setAccountType("current")}
            >
              <View style={styles.radioOuter}>
                {accountType === "current" && (
                  <View style={styles.radioInner} />
                )}
              </View>

              <Text style={styles.radioLabel}>Current</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setAccountType("savings")}
            >
              <View style={styles.radioOuter}>
                {accountType === "savings" && (
                  <View style={styles.radioInner} />
                )}
              </View>

              <Text style={styles.radioLabel}>Savings</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>IFSC Code</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. SBIN0001234"
            value={ifsc}
            placeholderTextColor="#2A3F8F"
            onChangeText={handleIfscChange}
            autoCapitalize="characters"
            maxLength={11}
          />

          {ifsc.length > 0 && !isValidIfsc(ifsc) && (
            <Text style={styles.errorText}>
              Invalid IFSC. Format: ABCD0123456
            </Text>
          )}

          <Text style={styles.label}>Bank Branch Address</Text>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter bank branch address"
            value={bankAddress}
            placeholderTextColor="#2A3F8F"
            onChangeText={setBankAddress}
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <LinearGradient
              colors={[NAVY, LIGHT_NAVY, NAVY]}
              style={styles.nextBtnGrad}
            >
              <Text style={styles.nextBtnText}>Next →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

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

  backImage: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    tintColor: "#1b2a6b",
  },

  headerTitle: {
    flex: 1,
    color: "#1b2a6b",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },

  dropdown: {
    height: 50,
    borderWidth: 1.5,
    borderColor: "#D6DBF0",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 5,
  },

  dropdownPlaceholder: {
    color: "#2A3F8F",
    fontSize: 13,
  },

  dropdownSelectedText: {
    color: "#1B2A6B",
    fontSize: 13,
  },

  dropdownContainer: {
  borderColor: "#D6DBF0",
  maxHeight: 300,
  zIndex: 9999,
  elevation: 9999,
},

  body: {
    paddingHorizontal: 20,
  },

  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1B2A6B",
    marginBottom: 5,
    marginTop: 14,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#D6DBF0",
    borderRadius: 10,
    padding: 11,
    fontSize: 13,
    color: "#1b2a6b",
  },

  radioRow: {
    flexDirection: "row",
    marginTop: 4,
    marginBottom: 4,
  },

  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#1B2A6B",
    justifyContent: "center",
    alignItems: "center",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 15,
    backgroundColor: "#1B2A6B",
  },

  radioLabel: {
    fontSize: 13,
    color: "#1B2A6B",
    fontWeight: "500",
    marginLeft: 8,
  },

  textArea: {
    height: 80,
    textAlignVertical: "top",
  },

  errorText: {
    color: "red",
    fontSize: 11,
    marginTop: 3,
  },

  nextBtn: {
    borderRadius: 40,
    overflow: "hidden",
    marginTop: 24,
    marginBottom: 30,
  },

  nextBtnGrad: {
    padding: 14,
    alignItems: "center",
  },

  nextBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
