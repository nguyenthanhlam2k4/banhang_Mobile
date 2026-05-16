import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Settings, LogOut, ShieldCheck, ShoppingBag, Heart, MapPin, ChevronRight, Bell, CreditCard } from "lucide-react-native";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const { user, clearAuth } = useAuthStore();
  const navigation = useNavigation<any>();

  const menuItems = [
    { id: "orders", title: "Đơn hàng của tôi", icon: <ShoppingBag size={22} color="#1C1C1E" />, screen: "OrderHistory" },
    { id: "wishlist", title: "Danh sách yêu thích", icon: <Heart size={22} color="#1C1C1E" />, screen: "Wishlist" },
    { id: "address", title: "Địa chỉ giao hàng", icon: <MapPin size={22} color="#1C1C1E" />, screen: "Address" },
    { id: "payment", title: "Phương thức thanh toán", icon: <CreditCard size={22} color="#1C1C1E" />, screen: "" },
    { id: "notifications", title: "Thông báo", icon: <Bell size={22} color="#1C1C1E" />, screen: "" },
    { id: "settings", title: "Cài đặt", icon: <Settings size={22} color="#1C1C1E" />, screen: "" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <Image 
              source={{ uri: user?.avatar || "https://i.pravatar.cc/150?u=lamnguyen" }} 
              style={styles.avatar} 
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.name || "Lâm Nguyễn"}</Text>
              <Text style={styles.userEmail}>{user?.email || "lam.nguyen@example.com"}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{user?.role === "admin" ? "Quản trị viên" : "Khách hàng"}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Admin Panel Button */}
          {user?.role === "admin" && (
            <TouchableOpacity 
              style={styles.adminButton}
              onPress={() => navigation.navigate("AdminDashboard")}
            >
              <View style={styles.adminIconContainer}>
                <ShieldCheck size={24} color="#FF9500" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.adminTitle}>Bảng điều khiển Admin</Text>
                <Text style={styles.adminSub}>Quản lý sản phẩm và danh mục</Text>
              </View>
              <ChevronRight size={20} color="#FF9500" />
            </TouchableOpacity>
          )}

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity 
                key={item.id} 
                style={[
                  styles.menuItem, 
                  index === menuItems.length - 1 && { borderBottomWidth: 0 }
                ]}
                onPress={() => {
                  if (item.screen) {
                    navigation.navigate(item.screen);
                  }
                }}
              >
                <View style={styles.menuIcon}>{item.icon}</View>
                <Text style={styles.menuText}>{item.title}</Text>
                <ChevronRight size={18} color="#C7C7CC" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutBtn} onPress={clearAuth}>
            <View style={styles.logoutIcon}>
              <LogOut size={20} color="#FF3B30" />
            </View>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { 
    padding: 24, 
    backgroundColor: "white", 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 32, 
    borderBottomRightRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2
  },
  profileInfo: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: "#F2F2F7" },
  userDetails: { marginLeft: 16 },
  userName: { fontSize: 20, fontWeight: "bold", color: "#1C1C1E" },
  userEmail: { fontSize: 13, color: "#8E8E93", marginTop: 2 },
  roleBadge: { 
    backgroundColor: "rgba(0, 122, 255, 0.1)", 
    paddingHorizontal: 10, 
    paddingVertical: 3, 
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 6
  },
  roleText: { color: "#007AFF", fontSize: 11, fontWeight: "700", textTransform: "uppercase" },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  content: { padding: 24 },
  adminButton: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "rgba(255, 149, 0, 0.08)", 
    padding: 16, 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 149, 0, 0.2)",
    marginBottom: 24
  },
  adminIconContainer: { 
    width: 48, 
    height: 48, 
    borderRadius: 14, 
    backgroundColor: "rgba(255, 149, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16
  },
  adminTitle: { fontSize: 16, fontWeight: "bold", color: "#1C1C1E" },
  adminSub: { fontSize: 12, color: "#8E8E93", marginTop: 2 },
  menuContainer: { 
    backgroundColor: "white", 
    borderRadius: 24, 
    padding: 8,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1
  },
  menuItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7"
  },
  menuIcon: { 
    width: 38, 
    height: 38, 
    borderRadius: 12, 
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16
  },
  menuText: { flex: 1, fontSize: 15, fontWeight: "500", color: "#1C1C1E" },
  logoutBtn: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F2F2F7"
  },
  logoutIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255, 59, 48, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12
  },
  logoutText: { fontSize: 16, fontWeight: "bold", color: "#FF3B30" },
  versionText: {
    textAlign: "center",
    color: "#C7C7CC",
    fontSize: 12,
    marginTop: 24,
  }
});
