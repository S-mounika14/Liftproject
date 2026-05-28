import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HistoryScreen() {
    return (
        <View style={styles.center}>
            <Text style={styles.text}>Ride History </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 20, fontWeight: '700', color: '#0C7A54' },
});
