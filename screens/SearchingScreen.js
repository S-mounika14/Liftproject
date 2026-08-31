import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, PanResponder } from "react-native";

// import MapView, { Marker, Polyline } from 'react-native-maps';
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageBackground } from "react-native";

function DummyMap({ style }) {
  return (
    <ImageBackground
      source={require("../assets/map1.jpg")}
      style={[style, { flex: 1, width: "100%", height: "100%" }]}
      resizeMode="cover"
    ></ImageBackground>
  );
}

export default function SearchingScreen({ route, navigation }) {
  const {
    vehicleType,
    currentCoords,
    destinationCoords,
    pickupLabel,
    dropLabel,
  } = route.params;

  const [dots, setDots] = useState("");

  const loadingAnim = useRef(new Animated.Value(-160)).current;
  const bottomSheetAnim = useRef(new Animated.Value(0)).current;

  const BOTTOM_SHEET_HEIGHT = 500;

  useEffect(() => {
    const dotsTimer = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length >= 3) {
          return "";
        }

        return prevDots + ".";
      });
    }, 500);

    Animated.loop(
      Animated.timing(loadingAnim, {
        toValue: 320,
        duration: 2600,
        useNativeDriver: true,
      }),
    ).start();

    const contributorTimer = setTimeout(async () => {
      try {
        const contributorPlayerId = await AsyncStorage.getItem(
          "contributorPlayerId",
        );
        console.log("Sending to contributor:", contributorPlayerId);

        const response = await fetch(
          "https://onesignal.com/api/v1/notifications",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "os_v2_app_4ha2ykw245er5bjvrx52gw22le37rt2gvz3uitvrtle5dca45uskpj5e25v3l5kkrc37mdjllb3stqrlrvp76ghzplx2ez4reo2pszi",
            },
            body: JSON.stringify({
              app_id: "e1c1ac2a-dae7-491e-8535-8dfba35b5a59",
              included_segments: ["All"],
              headings: { en: "LiftPlz 🚗" },
              contents: { en: "New ride request near you! Tap to accept." },
              data: { screen: "RideAccepted" },
            }),
          },
        );

        const result = await response.json();
        console.log("OneSignal Response:", JSON.stringify(result));

        navigation.replace("RideAccepted", {
          pickupLabel,
          dropLabel,
          currentCoords,
          destinationCoords,
        });
      } catch (err) {
        console.log("Error:", err);
      }
    }, 15000);

    // Auto open accepted screen after 5 seconds
    //   const contributorTimer = setTimeout(() => {

    //     navigation.replace('RideAccepted', {
    //       pickupLabel,
    //       dropLabel,
    //       currentCoords,
    //       destinationCoords,
    //     });

    //   }, 6000);

    return () => {
      clearInterval(dotsTimer);
      clearTimeout(contributorTimer);
    };
  }, []);

  // Bottom sheet drag
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,

    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        bottomSheetAnim.setValue(gestureState.dy);
      }
    },

    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 120) {
        Animated.timing(bottomSheetAnim, {
          toValue: BOTTOM_SHEET_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(bottomSheetAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const startPoint = currentCoords;

  const destinationPoint = destinationCoords;

  const routeCoordinates = [
    startPoint,

    {
      latitude: (startPoint.latitude + destinationPoint.latitude) / 2,

      longitude: startPoint.longitude + 0.002,
    },

    {
      latitude: (startPoint.latitude + destinationPoint.latitude) / 2 + 0.002,

      longitude: (startPoint.longitude + destinationPoint.longitude) / 2,
    },

    destinationPoint,
  ];

  const nearbyVehicles = [
    {
      id: 1,
      latitude: startPoint.latitude + 0.0015,
      longitude: startPoint.longitude + 0.002,
    },

    {
      id: 2,
      latitude: startPoint.latitude + 0.003,
      longitude: startPoint.longitude + 0.004,
    },

    {
      id: 3,
      latitude: startPoint.latitude + 0.002,
      longitude: startPoint.longitude + 0.006,
    },

    {
      id: 4,
      latitude: startPoint.latitude + 0.004,
      longitude: startPoint.longitude + 0.001,
    },
  ];

  return (
    <View style={styles.container}>
      <DummyMap style={styles.map} />

      {/* <MapView
        style={styles.map}
        initialRegion={{
          latitude: startPoint.latitude,
          longitude: startPoint.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
      >

        <Marker
          coordinate={startPoint}
          pinColor="green"
        />

        <Marker
          coordinate={destinationPoint}
          pinColor="red"
        />

        <Polyline
          coordinates={routeCoordinates}
          strokeWidth={6}
          strokeColor="#E53935"
          lineCap="round"
          lineJoin="round"
        />

        {nearbyVehicles.map(vehicle => (

          <Marker
            key={vehicle.id}
            coordinate={{
              latitude: vehicle.latitude,
              longitude: vehicle.longitude,
            }}
          >

            <View style={styles.vehicleMarker}>

              <Text style={styles.vehicleEmoji}>
                {vehicleType === 'Bike' ? '🏍️' : '🚗'}
              </Text>

            </View>

          </Marker>

        ))}

      </MapView> */}

      <Animated.View
        style={[
          styles.bottomSheet,
          {
            transform: [{ translateY: bottomSheetAnim }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.dragHandle} />

        <Text style={styles.heading}>Finding nearby contributors{dots}</Text>

        <View style={styles.loadingBarContainer}>
          <Animated.View
            style={{
              transform: [{ translateX: loadingAnim }],
            }}
          >
            <LinearGradient
              colors={["#0B8F6A", "#1E88E5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loadingBar}
            />
          </Animated.View>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ride Type</Text>
            <Text style={styles.detailValue}>{vehicleType}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nearby Contributors</Text>
            <Text style={styles.detailValue}>4 nearby</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimated Wait</Text>
            <Text style={styles.detailValue}>3 mins</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  vehicleMarker: {
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 30,
    elevation: 5,
  },

  vehicleEmoji: {
    fontSize: 18,
  },

  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
    paddingBottom: 30,
    elevation: 12,
  },

  dragHandle: {
    width: 50,
    height: 5,
    borderRadius: 20,
    backgroundColor: "#D8D8D8",
    alignSelf: "center",
    marginBottom: 18,
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 20,
  },

  loadingBarContainer: {
    height: 6,
    backgroundColor: "#E5E5E5",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
  },

  loadingBar: {
    width: 160,
    height: 6,
    borderRadius: 20,
  },

  detailsCard: {
    backgroundColor: "#F7F7F7",
    borderRadius: 18,
    padding: 16,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  detailLabel: {
    color: "#777",
    fontSize: 14,
  },

  detailValue: {
    color: "#111",
    fontWeight: "700",
    fontSize: 14,
  },
});
