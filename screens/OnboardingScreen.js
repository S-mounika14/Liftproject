import React, { useRef, useState, useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';


import {
    View,
    Image,
    Animated,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const ITEM_WIDTH = width;
const SPACING = 0;

const screens = [
    {
        id: '1',
        image: require('../assets/a1.jpg'),
    },

    {
        id: '2',
        image: require('../assets/a2.jpg'),
    },

    {
        id: '3',
        image: require('../assets/a3.jpg'),
    },

    {
        id: '4',
        image: require('../assets/a4.jpg'),
    },
    {
        id: '5',
        image: require('../assets/a5.jpg'),
    },
];

export default function OnboardingScreen({ navigation }) {

    const [currentIndex, setCurrentIndex] = useState(0);

    const flatListRef = useRef();

    const scrollX = useRef(new Animated.Value(0)).current;

    const handleNext = async () => {

        if (currentIndex < screens.length - 1) {

            flatListRef.current.scrollToOffset({
                offset: (currentIndex + 1) * (ITEM_WIDTH + SPACING),
                animated: true,
            });

        } else {

            await AsyncStorage.setItem('onboardingDone', 'true');

            navigation.replace('JoinAs');
        }
    };

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync('#ffffff');
        NavigationBar.setButtonStyleAsync('dark');
    }, []);

    return (

        <View style={styles.container}>

            <Animated.FlatList
                ref={flatListRef}
                data={screens}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={ITEM_WIDTH + SPACING}
                decelerationRate="normal"
                bounces={false}

                // contentContainerStyle={{
                //     paddingHorizontal: (width - ITEM_WIDTH - SPACING) / 2,
                // }}

                keyExtractor={(item) => item.id}

                onMomentumScrollEnd={(event) => {

                    const index = Math.round(
                        event.nativeEvent.contentOffset.x /
                        (ITEM_WIDTH + SPACING)
                    );

                    setCurrentIndex(index);
                }}

                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                contentOffset: {
                                    x: scrollX,
                                },
                            },
                        },
                    ],
                    { useNativeDriver: true }
                )}

                scrollEventThrottle={16}

                renderItem={({ item, index }) => {

                    const inputRange = [
                        (index - 1) * (ITEM_WIDTH + SPACING),
                        index * (ITEM_WIDTH + SPACING),
                        (index + 1) * (ITEM_WIDTH + SPACING),
                    ];

                    const scale = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.88, 1, 0.88],
                        extrapolate: 'clamp',
                    });

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.5, 1, 0.5],
                        extrapolate: 'clamp',
                    });

                    return (

                        <Animated.View
                            style={[
                                styles.card,
                                {
                                    transform: [{ scale }],
                                    opacity,
                                },
                            ]}
                        >

                            <Image
                                source={item.image}
                                style={styles.image}
                            />

                        </Animated.View>
                    );
                }}
            />

            <View style={styles.bottomContainer}>

                <View style={styles.dotsContainer}>

                    {screens.map((item, index) => (

                        <View
                            key={item.id}
                            style={[
                                styles.dot,
                                currentIndex === index && styles.activeDot,
                            ]}
                        />

                    ))}

                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleNext}
                >

                    <Text style={styles.buttonText}>

                        {currentIndex === screens.length - 1
                            ? 'Get Started'
                            : 'Next'}

                    </Text>

                </TouchableOpacity>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F5F7FB',
        justifyContent: 'center',
    },

    card: {
    width: ITEM_WIDTH,
    height: height * 0.88,
    borderRadius: 40,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,

},

    image: {
        width: '90%',
        height: '90%',
        resizeMode: 'contain',
        borderRadius: 40,

    },

    bottomContainer: {
        position: 'absolute',
        bottom: 70,
        width: '100%',
        alignItems: 'center',
    },

    dotsContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 10,
        backgroundColor: '#ccc',
        marginHorizontal: 4,
    },

    activeDot: {
        width: 24,
        backgroundColor: '#2a3f8f',
    },

    button: {
        backgroundColor: '#1b2a6b',
        width: '34%',
        paddingVertical: 15,
        borderRadius: 18,
        alignItems: 'center',
    },

    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

});