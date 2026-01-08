import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";
import { useAuth } from "../Components/utils/AuthContext";
import { authAPI } from "../Components/api";
import { resolveImageUrl } from "../Components/utils/imageUrl";

export default function EditProfile() {
  const navigation = useNavigation();
  const { user, login } = useAuth();

  const [profileImage, setProfileImage] = useState(user?.avatar || null);
  const [name, setName] = useState(user?.name || "");
  const [address, setAddress] = useState(user?.address || "");
  const [pincode, setPincode] = useState(user?.pincode || "");
  const [district, setDistrict] = useState(user?.district || "");
  const [state, setState] = useState(user?.state || "");
  const [mobile, setMobile] = useState(user?.mobileNumber || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      setLoading(true);
      const res = await authAPI.getMe();
      if (res.success && user?.token) {
        await login({
          token: user.token,
          ...res.data
        });
      }
    } catch (error) {
      console.error('Refresh profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setProfileImage(user.avatar || null);
      setName(user.name || "");
      setAddress(user.address || "");
      setPincode(user.pincode || "");
      setDistrict(user.district || "");
      setState(user.state || "");
      setMobile(user.mobileNumber || "");
    }
  }, [user]);

  /* ---------------- Image Picker ---------------- */
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow gallery access");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  /* ---------------- Save ---------------- */
  const handleSave = async () => {
    if (!name || !address || !pincode || !mobile) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('mobileNumber', mobile);
      formData.append('address', address);
      formData.append('pincode', pincode);
      formData.append('district', district);
      formData.append('state', state);

      if (profileImage && profileImage !== user?.avatar) {
        const filename = profileImage.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        formData.append('avatar', { uri: profileImage, name: filename, type });
      }

      const res = await authAPI.updateDetails(formData);
      if (res.success && user?.token) {
        // Update local auth context with new user data
        await login({
          token: user.token, // Keep existing token
          ...res.data
        });
        Alert.alert("Success", "Profile updated successfully");
        navigation.goBack();
      }
    } catch (error) {
      console.error('Update profile error:', error.message);
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Pincode ---------------- */
  const handlePincode = async (pin) => {
    setPincode(pin);

    if (pin.length === 6) {
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pin}`
        );
        const data = await response.json();

        if (data[0].Status === "Success") {
          setDistrict(data[0].PostOffice[0].District);
          setState(data[0].PostOffice[0].State);
        } else {
          setDistrict("");
          setState("");
          Alert.alert("Invalid Pincode");
        }
      } catch {
        Alert.alert("Error", "Unable to fetch pincode details");
      }
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ---------- Header ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* ---------- Profile Image ---------- */}
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
          {profileImage ? (
            <Image source={{ uri: resolveImageUrl(profileImage) }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="person" size={50} color="#aaa" />
            </View>
          )}
          <View style={styles.cameraIcon}>
            <Ionicons name="camera" size={18} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      {/* ---------- Inputs ---------- */}
      <View style={styles.inputWrapper}>
        <Ionicons name="person-outline" size={20} color="#888" />
        <TextInput
          placeholder="Customer Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="home-outline" size={20} color="#888" />
        <TextInput
          placeholder="Shipping Address"
          value={address}
          onChangeText={setAddress}
          style={[styles.input, { height: 80 }]}
          multiline
        />
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="location-outline" size={20} color="#888" />
        <TextInput
          placeholder="Pincode"
          keyboardType="number-pad"
          maxLength={6}
          value={pincode}
          onChangeText={handlePincode}
          style={styles.input}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="map-outline" size={20} color="#888" />
        <TextInput
          placeholder="District"
          value={district}
          onChangeText={setDistrict}
          style={styles.input}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="flag-outline" size={20} color="#888" />
        <TextInput
          placeholder="State"
          value={state}
          onChangeText={setState}
          style={styles.input}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="call-outline" size={20} color="#888" />
        <TextInput
          placeholder="Mobile Number"
          keyboardType="phone-pad"
          maxLength={10}
          value={mobile}
          onChangeText={setMobile}
          style={styles.input}
        />
      </View>

      {/* ---------- Save ---------- */}
      <TouchableOpacity
        style={[styles.saveBtn, loading && { opacity: 0.7 }]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>SAVE</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },

  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },

  imageWrapper: {
    position: "relative",
  },

  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },

  placeholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },

  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#ff7f00",
    borderRadius: 20,
    padding: 6,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    paddingVertical: 14,
    paddingLeft: 10,
    fontSize: 15,
  },

  disabled: {
    backgroundColor: "#fff",
    color: "#666",
  },

  saveBtn: {
    backgroundColor: "#ff7f00",
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
  },

  saveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
