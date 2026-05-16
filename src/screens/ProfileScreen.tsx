import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Settings, LogOut, ShieldCheck, ShoppingBag, Heart, CreditCard, ChevronRight } from "lucide-react-native";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const { user, clearAuth } = useAuthStore();
  const navigation = useNavigation<any>();

  const menuItems = [
    { id: "orders", title: "My Orders", icon: <ShoppingBag size={22} color="#000" /> },
    { id: "wishlist", title: "Wishlist", icon: <Heart size={22} color="#000" /> },
    { id: "payment", title: "Payment Methods", icon: <CreditCard size={22} color="#000" /> },
    { id: "settings", title: "Settings", icon: <Settings size={22} color="#000" /> },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <Image 
              source={{ uri: user?.avatar || "https://via.placeholder.com/100" }} 
              style={styles.avatar} 
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.name || "User Name"}</Text>
              <Text style={styles.userEmail}>{user?.email || "email@example.com"}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{user?.role || "Customer"}</Text>
              </View>
            </View>
          </View>
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
                <Text style={styles.adminTitle}>Admin Panel</Text>
                <Text style={styles.adminSub}>Manage products and categories</Text>
              </View>
              <ChevronRight size={20} color="#FF9500" />
            </TouchableOpacity>
          )}

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.menuItem}
                onPress={() => {
                  if (item.id === "orders") {
                    navigation.navigate("OrderHistory");
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
            <LogOut size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
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
    borderBottomLeftRadius: 32, 
    borderBottomRightRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2
  },
  profileInfo: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#F2F2F7" },
  userDetails: { marginLeft: 20 },
  userName: { fontSize: 22, fontWeight: "bold", color: "#1C1C1E" },
  userEmail: { fontSize: 14, color: "#8E8E93", marginTop: 2 },
  roleBadge: { 
    backgroundColor: "rgba(0, 122, 255, 0.1)", 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 8
  },
  roleText: { color: "#007AFF", fontSize: 12, fontWeight: "600", textTransform: "uppercase" },
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
  adminTitle: { fontSize: 17, fontWeight: "bold", color: "#1C1C1E" },
  adminSub: { fontSize: 12, color: "#8E8E93", marginTop: 2 },
  menuContainer: { 
    backgroundColor: "white", 
    borderRadius: 24, 
    padding: 8,
    marginBottom: 24
  },
  menuItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7"
  },
  menuIcon: { 
    width: 36, 
    height: 36, 
    borderRadius: 10, 
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16
  },
  menuText: { flex: 1, fontSize: 16, color: "#1C1C1E" },
  logoutBtn: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center",
    backgroundColor: "rgba(255, 59, 48, 0.08)",
    padding: 16,
    borderRadius: 20
  },
  logoutText: { marginLeft: 8, fontSize: 16, fontWeight: "bold", color: "#FF3B30" }
});
