import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Image,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { KeyboardAvoidingView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePicker from "@react-native-community/datetimepicker";
// import { supabase } from '../supabase';

import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
} from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function AuthScreen({ navigation, route }) {
  const role = route.params?.role;
  const [activeTab, setActiveTab] = useState("login");

  const API_BASE = "https://unlocking-skedaddle-opposing.ngrok-free.dev";

  // login states

  // login inputs
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  // login otp
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loginOtpVerifying, setLoginOtpVerifying] = useState(false);

  // login ui
  const [loginError, setLoginError] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // signup states
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [generatedPhoneOtp, setGeneratedPhoneOtp] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dob, setDob] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("");
  const [showGenderOptions, setShowGenderOptions] = useState(false);

  // get google user info using access token
  async function fetchGoogleUser(token) {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();

      await AsyncStorage.setItem("isLoggedIn", "true");
      await AsyncStorage.setItem("name", name);
      await AsyncStorage.setItem("lastName", lastName);
      await AsyncStorage.setItem("phone", signupPhone);
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("password", signupPassword);

      await AsyncStorage.setItem("dob", dob ? dob.toDateString() : "");

      await AsyncStorage.setItem("gender", gender);

      await AsyncStorage.setItem("role", role);
      await AsyncStorage.setItem("vehicleType", "bike");
      await AsyncStorage.setItem("isRegistered", "true");

      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Welcome!",
        textBody: `Signed in as ${user.email}`,
        button: "OK",
      });

      if (role === "user") {
        navigation.reset({ index: 0, routes: [{ name: "LiftSeekerMain" }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: "Main" }] });
      }
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Failed",
        textBody: "Google Sign In failed. Try again.",
        button: "OK",
      });
    }
  }

  // check if phone number is valid indian number
  function isValidPhone(number) {
    return /^[6-9]\d{9}$/.test(number);
  }

  // check if email format is correct
  function isValidEmail(text) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/.test(text);
  }

  function isValidPassword(pass) {
    return /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,10}$/.test(pass);
  }

  // send otp on login page
  async function handleSendOtp() {
    if (!isValidEmail(phone) && !isValidPhone(phone)) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Invalid",
        textBody: "Enter valid email or 10-digit phone number",
        button: "OK",
      });
      return;
    }
    setShowOtp(true);

    // if phone number then generate otp locally
    if (isValidPhone(phone)) {
      const genOtp = Math.floor(1000 + Math.random() * 9000).toString();

      setGeneratedOtp(genOtp);
      setOtpSent(true);

      alert("Your OTP is " + genOtp);

      return;
    }
    // if email then call backend api
    try {
      const res = await fetch(`${API_BASE}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: phone }),
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (e) {
        console.log("NON-JSON RESPONSE:", text);
        throw new Error("Backend did not return JSON");
      }

      console.log("OTP RESPONSE:", res.status, data);

      if (res.ok) {
        setOtpSent(true);
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "OTP Sent",
          textBody: data.message || "OTP sent successfully",
          button: "OK",
        });
      } else {
        throw new Error(data.message || "OTP failed");
      }
    } catch (error) {
      console.log("OTP ERROR:", error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: error.message || "Failed to send OTP",
        button: "OK",
      });
    }
  }

  // verify login otp
  async function handleVerifyOtp() {
    if (otp.length < 4) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Enter OTP",
        textBody: "Please enter the 4 digit OTP first",
        button: "OK",
      });
      return;
    }

    setLoginOtpVerifying(true);

    // phone otp verification
    if (isValidPhone(phone)) {
      setTimeout(async () => {
        if (otp === generatedOtp) {
          setLoginOtpVerifying(false);

          const savedRole = role || (await AsyncStorage.getItem("role"));
          const savedName = await AsyncStorage.getItem("name");
          const savedLastName = await AsyncStorage.getItem("lastName");
          const savedPassword = await AsyncStorage.getItem("password");
          const savedEmail = await AsyncStorage.getItem("email");
          const permissionsShown =
            await AsyncStorage.getItem("permissionsShown");

          await AsyncStorage.clear();

          await AsyncStorage.setItem("isLoggedIn", "true");
          await AsyncStorage.setItem("phone", phone);
          if (savedRole) await AsyncStorage.setItem("role", savedRole);
          if (savedName) await AsyncStorage.setItem("name", savedName);
          if (savedLastName)
            await AsyncStorage.setItem("lastName", savedLastName);
          if (savedPassword)
            await AsyncStorage.setItem("password", savedPassword);
          if (savedEmail) await AsyncStorage.setItem("email", savedEmail);
          if (permissionsShown)
            await AsyncStorage.setItem("permissionsShown", permissionsShown);

          if (savedRole === "user") {
            navigation.reset({
              index: 0,
              routes: [{ name: "LiftSeekerMain" }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: "Main", params: { phone: phone } }],
            });
          }
        } else {
          setLoginOtpVerifying(false);
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: "Wrong OTP",
            textBody: "The OTP you entered is incorrect",
            button: "Try Again",
          });
        }
      }, 1500);
      return;
    }

    // email otp verification
    try {
      const res = await fetch(`${API_BASE}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: phone, otp }),
      });
      const data = await res.json();
      setLoginOtpVerifying(false);
      await AsyncStorage.setItem("isLoggedIn", "true");
      await AsyncStorage.setItem("phone", phone);
      if (data.success) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Main", params: { phone: phone } }],
        });
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Wrong OTP",
          textBody: "Invalid OTP, try again",
          button: "Try Again",
        });
      }
    } catch (error) {
      setLoginOtpVerifying(false);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Failed to verify OTP",
        button: "OK",
      });
    }
  }

  // login button click
  async function handleLogin() {
    if (!phone) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Required",
        textBody: "phone or email",
        button: "OK",
      });
      return;
    }

    const savedPhone = await AsyncStorage.getItem("phone");
    const savedEmail = await AsyncStorage.getItem("email");
    const savedPassword = await AsyncStorage.getItem("password");
    let savedRole = await AsyncStorage.getItem("role");

    if (!savedRole) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Session Expired",
        textBody: "Please signup again",
        button: "OK",
      });
      return;
    }

    if (phone !== savedPhone && phone !== savedEmail) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Not Found",
        textBody:
          "No account found with this number or email. Please signup first.",
        button: "OK",
      });
      return;
    }

    if (password !== savedPassword) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        textBody: "Wrong password",
        button: "OK",
      });
      return;
    }

    await AsyncStorage.setItem("isLoggedIn", "true");

    if (savedRole === "user") {
      navigation.reset({ index: 0, routes: [{ name: "LiftSeekerMain" }] });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "Main", params: { phone: phone } }],
      });
    }
  }

  // when user types email on signup page
  function handleEmailChange(text) {
    setEmail(text);
    if (!text) {
      setEmailError("Email is required");
    } else if (!isValidEmail(text)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  }

  // send otp to email on signup page
  async function handleSendEmailOtp() {
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(`${API_BASE}/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.log("NON-JSON RESPONSE:", text);
        throw new Error("Backend did not return JSON");
      }

      if (res.ok && data.success) {
        setEmailOtpSent(true);
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "OTP Sent",
          textBody: data.message || "OTP sent to your email",
          button: "OK",
        });
      } else {
        throw new Error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.log("OTP SEND ERROR:", error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: error.message || "Failed to send OTP. Check your connection.",
        button: "OK",
      });
    } finally {
      setLoading(false);
    }
  }

  // verify email otp on signup
  async function handleVerifyEmailOtp() {
    try {
      const res = await fetch(`${API_BASE}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ email, otp: emailOtp }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.log("NON-JSON RESPONSE:", text);
        throw new Error("Backend did not return JSON");
      }

      if (data.success) {
        setEmailVerified(true);
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Email verified",
          button: "OK",
        });
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Wrong OTP",
          textBody: data.message || "Invalid OTP",
          button: "Try Again",
        });
      }
    } catch (error) {
      console.log("VERIFY OTP ERROR:", error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: error.message || "Verification failed",
        button: "OK",
      });
    }
  }

  // send phone otp
  function handleSendPhoneOtp() {
    if (!isValidPhone(signupPhone)) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Invalid Number",
        textBody:
          "Enter a valid 10 digit phone number starting with 6, 7, 8, or 9",
        button: "OK",
      });
      return;
    }
    var gen = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedPhoneOtp(gen);
    setPhoneOtpSent(true);
    alert("Your OTP is " + gen);
  }

  // verify phone otp on signup
  function handleVerifyPhoneOtp() {
    if (phoneOtp.length < 4) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Enter OTP",
        textBody: "Please enter the 4 digit OTP first",
        button: "OK",
      });
      return;
    }
    if (phoneOtp === generatedPhoneOtp) {
      setPhoneVerified(true);
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: "Phone verified successfully",
        button: "OK",
      });
    } else {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Wrong OTP",
        textBody: "The OTP you entered is incorrect",
        button: "Try Again",
      });
    }
  }

  // handle phone input change on login page
  function handleLoginPhoneChange(text) {
    setPhone(text);
    // check if number or email
    if (/^[0-9]/.test(text)) {
      if (/^[0-5]/.test(text)) {
        setLoginError("Phone must start with 6, 7, 8, or 9");
        setPhone("");
      } else if (text.length < 10) {
        setLoginError("Phone number must be 10 digits");
      } else if (text.length > 10) {
        setPhone(text.slice(0, 10));
      } else {
        setLoginError("");
      }
    } else {
      if (!isValidEmail(text)) {
        setLoginError("Invalid email format");
      } else {
        setLoginError("");
      }
    }
  }

  // handle phone input change on signup page
  function handleSignupPhoneChange(text) {
    const cleanedNumber = text.replace(/[^0-9]/g, "");

    if (cleanedNumber.length <= 10) {
      setSignupPhone(cleanedNumber);
      setPhoneOtp("");
      setPhoneOtpSent(false);
      setPhoneVerified(false);

      if (!cleanedNumber) {
        setPhoneError("Phone number is required");
      } else if (cleanedNumber.length < 10) {
        setPhoneError("Phone number must be 10 digits");
      } else if (!/^[6-9]/.test(cleanedNumber)) {
        setPhoneError("Phone must start with 6, 7, 8, or 9");
        setSignupPhone("");
      } else {
        setPhoneError("");
        Keyboard.dismiss();
      }
    }
  }

  // next button on signup - validate all fields
  async function handleNext() {
    // check phone already registered
    const savedPhone = await AsyncStorage.getItem("phone");
    if (savedPhone === signupPhone) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Already Registered",
        textBody: "This number is already registered. Please login.",
        button: "OK",
      });
      return;
    }

    // check first name
    if (!name.trim()) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Required",
        textBody: "Please enter your first name",
        button: "OK",
      });
      return;
    }

    // check last name
    if (!lastName.trim()) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Required",
        textBody: "Please enter your last name",
        button: "OK",
      });
      return;
    }

    // check date of birth selected
    if (!dob) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Required",
        textBody: "Please select your date of birth",
        button: "OK",
      });
      return;
    }

    // ✅ AGE CHECK — runs for EVERYONE, blocks navigation if contributor and under 18
    // age check for contributor
    const today = new Date();
    const birthDate = new Date(dob);

    let age = today.getFullYear() - birthDate.getFullYear();

    // subtract 1 if birthday hasn't come yet this year
    if (today.getMonth() < birthDate.getMonth()) {
      age = age - 1;
    } else if (
      today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate()
    ) {
      age = age - 1;
    }

    // print this in your console to debug
    console.log("role is:", role);
    console.log("age is:", age);

    // block contributor if under 18
    if (role === "rider") {
      if (age < 18) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Not Eligible",
          textBody: "You must be 18 or older to register as a contributor.",
          button: "OK",
        });
        return; // STOPS here, does NOT go to Documents
      }
    }

    // check gender
    if (!gender) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Required",
        textBody: "Please select gender",
        button: "OK",
      });
      return;
    }

    // check phone verified
    if (!phoneVerified) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Required",
        textBody: "Please verify your phone number first",
        button: "OK",
      });
      return;
    }

    // check password entered
    if (!signupPassword) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Required",
        textBody: "Enter password",
        button: "OK",
      });
      return;
    }

    // check passwords match
    if (signupPassword !== confirmPassword) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Mismatch",
        textBody: "Passwords do not match",
        button: "OK",
      });
      return;
    }

    // check password strength
    if (!isValidPassword(signupPassword)) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Weak Password",
        textBody:
          "Password must be 6–20 characters with letters, numbers & a symbol (!@#$%)",
        button: "OK",
      });
      return;
    }

    // ✅ ALL CHECKS PASSED — save data and navigate
    await AsyncStorage.setItem("isLoggedIn", "true");
    await AsyncStorage.setItem("name", name);
    await AsyncStorage.setItem("lastName", lastName);
    await AsyncStorage.setItem("phone", signupPhone);
    await AsyncStorage.setItem("email", email);
    await AsyncStorage.setItem("password", signupPassword);
    await AsyncStorage.setItem("role", role);
    await AsyncStorage.setItem("vehicleType", "bike");
    await AsyncStorage.setItem("isRegistered", "true");
    await AsyncStorage.setItem("gender", gender);
    await AsyncStorage.setItem("dob", dob ? dob.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "");

    // navigate based on role
    if (role === "user") {
      navigation.reset({ index: 0, routes: [{ name: "LiftSeekerMain" }] });
    } else {
      navigation.replace("Documents"); // only reaches here if age >= 18
    }
  }

  return (
    <AlertNotificationRoot>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <View style={styles.container}>
          {/* top green blue banner with logo */}
          <View style={styles.topBand}>
            <Image
              source={require("../assets/newlogo1.jpg")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* login signup tab buttons */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tab, activeTab === "login" && styles.tabActive]}
                onPress={() => setActiveTab("login")}
              >
                <Text
                  style={
                    activeTab === "login"
                      ? styles.tabActiveText
                      : styles.tabText
                  }
                >
                  Log In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, activeTab === "signup" && styles.tabActive]}
                onPress={() => setActiveTab("signup")}
              >
                <Text
                  style={
                    activeTab === "signup"
                      ? styles.tabActiveText
                      : styles.tabText
                  }
                >
                  Signup
                </Text>
              </TouchableOpacity>
            </View>

            {/* LOGIN FORM */}
            {activeTab === "login" && (
              <KeyboardAwareScrollView
                style={{ flex: 1 }}
                contentContainerStyle={[styles.body, { flexGrow: 1 }]}
                showsVerticalScrollIndicator
                keyboardShouldPersistTaps="handled"
                enableOnAndroid
                extraScrollHeight={20}
                enableAutomaticScroll
              >
                <View style={styles.phoneRow}>
                  <TextInput
                    style={[styles.input, styles.inputFlex]}
                    placeholder="Email or Phone Number"
                    placeholderTextColor="#7A8CA5"
                    value={phone}
                    onChangeText={handleLoginPhoneChange}
                    inputMode="email"
                    autoCapitalize="none"
                    // onFocus={autoDetectPhone}
                  />
                  {/* <TouchableOpacity
                                        style={styles.simBtn}
                                       // onPress={autoDetectPhone}
                                    >
                                        <Ionicons name="phone-portrait-outline" size={18} color="#fff" />
                                        <Text style={styles.simBtnText}>SIM</Text>
                                    </TouchableOpacity> */}
                </View>

                {loginError ? (
                  <Text style={styles.errorText}>{loginError}</Text>
                ) : null}

                {/* toggle between otp and password login */}
                <TouchableOpacity
                  onPress={() => setShowOtp(!showOtp)}
                  style={{ alignSelf: "flex-end", marginTop: 6 }}
                >
                  <Text
                    style={{
                      color: "#2a3f8f",
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    {showOtp ? "Login with Password" : "Login with OTP"}
                  </Text>
                </TouchableOpacity>

                {/* password login section */}
                {!showOtp && (
                  <>
                    <View style={{ position: "relative", marginTop: 10 }}>
                      <TextInput
                        style={[styles.input, { paddingRight: 40 }]}
                        placeholder="password"
                        placeholderTextColor="#7A8CA5"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showLoginPassword}
                      />
                      <TouchableOpacity
                        onPress={() => setShowLoginPassword(!showLoginPassword)}
                        style={{ position: "absolute", right: 12, top: 18 }}
                      >
                        <Ionicons
                          name={showLoginPassword ? "eye" : "eye-off"}
                          size={20}
                          color="#555"
                        />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.loginBtn}
                      onPress={handleLogin}
                    >
                      <LinearGradient
                        colors={["#2a3f8f", "#1270B8"]}
                        style={styles.loginBtnGrad}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={styles.loginBtnText}>Login</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                                            onPress={() => promptAsync({ useProxy: true })}
                                            style={styles.googleBtn}
                                        >
                                            <Text style={{ textAlign: 'center', fontWeight: '600' }}>
                                                Continue with Google
                                            </Text>
                                        </TouchableOpacity> */}
                  </>
                )}

                {/* otp login section */}
                {showOtp && (
                  <>
                    <View style={styles.row}>
                      <TextInput
                        style={[styles.input, styles.inputFlex]}
                        placeholder="Enter OTP"
                        placeholderTextColor="#7A8CA5"
                        value={otp}
                        onChangeText={(text) => {
                          setOtp(text);
                          if (text.length === 4) Keyboard.dismiss();
                        }}
                        inputMode="numeric"
                        maxLength={4}
                      />
                      <TouchableOpacity
                        style={[
                          styles.verifyBtn,
                          !isValidPhone(phone) &&
                            !isValidEmail(phone) &&
                            styles.verifyBtnDisabled,
                          otpSent && styles.sentBtn,
                        ]}
                        onPress={handleSendOtp}
                        disabled={phone.length < 10 || otpSent}
                      >
                        <Text style={styles.verifyText}>
                          {otpSent ? "Sent ✓" : "Send OTP"}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.verifyBtn,
                        {
                          marginTop: 10,
                          alignItems: "center",
                          backgroundColor: "#2a3f8f",
                        },
                        otp.length < 4 && styles.verifyBtnDisabled,
                      ]}
                      onPress={handleVerifyOtp}
                      disabled={otp.length < 4 || loginOtpVerifying}
                    >
                      <Text style={styles.verifyText}>Verify OTP</Text>
                    </TouchableOpacity>
                  </>
                )}
              </KeyboardAwareScrollView>
            )}

            {/* SIGNUP FORM */}
            {activeTab === "signup" && (
              <KeyboardAwareScrollView
                style={{ flex: 1 }}
                contentContainerStyle={[styles.body, { flexGrow: 1 }]}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
                extraScrollHeight={20}
                enableAutomaticScroll={true}
              >
                <TextInput
                  style={styles.input}
                  placeholder="FirstName"
                  placeholderTextColor="#7A8CA5"
                  value={name}
                  onChangeText={setName}
                />

                <TextInput
                  style={styles.input}
                  placeholder="LastName"
                  placeholderTextColor="#7A8CA5"
                  value={lastName}
                  onChangeText={setLastName}
                />

                {/* email input with send otp button */}
                <View style={styles.row}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.inputFlex,
                      emailVerified && styles.inputDisabled,
                    ]}
                    placeholder="Email"
                    value={email}
                    placeholderTextColor="#7A8CA5"
                    onChangeText={handleEmailChange}
                    inputMode="email"
                    autoCapitalize="none"
                    editable={!emailVerified}
                  />
                  <TouchableOpacity
                    style={[
                      styles.verifyBtn,
                      { backgroundColor: "#2a3f8f" },
                      !isValidEmail(email) && styles.verifyBtnDisabled,
                      emailOtpSent && styles.sentBtn,
                    ]}
                    onPress={handleSendEmailOtp}
                    disabled={emailOtpSent || !isValidEmail(email)}
                  >
                    <Text style={styles.verifyText}>
                      {loading
                        ? "Sending..."
                        : emailOtpSent
                          ? "Sent ✓"
                          : "Send OTP"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {emailError ? (
                  <Text style={styles.errorText}>{emailError}</Text>
                ) : null}

                {/* email otp input - shows after otp is sent */}
                {emailOtpSent && (
                  <>
                    <View style={styles.row}>
                      <TextInput
                        style={[
                          styles.input,
                          styles.inputFlex,
                          emailVerified && styles.inputDisabled,
                        ]}
                        placeholder="Email OTP"
                        value={emailOtp}
                        placeholderTextColor="#7A8CA5"
                        onChangeText={(text) => {
                          setEmailOtp(text);
                          if (text.length === 4) Keyboard.dismiss();
                        }}
                        inputMode="numeric"
                        maxLength={4}
                        editable={!emailVerified}
                      />
                      <TouchableOpacity
                        style={[
                          styles.verifyBtn,
                          emailVerified && styles.verifiedBtn,
                          emailOtp.length < 4 && styles.verifyBtnDisabled,
                        ]}
                        onPress={handleVerifyEmailOtp}
                        disabled={emailOtp.length < 4 || emailVerified}
                      >
                        <Text
                          style={[
                            styles.verifyText,
                            emailVerified && styles.verifiedText,
                          ]}
                        >
                          {emailVerified ? "Verified ✓" : "Verify"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {/* phone input with send otp button */}
                <View style={styles.row}>
                  {/* PHONE INPUT */}
                  <TextInput
                    style={[
                      styles.input,
                      styles.inputFlex,
                      phoneVerified && styles.inputDisabled,
                    ]}
                    placeholder="Phone Number"
                    value={signupPhone}
                    placeholderTextColor="#7A8CA5"
                    onChangeText={handleSignupPhoneChange}
                    inputMode="numeric"
                    maxLength={10}
                    editable={!phoneVerified}
                  />

                  {/* OTP INPUT (INLINE SAME ROW) */}
                  {phoneOtpSent && (
                    <TextInput
                      style={[
                        styles.input,
                        {
                          width: 120,
                          marginLeft: 8,
                          textAlign: "center",
                        },
                      ]}
                      placeholder="OTP"
                      placeholderTextColor="#7A8CA5"
                      value={phoneOtp}
                      onChangeText={(text) => {
                        setPhoneOtp(text);
                        if (text.length === 4) Keyboard.dismiss();
                      }}
                      inputMode="numeric"
                      maxLength={4}
                      editable={!phoneVerified}
                    />
                  )}

                  {/* BUTTON */}
                  <TouchableOpacity
                    style={[
                      styles.verifyBtn,
                      phoneVerified && styles.verifiedBtn,
                      {
                        backgroundColor: isValidPhone(signupPhone)
                          ? "#2a3f8f"
                          : "#aaabc8",
                      },
                    ]}
                    onPress={
                      phoneOtpSent ? handleVerifyPhoneOtp : handleSendPhoneOtp
                    }
                    disabled={!isValidPhone(signupPhone)}
                  >
                    <Text
                      style={[
                        styles.verifyText,
                        phoneVerified && styles.verifiedText,
                      ]}
                    >
                      {phoneVerified
                        ? "Verified ✓"
                        : phoneOtpSent
                          ? "Verify"
                          : "Send OTP"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {phoneError ? (
                  <Text style={styles.errorText}>{phoneError}</Text>
                ) : null}

                {/* phone otp input - shows after otp is sent */}
                {/* {phoneOtpSent && (
                  <View style={styles.row}>
                    <TextInput
                      style={[
                        styles.input,
                        styles.inputFlex,
                        phoneVerified && styles.inputDisabled,
                      ]}
                      placeholder="Enter OTP here"
                      placeholderTextColor="#7A8CA5"
                      value={phoneOtp}
                      onChangeText={(text) => {
                        setPhoneOtp(text);
                        if (text.length === 4) Keyboard.dismiss();
                      }}
                      inputMode="numeric"
                      maxLength={4}
                      editable={!phoneVerified}
                    />

                    <TouchableOpacity
                      style={[
                        styles.verifyBtn,
                        phoneVerified && styles.verifiedBtn,
                        phoneOtp.length < 4 && styles.verifyBtnDisabled,
                      ]}
                      onPress={handleVerifyPhoneOtp}
                      disabled={phoneOtp.length < 4 || phoneVerified}
                    >
                      <Text
                        style={[
                          styles.verifyText,
                          phoneVerified && styles.verifiedText,
                        ]}
                      >
                        {phoneVerified ? "Verified ✓" : "Verify"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )} */}

                <View>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={{ color: dob ? "#000" : "#7A8CA5" }}>
                      {dob ? dob.toDateString() : "Select Date of Birth"}
                    </Text>
                  </TouchableOpacity>

                  {showDatePicker && (
                    <DateTimePicker
                      value={dob || new Date(2000, 0, 1)}
                      mode="date"
                      display="default"
                      maximumDate={new Date()} // no future DOB
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) setDob(selectedDate);
                      }}
                    />
                  )}
                </View>
                <View style={{ position: "relative" }}>
                  {/* input field */}
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowGenderOptions(!showGenderOptions)}
                  >
                    <Text style={{ color: gender ? "#000" : "#7A8CA5" }}>
                      {gender || "Select Gender"}
                    </Text>
                  </TouchableOpacity>

                  {/* DROPDOWN (FLOAT RIGHT SIDE) */}
                  {showGenderOptions && (
                    <View
                      style={{
                        position: "absolute",
                        top: 45,
                        right: 0,
                        width: 140,
                        backgroundColor: "#fff",
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "#ddd",
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
                        elevation: 5,
                        zIndex: 999,
                      }}
                    >
                      {["Male", "Female", "Other"].map((item) => (
                        <TouchableOpacity
                          key={item}
                          onPress={() => {
                            setGender(item);
                            setShowGenderOptions(false);
                          }}
                          style={{
                            padding: 10,
                            borderBottomWidth: item !== "Other" ? 1 : 0,
                            borderColor: "#eee",
                          }}
                        >
                          <Text>{item}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* password input */}
                <View style={{ position: "relative" }}>
                  <TextInput
                    style={[styles.input, { paddingRight: 40 }]}
                    placeholder="Create Password"
                    value={signupPassword}
                    placeholderTextColor="#7A8CA5"
                    onChangeText={setSignupPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 12, top: 18 }}
                  >
                    <Ionicons
                      name={showPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#555"
                    />
                  </TouchableOpacity>
                </View>

                {signupPassword.length > 0 && (
                  <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                    {signupPassword.length < 6
                      ? "Min 6 characters"
                      : !/[0-9]/.test(signupPassword)
                        ? "Add a number"
                        : !/[!@#$%^&*]/.test(signupPassword)
                          ? "Add a symbol (!@#$%)"
                          : ""}
                  </Text>
                )}

                {/* confirm password input */}
                <View style={{ position: "relative" }}>
                  <TextInput
                    style={[styles.input, { paddingRight: 40 }]}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    placeholderTextColor="#7A8CA5"
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: "absolute", right: 12, top: 18 }}
                  >
                    <Ionicons
                      name={showConfirmPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#555"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                  <LinearGradient
                    colors={["#1b2a6b", "#1270B8"]}
                    style={styles.nextBtnGrad}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.nextBtnText}>Next →</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </KeyboardAwareScrollView>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* loading overlay when verifying otp */}
      {loginOtpVerifying && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <ActivityIndicator size="large" color="#fff" />
          <Text
            style={{
              color: "#fff",
              marginTop: 12,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Verifying...
          </Text>
        </View>
      )}
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  topBand: {
    height: 230,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 10,
  },

  logo: {
    width: 190,
    height: 190,
    marginTop: 60,
  },

  tabRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 55,
    marginBottom: 4,
    backgroundColor: "#F0F0F0",
    borderRadius: 50,
    padding: 4,
  },

  phoneRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 10,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 50,
  },

  tabActive: {
    backgroundColor: "#2a3f8f",
  },

  tabActiveText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  tabText: {
    color: "#888",
    fontSize: 13,
    fontWeight: "600",
  },

  body: {
    paddingHorizontal: 20,
    marginTop: 8,
    paddingBottom: 20,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D4EBE2",
    borderRadius: 50,
    padding: 11,
    marginTop: 10,
    paddingHorizontal: 16,
    fontSize: 13,
    color: "#1A2E25",
  },

  googleBtn: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 50,
    marginTop: 10,
    backgroundColor: "#fff",
  },

  inputFlex: {
    flex: 1,
    marginTop: 4,
  },

  inputDisabled: {
    backgroundColor: "#F0F0F0",
    opacity: 0.6,
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginTop: 6,
  },

  loginBtn: {
    borderRadius: 50,
    overflow: "hidden",
    marginTop: 18,
  },

  loginBtnGrad: {
    padding: 14,
    alignItems: "center",
  },

  loginBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  verifyBtn: {
    backgroundColor: "#2a3f8f",
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 50,
  },

  verifyBtnDisabled: {
    backgroundColor: "#aaabc8",
  },

  verifiedBtn: {
    backgroundColor: "#E2F7EE",
    borderWidth: 1.5,
    borderColor: "#B0CFC4",
  },

  verifyText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  verifiedText: {
    color: "#2a3f8f",
  },

  errorText: {
    color: "red",
    fontSize: 10,
    marginTop: 4,
  },

  divider: {
    borderTopWidth: 1,
    borderColor: "#EAF2EE",
    marginTop: 10,
    marginBottom: 6,
  },

  nextBtn: {
    borderRadius: 50,
    overflow: "hidden",
    marginTop: 18,
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









