import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Animated,
    Dimensions,
    Image,
    Alert,
    ActivityIndicator,
    Linking
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import api from '../Components/api/config';

const { width, height } = Dimensions.get('window');

export default function PaymentGateway() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { schemeId, amount, name, monthIndex, type } = params;

    const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed
    const [progress] = useState(new Animated.Value(0));

    const handleProcessPayment = async () => {
        // --- CONFIGURE YOUR MERCHANT DETAILS HERE ---
        const upiId = "3beecrackers@upi"; // Change this to your real UPI ID
        const merchantName = "3BEE CRACKER";
        const transactionRef = `CHIT-${Date.now()}`;

        // Generate UPI deep link (Standard format for GPay, PhonePe, Paytm)
        const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tr=${transactionRef}`;

        try {
            const canOpen = await Linking.canOpenURL(upiUrl);

            if (canOpen) {
                // This will trigger the Mobile Payment Apps on a real phone
                await Linking.openURL(upiUrl);

                // After the user returns to the app, we ask for confirmation 
                // because UPI deep links don't return success status automatically.
                Alert.alert(
                    'Confirm Payment Status',
                    'Please confirm if your payment was successful in your UPI app.',
                    [
                        {
                            text: 'Payment Failed',
                            onPress: () => setPaymentStatus('failed'),
                            style: 'cancel'
                        },
                        {
                            text: 'Yes, I Paid Successfully',
                            onPress: async () => {
                                setPaymentStatus('processing');
                                try {
                                    const res = await api.post('/chit/pay', {
                                        schemeId,
                                        amount: parseFloat(amount),
                                        monthIndex: parseInt(monthIndex)
                                    });
                                    if (res.data.success) {
                                        setPaymentStatus('success');
                                    } else {
                                        setPaymentStatus('failed');
                                    }
                                } catch (e) {
                                    setPaymentStatus('failed');
                                    Alert.alert('Verification Error', 'We could not record your payment. Please contact admin.');
                                }
                            }
                        }
                    ]
                );
            } else {
                Alert.alert(
                    'No UPI App Available',
                    'We couldn\'t find GPay, PhonePe, or Paytm on this device. For testing, would you like to mock a successful payment?',
                    [
                        { text: 'Go Back', onPress: () => setPaymentStatus('failed'), style: 'cancel' },
                        {
                            text: 'Mock Success (Debug)',
                            onPress: async () => {
                                setPaymentStatus('processing');
                                try {
                                    const res = await api.post('/chit/pay', {
                                        schemeId,
                                        amount: parseFloat(amount),
                                        monthIndex: parseInt(monthIndex)
                                    });
                                    setPaymentStatus(res.data.success ? 'success' : 'failed');
                                } catch (e) {
                                    setPaymentStatus('failed');
                                }
                            }
                        }
                    ]
                );
            }
        } catch (error) {
            console.error('Linking error:', error);
            setPaymentStatus('failed');
        }
    };

    if (paymentStatus === 'success') {
        return (
            <View style={styles.resultContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <LottieView
                    source={require('../assets/images/Fireworks Teal and Red.json')}
                    autoPlay
                    loop
                    style={styles.lottie}
                />
                <View style={styles.successIconContainer}>
                    <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
                </View>
                <Text style={styles.successTitle}>Payment Successful!</Text>
                <Text style={styles.successSubtitle}>
                    You have successfully {type === 'join' ? 'joined' : 'paid for'} {name}.
                </Text>
                <View style={styles.detailsCard}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Amount Paid</Text>
                        <Text style={styles.detailValue}>₹{amount}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Transaction ID</Text>
                        <Text style={styles.detailValue}>TXN{Math.floor(Math.random() * 900000) + 100000}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.doneButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (paymentStatus === 'processing') {
        return (
            <View style={styles.processingContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <ActivityIndicator size="large" color="#ff7f00" />
                <Text style={styles.processingText}>Processing Secure Payment...</Text>
                <Text style={styles.processingSubtext}>Please do not close the app or go back.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#ff7f00" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SECURE PAYMENT</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.content}>
                {/* Amount Section */}
                <View style={styles.amountCard}>
                    <Text style={styles.payingTo}>Paying to 3BEE CRACKER</Text>
                    <Text style={styles.schemeName}>{name}</Text>
                    <View style={styles.amountRow}>
                        <Text style={styles.currency}>₹</Text>
                        <Text style={styles.amountText}>{amount}</Text>
                    </View>
                </View>

                {/* Payment Options Simulation */}
                <Text style={styles.sectionTitle}>Choose Payment Method</Text>

                <View style={styles.paymentMethods}>
                    <View style={styles.methodItem}>
                        <Image
                            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_Pay_Logo.svg/2560px-Google_Pay_Logo.svg.png' }}
                            style={styles.methodLogo}
                            resizeMode="contain"
                        />
                        <Text style={styles.methodName}>Google Pay</Text>
                        <View style={styles.radioActive} />
                    </View>

                    <View style={[styles.methodItem, { opacity: 0.6 }]}>
                        <Image
                            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/2560px-Paytm_Logo_%28standalone%29.svg.png' }}
                            style={styles.methodLogo}
                            resizeMode="contain"
                        />
                        <Text style={styles.methodName}>Paytm</Text>
                        <View style={styles.radioInactive} />
                    </View>

                    <View style={[styles.methodItem, { opacity: 0.6 }]}>
                        <Image
                            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo.png/1200px-UPI-Logo.png' }}
                            style={styles.methodLogo}
                            resizeMode="contain"
                        />
                        <Text style={styles.methodName}>PhonePe / Other UPI</Text>
                        <View style={styles.radioInactive} />
                    </View>
                </View>

                <View style={styles.securityInfo}>
                    <MaterialCommunityIcons name="shield-check" size={20} color="#4CAF50" />
                    <Text style={styles.securityText}>100% Safe & Secure Encryption</Text>
                </View>
            </View>

            {/* Bottom Pay Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.payButton}
                    onPress={handleProcessPayment}
                >
                    <Text style={styles.payButtonText}>PAY ₹{amount} SECURELY</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: '#ff7f00',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        paddingTop: 10,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    amountCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 30,
    },
    payingTo: {
        color: '#666',
        fontSize: 14,
        marginBottom: 4,
    },
    schemeName: {
        color: '#333',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    currency: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 8,
        marginRight: 2,
    },
    amountText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#333',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    paymentMethods: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
    },
    methodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    methodLogo: {
        width: 40,
        height: 25,
        marginRight: 16,
    },
    methodName: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    radioActive: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 6,
        borderColor: '#ff7f00',
    },
    radioInactive: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    securityInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    securityText: {
        fontSize: 12,
        color: '#4CAF50',
        marginLeft: 6,
        fontWeight: '600'
    },
    footer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    payButton: {
        backgroundColor: '#ff7f00',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    payButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    processingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    processingText: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    processingSubtext: {
        marginTop: 8,
        fontSize: 14,
        color: '#666',
    },
    resultContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    lottie: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    successIconContainer: {
        marginBottom: 20,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    successSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    detailsCard: {
        width: '100%',
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        padding: 20,
        marginBottom: 40,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    doneButton: {
        backgroundColor: '#ff7f00',
        paddingHorizontal: 40,
        paddingVertical: 14,
        borderRadius: 12,
    },
    doneButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

