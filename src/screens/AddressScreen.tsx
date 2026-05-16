import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, MapPin, Plus, Trash2, Edit2 } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

const INITIAL_ADDRESSES = [
  {
    id: "1",
    name: "Nhà riêng",
    receiver: "Lâm Nguyễn",
    phone: "0987654321",
    address: "123 Đường ABC, Phường 4, Quận 5, TP. Hồ Chí Minh",
    isDefault: true,
  },
  {
    id: "2",
    name: "Công ty",
    receiver: "Nguyễn Thanh Lâm",
    phone: "0123456789",
    address: "456 Đường XYZ, Phường Tân Quy, Quận 7, TP. Hồ Chí Minh",
    isDefault: false,
  },
];

export default function AddressScreen() {
  const navigation = useNavigation<any>();
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Địa chỉ giao hàng</Text>
        <View style={{ width: 32 }} />
      </View>

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.addressCard}>
            <View style={styles.addressHeader}>
              <View style={styles.nameContainer}>
                <MapPin size={18} color="#007AFF" />
                <Text style={styles.addressName}>{item.name}</Text>
                {item.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Mặc định</Text>
                  </View>
                )}
              </View>
              <View style={styles.actionBtns}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Edit2 size={16} color="#8E8E93" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { marginLeft: 12 }]}>
                  <Trash2 size={16} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.receiverName}>{item.receiver}</Text>
            <Text style={styles.phoneText}>{item.phone}</Text>
            <Text style={styles.addressText}>{item.address}</Text>
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.addBtn}>
            <Plus size={20} color="#007AFF" />
            <Text style={styles.addBtnText}>Thêm địa chỉ mới</Text>
          </TouchableOpacity>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  listContent: {
    padding: 20,
  },
  addressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginLeft: 8,
  },
  defaultBadge: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  defaultText: {
    fontSize: 10,
    color: "#007AFF",
    fontWeight: "bold",
  },
  actionBtns: {
    flexDirection: "row",
  },
  actionBtn: {
    padding: 4,
  },
  receiverName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  phoneText: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: "#3A3A3C",
    lineHeight: 20,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderStyle: "dashed",
    marginTop: 8,
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
    marginLeft: 8,
  },
});
