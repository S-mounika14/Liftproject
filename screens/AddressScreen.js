import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TextInput,
    Alert
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddressScreen() {

    const [activeTab, setActiveTab] = useState('home');
    const [editing, setEditing] = useState(null);

    const [homeAddress, setHomeAddress] = useState('');
    const [workAddress, setWorkAddress] = useState('');
    const [otherAddress, setOtherAddress] = useState('');
    const [otherLabel, setOtherLabel] = useState('');

    const [tempAddress, setTempAddress] = useState('');
    const [tempLabel, setTempLabel] = useState('');

    useEffect(() => {
        loadAddresses();
    }, []);

    async function loadAddresses() {

        try {

            const home = await AsyncStorage.getItem('address_home');
            const work = await AsyncStorage.getItem('address_work');
            const other = await AsyncStorage.getItem('address_other');
            const otherName = await AsyncStorage.getItem('address_other_label');

            if (home) {
                setHomeAddress(home);
            }

            if (work) {
                setWorkAddress(work);
            }

            if (other) {
                setOtherAddress(other);
            }

            if (otherName) {
                setOtherLabel(otherName);
            }

        } catch (error) {
            console.log('Error loading addresses:', error);
        }
    }

    function handleEdit(type) {

        setEditing(type);

        if (type === 'home') {
            setTempAddress(homeAddress);
        }

        if (type === 'work') {
            setTempAddress(workAddress);
        }

        if (type === 'other') {
            setTempAddress(otherAddress);
            setTempLabel(otherLabel);
        }
    }

    async function handleSave() {

        if (!tempAddress.trim()) {
            Alert.alert('Required', 'Please enter an address');
            return;
        }

        try {

            if (editing === 'home') {

                await AsyncStorage.setItem('address_home', tempAddress);

                setHomeAddress(tempAddress);
            }

            if (editing === 'work') {

                await AsyncStorage.setItem('address_work', tempAddress);

                setWorkAddress(tempAddress);
            }

            if (editing === 'other') {

                await AsyncStorage.setItem('address_other', tempAddress);

                await AsyncStorage.setItem(
                    'address_other_label',
                    tempLabel || 'Other'
                );

                setOtherAddress(tempAddress);

                setOtherLabel(tempLabel || 'Other');
            }

            setEditing(null);
            setTempAddress('');
            setTempLabel('');

        } catch (error) {
            console.log('Error saving address:', error);
        }
    }

    async function handleDelete(type) {

        Alert.alert(
            'Delete',
            'Remove this address?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',

                    onPress: async () => {

                        if (type === 'home') {

                            await AsyncStorage.removeItem('address_home');

                            setHomeAddress('');
                        }

                        if (type === 'work') {

                            await AsyncStorage.removeItem('address_work');

                            setWorkAddress('');
                        }

                        if (type === 'other') {

                            await AsyncStorage.removeItem('address_other');

                            await AsyncStorage.removeItem('address_other_label');

                            setOtherAddress('');
                            setOtherLabel('');
                        }
                    }
                }
            ]
        );
    }

    const tabs = [
        {
            key: 'home',
            label: 'Home',
            icon: 'home-outline',
            activeIcon: 'home'
        },
        {
            key: 'work',
            label: 'Work',
            icon: 'briefcase-outline',
            activeIcon: 'briefcase'
        },
        {
            key: 'other',
            label: 'Other',
            icon: 'location-outline',
            activeIcon: 'location'
        }
    ];

    let currentAddress = '';

    if (activeTab === 'home') {
        currentAddress = homeAddress;
    }

    if (activeTab === 'work') {
        currentAddress = workAddress;
    }

    if (activeTab === 'other') {
        currentAddress = otherAddress;
    }

    let iconName = 'location';
    let title = 'Other';

    if (activeTab === 'home') {
        iconName = 'home';
        title = 'Home';
    }

    if (activeTab === 'work') {
        iconName = 'briefcase';
        title = 'Work';
    }

    if (activeTab === 'other') {
        title = otherLabel || 'Other';
    }

    return (

        <View style={styles.container}>

            <LinearGradient
                colors={['#1B2A6B', '#2A3F8F', '#1B2A6B']}

                style={styles.header}
            >
                <Text style={styles.headerTitle}>
                    Saved Addresses
                </Text>
            </LinearGradient>

            <View style={styles.tabBar}>

                {tabs.map((tab) => (

                    <TouchableOpacity
                        key={tab.key}
                        style={[
                            styles.tab,
                            activeTab === tab.key && styles.tabActive
                        ]}
                        onPress={() => {
                            setActiveTab(tab.key);
                            setEditing(null);
                        }}
                    >

                        <Ionicons
                            name={
                                activeTab === tab.key
                                    ? tab.activeIcon
                                    : tab.icon
                            }
                            size={18}
                            color={
                                activeTab === tab.key
                                    ? '#1b2a6b'
                                    : '#aaa'
                            }
                        />

                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab.key &&
                                styles.tabTextActive
                            ]}
                        >
                            {tab.label}
                        </Text>

                    </TouchableOpacity>

                ))}

            </View>

            <ScrollView
                style={styles.body}
                showsVerticalScrollIndicator={false}
            >

                {currentAddress !== '' && editing === null ? (

                    <View style={styles.addressCard}>

                        <View style={styles.addressIconBox}>

                            <Ionicons
                                name={iconName}
                                size={22}
                                color="#1b2a6b"
                            />

                        </View>

                        <View style={styles.addressInfo}>

                            <Text style={styles.addressLabel}>
                                {title}
                            </Text>

                            <Text style={styles.addressText}>
                                {currentAddress}
                            </Text>

                        </View>

                        <View style={styles.addressActions}>

                            <TouchableOpacity
                                style={styles.editBtn}
                                onPress={() => handleEdit(activeTab)}
                            >

                                <Ionicons
                                    name="pencil-outline"
                                    size={16}
                                    color="#2a3f8f"
                                />

                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() => handleDelete(activeTab)}
                            >

                                <Ionicons
                                    name="trash-outline"
                                    size={16}
                                    color="#FF4D4D"
                                />

                            </TouchableOpacity>

                        </View>

                    </View>

                ) : editing === null ? (

                    <View style={styles.emptyBox}>

                        <View style={styles.emptyIconCircle}>

                            <Ionicons
                                name={
                                    activeTab === 'home'
                                        ? 'home-outline'
                                        : activeTab === 'work'
                                            ? 'briefcase-outline'
                                            : 'location-outline'
                                }
                                size={36}
                                color="#1b2a6b"
                            />

                        </View>

                        <Text style={styles.emptyTitle}>
                            No {activeTab} address saved
                        </Text>

                        <Text style={styles.emptySub}>
                            Add your {activeTab} address
                        </Text>

                    </View>

                ) : null}

                {editing === activeTab && (

                    <View style={styles.formCard}>

                        <Text style={styles.formTitle}>
                            {currentAddress ? 'Edit' : 'Add'} {title} Address
                        </Text>

                        {activeTab === 'other' && (
                            <>

                                <Text style={styles.inputLabel}>
                                    Label
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter label"
                                    value={tempLabel}
                                    onChangeText={setTempLabel}
                                />

                            </>
                        )}

                        <Text style={styles.inputLabel}>
                            Full Address
                        </Text>

                        <TextInput
                            style={[styles.input, styles.inputMulti]}
                            placeholder={`Enter your ${activeTab} address`}
                            value={tempAddress}
                            onChangeText={setTempAddress}
                            multiline
                            numberOfLines={3}
                        />

                        <View style={styles.formBtns}>

                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => {
                                    setEditing(null);
                                    setTempAddress('');
                                    setTempLabel('');
                                }}
                            >

                                <Text style={styles.cancelBtnText}>
                                    Cancel
                                </Text>

                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.saveBtn}
                                onPress={handleSave}
                            >

                                <LinearGradient
                                    colors={['#1b2a6b', '#1270B8']}
                                    style={styles.saveBtnGrad}
                                >

                                    <Text style={styles.saveBtnText}>
                                        Save Address
                                    </Text>

                                </LinearGradient>

                            </TouchableOpacity>

                        </View>

                    </View>

                )}

                {currentAddress === '' && editing === null && (

                    <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => handleEdit(activeTab)}
                    >

                        <LinearGradient
                            colors={['#1b2a6b', '#1270B8']}
                            style={styles.addBtnGrad}
                        >

                            <Ionicons
                                name="add"
                                size={20}
                                color="#fff"
                            />

                            <Text style={styles.addBtnText}>
                                Add {title} Address
                            </Text>

                        </LinearGradient>

                    </TouchableOpacity>

                )}

                <View style={styles.tipBox}>

                    <Ionicons
                        name="bulb-outline"
                        size={16}
                        color="#1270B8"
                    />

                    <Text style={styles.tipText}>
                        Saved addresses appear as quick picks
                        when booking a ride
                    </Text>

                </View>

            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F5FAF7'
    },

    header: {
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 34,
        borderBottomRightRadius: 34,
        overflow: 'hidden',
    },

    headerTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
        letterSpacing: 0.5,
    },

    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 14,
        padding: 4,
        elevation: 2,
    },

    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
    },

    tabActive: {
        backgroundColor: '#EAF2FF',
    },

    tabText: {
        fontSize: 13,
        color: '#aaa',
        fontWeight: '500',
        marginLeft: 5,
    },

    tabTextActive: {
        color: '#1270B8',
        fontWeight: '700',
    },

    body: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },

    addressCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#1270B8',
    },

    addressIconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EEF4FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    addressInfo: {
        flex: 1,
    },

    addressLabel: {
        fontSize: 11,
        color: '#1270B8',
        fontWeight: '700',
        marginBottom: 3,
    },

    addressText: {
        fontSize: 13,
        color: '#1A2E25',
        lineHeight: 18,
    },

    addressActions: {
        justifyContent: 'space-between',
    },

    editBtn: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#EBF9F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },

    deleteBtn: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#FFF0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },

    emptyBox: {
        alignItems: 'center',
        paddingVertical: 40,
    },

    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EBF9F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },

    emptyTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A2E25',
        marginBottom: 6,
    },

    emptySub: {
        fontSize: 12,
        color: '#7A9490',
        textAlign: 'center',
    },

    formCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        elevation: 2,
        marginBottom: 12,
    },

    formTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A2E25',
        marginBottom: 14,
    },

    inputLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#7A9490',
        marginBottom: 5,
        marginTop: 8,
    },

    input: {
        backgroundColor: '#F8FAFF',
        borderWidth: 1,
        borderColor: '#D4EBE2',
        borderRadius: 10,
        padding: 11,
        fontSize: 13,
        color: '#1A2E25',
    },

    inputMulti: {
        height: 80,
        textAlignVertical: 'top',
    },

    formBtns: {
        flexDirection: 'row',
        marginTop: 16,
    },

    cancelBtn: {
        flex: 1,
        padding: 13,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D4EBE2',
        alignItems: 'center',
        marginRight: 10,
    },

    cancelBtnText: {
        color: '#7A9490',
        fontWeight: '600',
        fontSize: 13,
    },

    saveBtn: {
        flex: 2,
        borderRadius: 10,
        overflow: 'hidden',
    },

    saveBtnGrad: {
        padding: 13,
        alignItems: 'center',
    },

    saveBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 13,
    },

    addBtn: {
        borderRadius: 14,
        overflow: 'hidden',
        marginTop: 8,
        marginBottom: 12,
    },

    addBtnGrad: {
        flexDirection: 'row',
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },

    addBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
        marginLeft: 8,
    },

    tipBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EEF4FF',
        borderRadius: 10,
        padding: 12,
        marginBottom: 30,
    },

    tipText: {
        flex: 1,
        fontSize: 12,
        color: '#1270B8',
        lineHeight: 17,
        marginLeft: 8,
    },

});

