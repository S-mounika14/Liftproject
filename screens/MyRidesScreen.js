import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
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
  { from: "Hitech City", to: "Banjara Hills", vehicle: "Auto", distance: "4.2 km", status: "Completed" },
  { from: "Gachibowli", to: "Madhapur", vehicle: "Bike", distance: "3.1 km", status: "Completed" },
  { from: "Ameerpet", to: "Secunderabad", vehicle: "Cab", distance: "8.5 km", status: "Cancelled" },
  { from: "Jubilee Hills", to: "Kukatpally", vehicle: "Auto", distance: "7.8 km", status: "Completed" },
];

const gains = {
  weekly: {
    earnings: "₹1,240",
    rides: 46,
    avgPerRide: "₹26.9",
    peak: "Saturday",
    peakAmount: "₹310",
    trend: "+18% vs last week",
    breakdown: [
      { label: "Cab",  color: "#0A84FF", pct: 72, amount: "₹890" },
      { label: "car", color: "#34C759", pct: 40, amount: "₹250" },
      { label: "Bike", color: "#FF9F0A", pct: 16, amount: "₹100" },
    ],
  },
  monthly: {
    earnings: "₹5,840",
    rides: 186,
    avgPerRide: "₹31.4",
    peak: "Week 3",
    peakAmount: "₹1,680",
    trend: "+12% vs last month",
    breakdown: [
      { label: "Cab",  color: "#0A84FF", pct: 68, amount: "₹3,970" },
      { label: "car", color: "#34C759", pct: 30, amount: "₹1,240" },
      { label: "Bike", color: "#FF9F0A", pct: 11, amount: "₹630"   },
    ],
  },
};

const totalRides = weeklyData.reduce((sum, item) => sum + item.rides, 0);

export default function MyRidesScreen() {
  const [tab, setTab] = useState("weekly");
  const g = gains[tab];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <LinearGradient
          colors={["#2a3f8f", "#1270B8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.topBand}
        >
          <Text style={styles.title}>My Rides</Text>
          <View style={styles.cardRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoValue}>{totalRides}</Text>
              <Text style={styles.infoLabel}>Total rides</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoValue}>124 km</Text>
              <Text style={styles.infoLabel}>Distance</Text>
            </View>
          </View>
        </LinearGradient>

        {/* GRAPH */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rides this week</Text>
          <View style={styles.graphContainer}>
            {weeklyData.map((item, index) => {
              const active = item.day === "Sat";
              return (
                <View key={index} style={styles.graphItem}>
                  <Text style={styles.graphValue}>{item.rides}</Text>
                  <View style={[styles.bar, { height: item.rides * 10, backgroundColor: active ? "#0A84FF" : "#D9E2EC" }]} />
                  <Text style={styles.dayText}>{item.day}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.avgCard}>
            <View style={styles.iconBox}>
              <Text style={{ color: "#fff", fontSize: 12 }}>⏱</Text>
            </View>
            <View>
              <Text style={styles.avgTime}>38 min</Text>
              <Text style={styles.avgLabel}>Average ride time</Text>
            </View>
          </View>
        </View>

        {/* GAINS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Gains</Text>

          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tabBtn, tab === "weekly" && styles.tabBtnActive]}
              onPress={() => setTab("weekly")}
            >
              <Text style={[styles.tabText, tab === "weekly" && styles.tabTextActive]}>Weekly</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, tab === "monthly" && styles.tabBtnActive]}
              onPress={() => setTab("monthly")}
            >
              <Text style={[styles.tabText, tab === "monthly" && styles.tabTextActive]}>Monthly</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gainsGrid}>
            <View style={styles.gainCard}>
              <Text style={styles.gainLabel}>Earnings</Text>
              <Text style={styles.gainValue}>{g.earnings}</Text>
              <Text style={styles.gainTrend}>{g.trend}</Text>
            </View>
            <View style={styles.gainCard}>
              <Text style={styles.gainLabel}>Rides done</Text>
              <Text style={styles.gainValue}>{g.rides}</Text>
            </View>
            <View style={styles.gainCard}>
              <Text style={styles.gainLabel}>Avg per ride</Text>
              <Text style={styles.gainValue}>{g.avgPerRide}</Text>
            </View>
            <View style={styles.gainCard}>
              <Text style={styles.gainLabel}>{tab === "weekly" ? "Peak day" : "Best week"}</Text>
              <Text style={styles.gainValue}>{g.peak}</Text>
              <Text style={styles.gainTrend}>{g.peakAmount}</Text>
            </View>
          </View>

          <View style={styles.breakdownCard}>
            <Text style={styles.breakdownTitle}>By vehicle type</Text>
            {g.breakdown.map((item, i) => (
              <View key={i} style={styles.barRow}>
                <View style={[styles.dot, { backgroundColor: item.color }]} />
                <Text style={styles.barLabel}>{item.label}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${item.pct}%`, backgroundColor: item.color }]} />
                </View>
                <Text style={styles.barAmount}>{item.amount}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* HISTORY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Rides</Text>
          {rideHistory.map((ride, index) => (
            <View key={index} style={styles.rideCard}>
              <View style={styles.leftRide}>
                <View style={styles.vehicleIcon}>
                  <Text>🚕</Text>
                </View>
                <View>
                  <Text style={styles.route}>{ride.from} → {ride.to}</Text>
                  <Text style={styles.vehicleText}>{ride.vehicle}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: ride.status === "Completed" ? "#DFF7E2" : "#FFE3E3" }]}>
                    <Text style={{ fontSize: 12, color: ride.status === "Completed" ? "green" : "red" }}>
                      {ride.status}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.distance}>{ride.distance}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },

  topBand: {
    paddingTop: 14, paddingBottom: 20, paddingHorizontal: 16,
    minHeight: 180, borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },

  title: { color: "#fff", fontSize: 24, fontWeight: "700", marginTop: 25 },

  cardRow: { flexDirection: "row", marginTop: 25, justifyContent: "space-between" },

  infoCard: {
    width: "48%", backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14,
  },

  infoValue: { color: "#fff", fontSize: 20, fontWeight: "700" },
  infoLabel: { color: "#EAFBFD", marginTop: 3, fontSize: 11 },

  section: { paddingHorizontal: 16, paddingTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "900", marginBottom: 14 },

  graphContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  graphItem: { alignItems: "center" },
  graphValue: { marginBottom: 6, color: "#555" },
  bar: { width: 28, borderRadius: 10 },
  dayText: { marginTop: 8, color: "#777", fontSize: 12 },

  avgCard: {
    marginTop: 18, backgroundColor: "#EAF9F0", borderRadius: 14,
    paddingVertical: 10, paddingHorizontal: 12,
    flexDirection: "row", alignItems: "center",
  },
  iconBox: { width: 34, height: 34, borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: 10 },
  avgTime: { fontSize: 16, fontWeight: "700" },
  avgLabel: { color: "#666", marginTop: 1, fontSize: 11 },

  // gains
  tabRow: {
    flexDirection: "row", backgroundColor: "#E8EDF5",
    borderRadius: 12, padding: 3, marginBottom: 14,
  },
  tabBtn: { flex: 1, alignItems: "center", paddingVertical: 7, borderRadius: 10 },
  tabBtnActive: { backgroundColor: "#fff" },
  tabText: { fontSize: 13, fontWeight: "600", color: "#777" },
  tabTextActive: { color: "#1270B8" },

  gainsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 12 },
  gainCard: { width: "48%", backgroundColor: "#fff", borderRadius: 16, padding: 14 },
  gainLabel: { fontSize: 11, color: "#888", marginBottom: 4 },
  gainValue: { fontSize: 19, fontWeight: "700", color: "#111" },
  gainTrend: { fontSize: 11, color: "#1270B8", marginTop: 3, fontWeight: "600" },

  breakdownCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 4 },
  breakdownTitle: { fontSize: 13, fontWeight: "700", color: "#111", marginBottom: 12 },
  barRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  barLabel: { fontSize: 12, color: "#555", width: 38 },
  barTrack: { flex: 1, backgroundColor: "#EEF0F5", borderRadius: 6, height: 7 },
  barFill: { height: 7, borderRadius: 6 },
  barAmount: { fontSize: 12, fontWeight: "700", color: "#111", width: 50, textAlign: "right" },

  rideCard: {
    backgroundColor: "#fff", borderRadius: 18, padding: 18, marginBottom: 10,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  leftRide: { flexDirection: "row", alignItems: "center" },
  vehicleIcon: {
    width: 50, height: 50, borderRadius: 15, backgroundColor: "#EEF4FF",
    justifyContent: "center", alignItems: "center", marginRight: 12,
  },
  route: { fontWeight: "600", fontSize: 13 },
  vehicleText: { color: "#777", marginTop: 2, fontSize: 11 },
  statusBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginTop: 6 },
  distance: { fontWeight: "600", color: "#444", fontSize: 12 },
});
