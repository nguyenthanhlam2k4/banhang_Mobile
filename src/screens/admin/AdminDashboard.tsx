import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShoppingBag, LayoutGrid, Users, BarChart3, ChevronRight, ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

export default function AdminDashboard() {
  const navigation = useNavigation<any>();

  const adminModules = [
    { 
      id: "products", 
      title: "Products", 
      description: "Manage inventory and prices", 
      icon: <ShoppingBag size={24} color="#007AFF" />, 
      screen: "AdminProductsList",
      color: "#007AFF"
    },
    { 
      id: "categories", 
      title: "Categories", 
      description: "Organize products into groups", 
      icon: <LayoutGrid size={24} color="#34C759" />, 
      screen: "AdminCategoriesList",
      color: "#34C759"
    },
    { 
      id: "orders", 
      title: "Orders", 
      description: "Track and process sales", 
      icon: <BarChart3 size={24} color="#FF9500" />, 
      screen: "AdminOrdersList", // Not implemented yet
      color: "#FF9500"
    },
    { 
      id: "users", 
      title: "Users", 
      description: "Manage customer accounts", 
      icon: <Users size={24} color="#5856D6" />, 
      screen: "AdminUsersList", // Not implemented yet
      color: "#5856D6"
    }
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Panel</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Dashboard Overview</Text>
          <Text style={styles.welcomeSub}>Welcome back, Administrator</Text>
        </View>

        <View style={styles.grid}>
          {adminModules.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card}
              onPress={() => item.screen && navigation.navigate(item.screen)}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color + "15" }]}>
                {item.icon}
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>
              </View>
              <ChevronRight size={20} color="#C7C7CC" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 20,
    backgroundColor: "white"
  },
  backBtn: { marginRight: 16 },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#1C1C1E" },
  content: { padding: 20 },
  welcomeCard: { 
    backgroundColor: "#1C1C1E", 
    padding: 24, 
    borderRadius: 24, 
    marginBottom: 24 
  },
  welcomeTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  welcomeSub: { color: "rgba(255, 255, 255, 0.6)", fontSize: 14, marginTop: 4 },
  grid: { gap: 16 },
  card: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "white", 
    padding: 16, 
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  iconContainer: { 
    width: 48, 
    height: 48, 
    borderRadius: 14, 
    alignItems: "center", 
    justifyContent: "center",
    marginRight: 16
  },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: "bold", color: "#1C1C1E" },
  cardDesc: { fontSize: 13, color: "#8E8E93", marginTop: 2 }
});
