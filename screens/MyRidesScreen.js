import React from "react";
import { LinearGradient } from 'expo-linear-gradient';

import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";

const weeklyData = [
  { day: "Mon", rides: 3 },
  { day: "Tue", rides: 7 },
  { day: "Wed", rides: 5 },
  { day: "Thu", rides: 9 },
  { day: "Fri", rides: 6 },
  { day: "Sat", rides: 12 },
  { day: "Sun", rides: 4 },
];

const rideHistory = [
  {
    from: "Hitech City",
    to: "Banjara Hills",
    vehicle: "Auto",
    distance: "4.2 km",
    status: "Completed",
  },
  {
    from: "Gachibowli",
    to: "Madhapur",
    vehicle: "Bike",
    distance: "3.1 km",
    status: "Completed",
  },
  {
    from: "Ameerpet",
    to: "Secunderabad",
    vehicle: "Cab",
    distance: "8.5 km",
    status: "Cancelled",
  },
  {
    from: "Jubilee Hills",
    to: "Kukatpally",
    vehicle: "Auto",
    distance: "7.8 km",
    status: "Completed",
  },
];

const totalRides = weeklyData.reduce(
  (sum, item) => sum + item.rides,
  0
);

export default function MyRidesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* TOP HEADER */}
        <LinearGradient
          colors={['#0C7A54', '#1270B8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.topBand}
        >


          <Text style={styles.title}>
            My Rides
          </Text>

          <View style={styles.cardRow}>

            <View style={styles.infoCard}>
              <Text style={styles.infoValue}>
                {totalRides}
              </Text>

              <Text style={styles.infoLabel}>
                Total rides
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoValue}>
                124 km
              </Text>

              <Text style={styles.infoLabel}>
                Distance
              </Text>
            </View>

          </View>
        </LinearGradient>

        {/* GRAPH */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Rides this week
          </Text>

          <View style={styles.graphContainer}>
            {weeklyData.map((item, index) => {
              const active = item.day === "Sat";

              return (
                <View
                  key={index}
                  style={styles.graphItem}
                >
                  <Text style={styles.graphValue}>
                    {item.rides}
                  </Text>

                  <View
                    style={[
                      styles.bar,
                      {
                        height: item.rides * 10,
                        backgroundColor: active
                          ? "#0A84FF"
                          : "#D9E2EC",
                      },
                    ]}
                  />

                  <Text style={styles.dayText}>
                    {item.day}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* AVG CARD */}
          <View style={styles.avgCard}>
            <View style={styles.iconBox}>
              <Text style={{ color: "#fff", fontSize: 12 }}>
                ⏱
              </Text>
            </View>

            <View>
              <Text style={styles.avgTime}>
                38 min
              </Text>

              <Text style={styles.avgLabel}>
                Average ride time
              </Text>
            </View>
          </View>
        </View>

        {/* HISTORY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Recent Rides
          </Text>

          {rideHistory.map((ride, index) => (
            <View
              key={index}
              style={styles.rideCard}
            >
              <View style={styles.leftRide}>
                <View style={styles.vehicleIcon}>
                  <Text>🚕</Text>
                </View>

                <View>
                  <Text style={styles.route}>
                    {ride.from} → {ride.to}
                  </Text>

                  <Text style={styles.vehicleText}>
                    {ride.vehicle}
                  </Text>

                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          ride.status === "Completed"
                            ? "#DFF7E2"
                            : "#FFE3E3",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color:
                          ride.status === "Completed"
                            ? "green"
                            : "red",
                      }}
                    >
                      {ride.status}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.distance}>
                {ride.distance}
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  topBand: {
    paddingTop: 14,
    paddingBottom: 20,
    paddingHorizontal: 16,

    minHeight: 180,

    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  goodMorning: {
    color: "#DDF7FA",
    fontSize: 15,
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 25,
  },

  cardRow: {
    flexDirection: "row",
    marginTop: 25,
    justifyContent: "space-between",
  },

  infoCard: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
  },

  infoValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  infoLabel: {
    color: "#EAFBFD",
    marginTop: 3,
    fontSize: 11,
  },

  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 14,
  },

  graphContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  graphItem: {
    alignItems: "center",
  },

  graphValue: {
    marginBottom: 6,
    color: "#555",
  },

  bar: {
    width: 28,
    borderRadius: 10,
  },

  dayText: {
    marginTop: 8,
    color: "#777",
    fontSize: 12,
  },

  avgCard: {
    marginTop: 18,
    backgroundColor: "#EAF9F0",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  avgTime: {
    fontSize: 16,
    fontWeight: "700",
  },

  avgLabel: {
    color: "#666",
    marginTop: 1,
    fontSize: 11,
  },

  rideCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftRide: {
    flexDirection: "row",
    alignItems: "center",
  },

  vehicleIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  route: {
    fontWeight: "600",
    fontSize: 13,
  },

  vehicleText: {
    color: "#777",
    marginTop: 2,
    fontSize: 11,
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 6,
  },

  distance: {
    fontWeight: "600",
    color: "#444",
    fontSize: 12,
  },
});