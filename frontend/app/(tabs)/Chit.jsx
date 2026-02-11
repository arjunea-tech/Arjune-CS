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
import { Modal } from "react-native";
import { useAuth } from "../../Components/utils/AuthContext";

export default function Chit() {
  const { user: profileUser } = useAuth();
  const [openIndex, setOpenIndex] = useState(null);
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Available'); // Available, MySchemes
  const [schemes, setSchemes] = useState([]);
  const [mySchemes, setMySchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null); // For Details Modal
  const [modalVisible, setModalVisible] = useState(false);

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

  const openSchemeDetails = (item) => {
    setSelectedScheme(item);
    setModalVisible(true);
  };

  const renderMySchemes = () => (
    mySchemes.length === 0 ? (
      <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>You haven't joined any schemes yet.</Text>
    ) : (
      mySchemes.map((item, i) => (
        <TouchableOpacity key={i} activeOpacity={0.9} onPress={() => openSchemeDetails(item)} style={styles.card}>
          <Text style={styles.title}>{item.scheme?.name}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Progress:</Text>
            <Text style={styles.value}>{item.monthsPaid} / {item.scheme?.durationMonths} Months</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Paid:</Text>
            <Text style={styles.value}>₹{item.totalPaid}</Text>
          </View>
          {item.nextDueDate ? (
            <View style={styles.dueDateContainer}>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={18} color="#d32f2f" />
                <Text style={styles.dueDateText}>
                  Due: {new Date(item.nextDueDate).toLocaleDateString()}
                </Text>
              </View>
              {item.daysRemaining !== null && (
                <View style={[styles.countdownBadge, item.daysRemaining < 5 ? styles.urgentBadge : null]}>
                  <Text style={[styles.countdownText, item.daysRemaining < 5 ? styles.urgentText : null]}>
                    {item.daysRemaining > 0 ? `${item.daysRemaining} Days Left` : (item.daysRemaining === 0 ? 'Due Today' : 'Overdue')}
                  </Text>
                </View>
              )}
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.detailsBtn}
            onPress={() => openSchemeDetails(item)}
          >
            <Ionicons name="information-circle-outline" size={16} color="#ff7f00" />
            <Text style={styles.detailsBtnText}>View Details</Text>
          </TouchableOpacity>
        </TouchableOpacity>
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

      {/* Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Scheme Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 20, alignItems: 'center' }}>
              {selectedScheme?.joinDate && (
                <Text style={styles.todayDate}>Joining Date: {new Date(selectedScheme.joinDate).toLocaleDateString()}</Text>
              )}

              {selectedScheme?.nextDueDate && (
                <Text style={{ color: '#d32f2f', fontSize: 13, marginTop: 4, fontWeight: '600' }}>
                  Next due date will be after 30 days: {new Date(selectedScheme.nextDueDate).toLocaleDateString()}
                </Text>
              )}
            </View>

            {selectedScheme && (
              <View style={styles.detailContainer}>
                <Text style={styles.schemeName}>{selectedScheme.scheme?.name}</Text>

                <View style={styles.detailContainer}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Progress:</Text>
                    <Text style={styles.detailValue}>{selectedScheme.monthsPaid} / {selectedScheme.scheme?.durationMonths} Months</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total Paid:</Text>
                    <Text style={styles.detailValue}>₹{selectedScheme.totalPaid}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailValue}>{profileUser?.name || selectedScheme.user?.name}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Mobile:</Text>
                    <Text style={styles.detailValue}>{profileUser?.mobileNumber || selectedScheme.user?.mobileNumber}</Text>
                  </View>

                  {selectedScheme.nextDueDate && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        {(() => {
                          const nextMonth = (selectedScheme.monthsPaid || 0) + 1;
                          const getOrdinal = (n) => {
                            const s = ["th", "st", "nd", "rd"];
                            const v = n % 100;
                            return n + (s[(v - 20) % 10] || s[v] || s[0]);
                          };
                          return `${getOrdinal(nextMonth)} Month Due Date:`;
                        })()}
                      </Text>
                      <Text style={[styles.detailValue, { color: '#d32f2f' }]}>
                        {new Date(selectedScheme.nextDueDate).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Action Button inside Modal */}

              </View>
            )}
          </View>
        </View>
      </Modal>
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
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDateText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#d32f2f',
  },
  countdownBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countdownText: {
    color: '#1976d2',
    fontSize: 12,
    fontWeight: 'bold',
  },
  urgentBadge: {
    backgroundColor: '#ffebee',
  },
  urgentText: {
    color: '#d32f2f',
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ff7f00',
    borderRadius: 8,
  },
  detailsBtnText: {
    color: '#ff7f00',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 5,
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
    elevation: 5
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff7f00'
  },
  todayDate: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500'
  },
  detailContainer: {
    paddingHorizontal: 5
  },
  section: {
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#ff7f00',
    paddingLeft: 8
  },
  schemeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center'
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  },
  detailValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600'
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10
  },
  payButton: {
    backgroundColor: '#ff7f00',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20
  },
  payButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});
