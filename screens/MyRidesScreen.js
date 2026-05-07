import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function MyRidesScreen({ route }) {

  const rides = route.params?.newRide
    ? [route.params.newRide]
    : [];

  return (
    <View style={styles.container}>


      {rides.length === 0 ? (
        <Text style={styles.empty}>No rides yet</Text>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              
              <Text style={styles.route}>
                {item.from} → {item.to}
              </Text>

              <Text style={styles.info}>
                Vehicle: {item.vehicle}
              </Text>

              <Text style={styles.status}>
                Status: Active
              </Text>

            </View>
          )}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5FAF7',
    marginTop:40,
    padding: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0C7A54',
    marginBottom: 10,
  },

  empty: {
    textAlign: 'center',
    marginTop: 300,
    justifyContent:'center',
    color: 'gray',
  },

  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#D4EBE2',
    marginBottom: 10,
  },

  route: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A2E25',
  },

  info: {
    fontSize: 12,
    color: '#7A9490',
    marginTop: 5,
  },

  status: {
    marginTop: 5,
    color: '#0C7A54',
    fontWeight: '600',
  },

});