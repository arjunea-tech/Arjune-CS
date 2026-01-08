import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import SingleChit from "../../Components/ChitComponenets/SingleChit";
import api from "../../Components/api/config";

export default function Chit() {
  const [openIndex, setOpenIndex] = useState(null);
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Available'); // Available, MySchemes
  const [schemes, setSchemes] = useState([]);
  const [mySchemes, setMySchemes] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/chit/schemes');
      if (res.data.success) {
        setSchemes(res.data.data);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load schemes');
    } finally {
      setLoading(false);
    }
  };

  const fetchMySchemes = async () => {
    try {
      const res = await api.get('/chit/my');
      if (res.data.success) {
        setMySchemes(res.data.data);
      }
    } catch (error) {
      console.log('Failed to fetch my schemes', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSchemes();
      if (activeTab === 'MySchemes') {
        fetchMySchemes();
      }
    }, [activeTab])
  );

  const router = useRouter();

  const handleJoin = (scheme) => {
    router.push({
      pathname: '/ChitRegistration',
      params: {
        schemeId: scheme._id,
        schemeName: scheme.name,
        amount: scheme.installmentAmount
      }
    });
  };

  const handlePayment = (scheme) => {
    if (!scheme) return;
    const myScheme = mySchemes.find(s => s.scheme?._id === scheme._id);
    const monthIdx = myScheme ? myScheme.monthsPaid : 0;

    router.push({
      pathname: '/PaymentGateway',
      params: {
        schemeId: scheme._id,
        amount: scheme.installmentAmount,
        name: scheme.name,
        monthIndex: monthIdx,
        type: 'payment'
      }
    });
  };

  const renderAvailableSchemes = () => (
    schemes.length === 0 ? (
      <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>No schemes available.</Text>
    ) : (
      schemes.map((plan, i) => (
        <SingleChit
          key={plan._id}
          index={i}
          name={plan.name}
          amount={`₹${plan.totalAmount}`}
          period={`${plan.durationMonths} Months`}
          payingAmt={`₹${plan.installmentAmount} / Month`}
          bonus="N/A"
          provided="Monthly"
          isOpen={openIndex === i}
          onToggle={toggle}
          onJoin={() => handleJoin(plan)}
        />
      ))
    )
  );

  const renderMySchemes = () => (
    mySchemes.length === 0 ? (
      <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>You haven't joined any schemes yet.</Text>
    ) : (
      mySchemes.map((item, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.title}>{item.scheme?.name}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Progress:</Text>
            <Text style={styles.value}>{item.monthsPaid} / {item.scheme?.durationMonths} Months</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Paid:</Text>
            <Text style={styles.value}>₹{item.totalPaid}</Text>
          </View>
          {item.scheme?.nextDueDate ? (
            <View style={styles.dueDateContainer}>
              <Ionicons name="calendar-outline" size={16} color="#d32f2f" />
              <Text style={styles.dueDateText}>Next due date is: {item.scheme.nextDueDate}</Text>
            </View>
          ) : null}
        </View>
      ))
    )
  );

  return (
    <View style={styles.container}>
      {/* 🔙 Header like Orders */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Chit Schemes</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('Available')} style={[styles.tab, activeTab === 'Available' && styles.activeTab]}>
          <Text style={[styles.tabText, activeTab === 'Available' && styles.activeTabText]}>Available</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('MySchemes')} style={[styles.tab, activeTab === 'MySchemes' && styles.activeTab]}>
          <Text style={[styles.tabText, activeTab === 'MySchemes' && styles.activeTabText]}>My Schemes</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} /> : (
          activeTab === 'Available' ? renderAvailableSchemes() : renderMySchemes()
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff7f00",
  },

  /* Header like Orders */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backBtn: {
    marginRight: 10,
  },
  pageTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },

  /* Tabs */
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 4
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8
  },
  activeTab: {
    backgroundColor: '#fff'
  },
  tabText: {
    color: '#fff',
    fontWeight: '600'
  },
  activeTabText: {
    color: '#ff7f00'
  },

  /* Card Styles */
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  value: {
    flex: 1,
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: '#333'
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  dueDateText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#d32f2f',
  },
});
