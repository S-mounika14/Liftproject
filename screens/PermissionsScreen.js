

import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    ScrollView, Modal
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const CONDITIONS = [
    { id: 1, text: 'I agree that Lift may collect my location during active rides for safety and navigation.' },
    { id: 2, text: 'I agree that my phone number will be used to verify my identity and enable in-app calls.' },
    { id: 3, text: 'I agree that Lift may send me ride updates and notifications via SMS and push notifications.' },
    { id: 4, text: 'I understand that my contact list and messages remain on my device and are never shared with Lift.' },
    { id: 5, text: 'I am 18 years or older and agree to the Terms of Service and Privacy Policy of Lift.' },
];

export default function PermissionsScreen({ visible, onContinue }) {
    const [page, setPage] = useState(0);
    const [checked, setChecked] = useState({});
    const allChecked = CONDITIONS.every(c => checked[c.id]);

    function toggle(id) {
        setChecked(prev => ({ ...prev, [id]: !prev[id] }));
    }

    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
            <View style={styles.overlay}>
                <View style={styles.box}>

                    {page === 0 ? (
                        <>
                            <Text style={styles.title}>Permissions & your data</Text>
                            <Text style={styles.subtitle}>
                                To enable Lift features like ride tracking and safety, we request certain permissions.
                            </Text>

                            <ScrollView showsVerticalScrollIndicator style={styles.scroll}>

                                <View style={styles.permRow}>
                                    <MaterialIcons name="phone" size={24} color="#1270B8" />
                                    <View style={styles.permText}>
                                        <Text style={styles.permTitle}>Phone Calls</Text>
                                        <Text style={styles.permDesc}>To verify your number and enable in-app calls with your contributor.</Text>
                                    </View>
                                </View>

                                <View style={styles.permRow}>
                                    <MaterialIcons name="contacts" size={24} color="#1270B8" />
                                    <View style={styles.permText}>
                                        <Text style={styles.permTitle}>Contacts</Text>
                                        <Text style={styles.permDesc}>To show you when a contributor is nearby. <Text style={styles.permBold}>Your contact list stays on your phone and is not shared with Lift.</Text></Text>
                                    </View>
                                </View>

                                <View style={styles.permRow}>
                                    <MaterialIcons name="assignment" size={24} color="#1270B8" />
                                    <View style={styles.permText}>
                                        <Text style={styles.permTitle}>Call Logs</Text>
                                        <Text style={styles.permDesc}>To help track ride-related calls in your history.</Text>
                                    </View>
                                </View>

                                <View style={styles.permRow}>
                                    <MaterialIcons name="sms" size={24} color="#1270B8" />
                                    <View style={styles.permText}>
                                        <Text style={styles.permTitle}>SMS</Text>
                                        <Text style={styles.permDesc}>To auto-read OTP for seamless login. <Text style={styles.permBold}>Your messages remain on your device and are not shared with Lift.</Text></Text>
                                    </View>
                                </View>

                                <View style={styles.permRow}>
                                    <Ionicons name="notifications" size={24} color="#1270B8" />
                                    <View style={styles.permText}>
                                        <Text style={styles.permTitle}>Notifications</Text>
                                        <Text style={styles.permDesc}>To send you ride updates and alerts in real time.</Text>
                                    </View>
                                </View>

                                <View style={styles.permRow}>
                                    <MaterialIcons name="location-on" size={24} color="#1270B8" />
                                    <View style={styles.permText}>
                                        <Text style={styles.permTitle}>Location</Text>
                                        <Text style={styles.permDesc}>To match you with nearby contributors. <Text style={styles.permBold}>Location is only used during active rides.</Text></Text>
                                    </View>
                                </View>

                            </ScrollView>

                            <Text style={styles.termsText}>
                                By tapping Continue you agree to our{' '}
                                <Text style={styles.link} onPress={() => setPage(1)}>Terms of Service</Text>
                                {' '}and{' '}
                                <Text style={styles.link} onPress={() => setPage(1)}>Privacy Policy</Text>.
                            </Text>

                            <TouchableOpacity
                                onPress={allChecked ? onContinue : null}
                                activeOpacity={allChecked ? 0.7 : 1}
                            >
                                <Text style={[styles.continueBtn, !allChecked && styles.continueBtnDisabled]}>
                                    CONTINUE
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={styles.title}>Terms & Conditions</Text>
                            <Text style={styles.subtitle}>Please read and accept all conditions.</Text>

                            <ScrollView showsVerticalScrollIndicator style={styles.scroll}>
                                {CONDITIONS.map(item => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={styles.checkRow}
                                        onPress={() => toggle(item.id)}
                                        activeOpacity={0.7}
                                    >
                                        <MaterialIcons
                                            name={checked[item.id] ? 'check-box' : 'check-box-outline-blank'}
                                            size={22}
                                            color={checked[item.id] ? '#0C7A54' : '#aaa'}
                                        />
                                        <Text style={styles.checkText}>{item.text}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <TouchableOpacity
                                style={[styles.agreeBtn, !allChecked && styles.agreeBtnDisabled]}
                                onPress={allChecked ? () => setPage(0) : null}
                                activeOpacity={allChecked ? 0.8 : 1}
                            >
                                <Text style={styles.agreeBtnText}>I Agree</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {/* Dots */}
                    <View style={styles.dotsRow}>
                        <View style={[styles.dot, page === 0 && styles.dotActive]} />
                        <View style={[styles.dot, page === 1 && styles.dotActive]} />
                    </View>

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay:
    {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    box:
    {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 22,
        width: '88%',
        maxHeight: '82%'
    },

    title:
    {
        fontSize: 20,
        fontWeight: '700',
        color: '#111',
        marginBottom: 6
    },
    subtitle:
    {
        fontSize: 13,
        color: '#555',
        marginBottom: 14

    },
    scroll:
    {
        maxHeight: 320
    },

    permRow:
    {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 18,
        gap: 12
    },
    permText:
    {
        flex: 1
    },
    permTitle:
    {
        fontSize: 15,
        fontWeight: '700',
        color: '#111',
        marginBottom: 3
    },
    permDesc:
    {
        fontSize: 13,
        color: '#444',
        lineHeight: 19
    },
    permBold:
    {
        fontWeight: '700',
        color: '#111'
    },

    termsText:
    {
        fontSize: 11,
        color: '#666',
        marginTop: 14,
        lineHeight: 17
    },
    link:
    {
        color: '#1270B8',
        fontWeight: '600',
        textDecorationLine: 'underline'
    },
    continueBtn:
    {
        color: '#1270B8',
        fontWeight: '700',
        fontSize: 15,
        textAlign: 'right',
        marginTop: 14
    },
    continueBtnDisabled:
    {
        color: '#aaa'
    },

    checkRow:
    {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
        gap: 10
    },
    checkText:
    {
        flex: 1,
        fontSize: 13,
        color: '#333',
        lineHeight: 20
    },

    agreeBtn:
    {
        backgroundColor: '#0C7A54',
        borderRadius: 10,
        paddingVertical: 13,
        alignItems: 'center',
        marginTop: 16
    },
    agreeBtnDisabled:
    {
        backgroundColor: '#aaa'

    },
    agreeBtnText:
    {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15
    },

    dotsRow:
    {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 14,
        gap: 6


    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ddd'
    },
    dotActive:
    {
        backgroundColor: '#1270B8',
        width: 20
    },
});
