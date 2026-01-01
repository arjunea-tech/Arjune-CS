import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator
} from "react-native";
import { useAuth } from "../Components/utils/AuthContext";
import { authAPI } from "../Components/api";

export default function SavedAddress() {
    const navigation = useNavigation();
    const { user, login } = useAuth();
    const [addresses, setAddresses] = useState(user?.addresses || []);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    // Form State
    const [label, setLabel] = useState("Home");
    const [address, setAddress] = useState("");
    const [pincode, setPincode] = useState("");
    const [district, setDistrict] = useState("");
    const [state, setState] = useState("");

    useEffect(() => {
        if (user?.addresses) {
            setAddresses(user.addresses);
        }
    }, [user]);

    const handlePincode = async (pin) => {
        setPincode(pin);
        if (pin.length === 6) {
            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
                const data = await response.json();
                if (data[0].Status === "Success") {
                    setDistrict(data[0].PostOffice[0].District);
                    setState(data[0].PostOffice[0].State);
                }
            } catch (error) {
                console.error("Pincode error:", error);
            }
        }
    };

    const handleAddAddress = async () => {
        if (!address || !pincode || !district || !state) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        try {
            setLoading(true);
            const newAddress = { label, address, pincode, district, state };
            const res = await authAPI.addAddress(newAddress);

            if (res.success) {
                // Update local context
                await login({
                    token: user.token,
                    ...user,
                    addresses: res.data
                });
                setModalVisible(false);
                resetForm();
                Alert.alert("Success", "Address added successfully");
            }
        } catch (error) {
            console.error('Add Address Error:', error.message);
            Alert.alert("Error", error.message || "Failed to add address");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAddress = (id) => {
        Alert.alert("Delete Address", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        setLoading(true);
                        const res = await authAPI.deleteAddress(id);
                        if (res.success) {
                            await login({
                                token: user.token,
                                ...user,
                                addresses: res.data
                            });
                        }
                    } catch (error) {
                        console.error('Delete Address Error:', error.message);
                        Alert.alert("Error", error.message || "Failed to delete address");
                    } finally {
                        setLoading(false);
                    }
                }
            }
        ]);
    };

    const resetForm = () => {
        setLabel("Home");
        setAddress("");
        setPincode("");
        setDistrict("");
        setState("");
    };

    const handleSetDefault = async (id) => {
        try {
            setLoading(true);
            const res = await authAPI.setDefaultAddress(id);
            if (res.success) {
                await login({
                    token: user.token,
                    ...user,
                    addresses: res.data
                });
                Alert.alert("Success", "Default address updated");
            }
        } catch (error) {
            console.error('Set Default Error:', error.message);
            Alert.alert("Error", error.message || "Failed to set default address");
        } finally {
            setLoading(false);
        }
    };

    const renderAddressItem = ({ item }) => (
        <View style={[styles.addressCard, item.isDefault && styles.defaultCard]}>
            <View style={styles.cardHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.labelBadge, item.isDefault && styles.defaultBadge]}>
                        <Text style={[styles.labelText, item.isDefault && styles.defaultBadgeText]}>
                            {item.label} {item.isDefault ? '(Default)' : ''}
                        </Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    {!item.isDefault && (
                        <TouchableOpacity onPress={() => handleSetDefault(item._id)} style={{ marginRight: 15 }}>
                            <Ionicons name="star-outline" size={20} color="#ff7f00" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => handleDeleteAddress(item._id)}>
                        <Ionicons name="trash-outline" size={20} color="#ff4444" />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.fullAddress}>{item.address}</Text>
            <Text style={styles.locationInfo}>{item.district}, {item.state} - {item.pincode}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#222" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Saved Addresses</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Ionicons name="add-circle" size={28} color="#ff7f00" />
                </TouchableOpacity>
            </View>

            {loading && <ActivityIndicator style={{ margin: 20 }} color="#ff7f00" />}

            <FlatList
                data={addresses}
                keyExtractor={(item) => item._id}
                renderItem={renderAddressItem}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="location-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>No saved addresses yet</Text>
                    </View>
                }
            />

            {/* Add Address Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add New Address</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#222" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.labelContainer}>
                            {['Home', 'Work', 'Other'].map((l) => (
                                <TouchableOpacity
                                    key={l}
                                    style={[styles.labelBtn, label === l && styles.activeLabel]}
                                    onPress={() => setLabel(l)}
                                >
                                    <Text style={[styles.labelBtnText, label === l && styles.activeLabelText]}>{l}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TextInput
                            placeholder="Full Address"
                            style={[styles.input, { height: 80 }]}
                            multiline
                            value={address}
                            onChangeText={setAddress}
                        />
                        <TextInput
                            placeholder="Pincode"
                            style={styles.input}
                            keyboardType="number-pad"
                            maxLength={6}
                            value={pincode}
                            onChangeText={handlePincode}
                        />
                        <TextInput
                            placeholder="District"
                            style={[styles.input, styles.disabledInput]}
                            value={district}
                            editable={false}
                        />
                        <TextInput
                            placeholder="State"
                            style={[styles.input, styles.disabledInput]}
                            value={state}
                            editable={false}
                        />

                        <TouchableOpacity style={styles.saveBtn} onPress={handleAddAddress}>
                            <Text style={styles.saveBtnText}>SAVE ADDRESS</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f8f8" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: "#fff",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTitle: { fontSize: 18, fontWeight: "700", color: "#222" },
    addressCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#eee",
    },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
    labelBadge: { backgroundColor: "#fff0e0", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    labelText: { color: "#ff7f00", fontSize: 12, fontWeight: "600" },
    defaultCard: { borderColor: "#ff7f00", backgroundColor: "#fffcf9", borderWidth: 1.5 },
    defaultBadge: { backgroundColor: "#ff7f00" },
    defaultBadgeText: { color: "#fff" },
    fullAddress: { fontSize: 15, color: "#333", lineHeight: 22 },
    locationInfo: { fontSize: 13, color: "#777", marginTop: 4 },
    emptyContainer: { alignItems: "center", marginTop: 100 },
    emptyText: { color: "#999", marginTop: 10, fontSize: 16 },

    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
    modalContent: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
    modalHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
    modalTitle: { fontSize: 18, fontWeight: "700" },
    labelContainer: { flexDirection: "row", marginBottom: 20 },
    labelBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: "#ccc", marginRight: 10 },
    activeLabel: { backgroundColor: "#ff7f00", borderColor: "#ff7f00" },
    labelBtnText: { color: "#666" },
    activeLabelText: { color: "#fff", fontWeight: "600" },
    input: { backgroundColor: "#f0f0f0", borderRadius: 10, padding: 12, marginBottom: 15, fontSize: 15 },
    disabledInput: { color: "#888" },
    saveBtn: { backgroundColor: "#ff7f00", padding: 15, borderRadius: 12, alignItems: "center", marginTop: 10 },
    saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 }
});
