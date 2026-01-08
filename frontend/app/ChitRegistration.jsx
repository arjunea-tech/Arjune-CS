import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Alert,
    ActivityIndicator,
    TextInput
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../Components/utils/AuthContext';
import { chitAPI } from '../Components/api';

export default function ChitRegistration() {
    const router = useRouter();
    const { user } = useAuth();
    const params = useLocalSearchParams();
    const { schemeId, schemeName, amount } = params;

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [mobile, setMobile] = useState(user?.mobileNumber || '');
    const [address, setAddress] = useState(
        user ? `${user.address}${user.district ? ', ' + user.district : ''}${user.state ? ', ' + user.state : ''}${user.pincode ? ' - ' + user.pincode : ''}` : ''
    );

    const handleJoinRequest = async () => {
        if (!name || !mobile || !address) {
            Alert.alert("Error", "Please fill in all details.");
            return;
        }

        try {
            setLoading(true);
            const res = await chitAPI.requestJoin({
                schemeId,
                name,
                mobileNumber: mobile,
                address
            });

            if (res.success) {
                Alert.alert(
                    "Joined Successfully! 🎊",
                    `Congratulations! You have been enrolled in "${schemeName}". You can now track your installments in the "My Schemes" tab.`,
                    [{ text: "OK", onPress: () => router.replace('/(tabs)/Chit') }]
                );
            }
        } catch (error) {
            console.error('Join request error:', error);
            Alert.alert("Error", error.message || "Failed to send join request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#ff7f00" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>CHIT REGISTRATION</Text>
                <View style={{ width: 26 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Scheme Details</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Scheme Name:</Text>
                        <Text style={styles.value}>{schemeName}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Monthly Installment:</Text>
                        <Text style={styles.value}>₹{amount}</Text>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Participant Details</Text>

                    <View style={styles.inputBox}>
                        <Text style={styles.inputLabel}>Full Name</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="#888" />
                            <TextInput
                                style={styles.textInput}
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your full name"
                            />
                        </View>
                    </View>

                    <View style={styles.inputBox}>
                        <Text style={styles.inputLabel}>Mobile Number</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="call-outline" size={20} color="#888" />
                            <TextInput
                                style={styles.textInput}
                                value={mobile}
                                onChangeText={setMobile}
                                placeholder="Enter mobile number"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.inputBox}>
                        <Text style={styles.inputLabel}>Full Address</Text>
                        <View style={[styles.inputContainer, { alignItems: 'flex-start', minHeight: 100 }]}>
                            <Ionicons name="location-outline" size={20} color="#888" style={{ marginTop: 12 }} />
                            <TextInput
                                style={[styles.textInput, { multiLine: true, textAlignVertical: 'top', paddingTop: 10 }]}
                                value={address}
                                onChangeText={setAddress}
                                placeholder="Enter your complete address"
                                multiline={true}
                                numberOfLines={4}
                            />
                        </View>
                    </View>

                    <Text style={styles.note}>
                        Note: You can update these details specifically for this chit enrollment.
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.joinBtn, loading && { opacity: 0.7 }]}
                    onPress={handleJoinRequest}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <MaterialCommunityIcons name="send-check" size={24} color="#fff" />
                            <Text style={styles.joinBtnText}>SEND JOIN REQUEST</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
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
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        color: '#666',
        fontSize: 14,
    },
    value: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 14,
    },
    inputBox: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 5,
        marginLeft: 2,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    textInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: '#333',
        paddingVertical: 12,
    },
    note: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
        marginTop: 10,
        textAlign: 'center',
    },
    joinBtn: {
        backgroundColor: '#ff7f00',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 10,
        gap: 10,
    },
    joinBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
