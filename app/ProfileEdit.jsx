import { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity,  Alert,ScrollView,} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function EditProfile() {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [mobile, setMobile] = useState("");



  const handleSave = () => {
    if (!name || !address || !pincode || !mobile) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    Alert.alert("Success", "Profile updated successfully");
    navigation.goBack();
  };

  const handlePincode = async (pin) => {
    setPincode(pin);

    if (pin.length === 6) {
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pin}`
        );
        const data = await response.json();

        if (
          data[0].Status === "Success" &&
          data[0].PostOffice.length > 0
        ) {
          setDistrict(data[0].PostOffice[0].District);
          setState(data[0].PostOffice[0].State);
        } else {
          setDistrict("");
          setState("");
          alert("Invalid Pincode");
        }
      } catch (error) {
        console.log(error);
        alert("Unable to fetch pincode details");
      }
    }
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TextInput
        placeholder="Customer Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Shipping Address"
        value={address}
        onChangeText={setAddress}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <TextInput
        placeholder="Pincode"
        keyboardType="number-pad"
        maxLength={6}
        value={pincode}
        onChangeText={handlePincode}
        style={styles.input}
      />

      <TextInput
        placeholder="District"
        value={district}
        editable={false}
        style={[styles.input, styles.disabled]}
      />

      <TextInput
        placeholder="State"
        value={state}
        editable={false}
        style={[styles.input, styles.disabled]}
      />

      <TextInput
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        maxLength={10}
        value={mobile}
        onChangeText={setMobile}
        style={styles.input}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>SAVE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#222",
  },

  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 15,
  },

  disabled: {
    backgroundColor: "#eee",
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
