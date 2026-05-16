import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from "react-native";
import { Plus, Edit2, Trash2, ChevronLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../../api/client";
import { Product } from "../../types";

export default function AdminProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/admin/products");
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching admin products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this product?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          try {
            await apiClient.delete(`/admin/products/${id}`);
            setProducts(products.filter(p => p._id !== id));
          } catch (error) {
            Alert.alert("Error", "Failed to delete product");
          }
        }
      }
    ]);
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <Text style={styles.productStock}>Stock: {item.stock}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => navigation.navigate("AdminProductForm", { product: item })}
        >
          <Edit2 size={18} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => handleDelete(item._id)}
        >
          <Trash2 size={18} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Manage Products</Text>
        <TouchableOpacity 
          style={styles.addBtn}
          onPress={() => navigation.navigate("AdminProductForm")}
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No products found</Text>}
          onRefresh={fetchProducts}
          refreshing={loading}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE"
  },
  title: { fontSize: 20, fontWeight: "bold" },
  addBtn: { backgroundColor: "#007AFF", padding: 8, borderRadius: 12 },
  list: { padding: 16 },
  productItem: { 
    flexDirection: "row", 
    backgroundColor: "white", 
    borderRadius: 16, 
    padding: 12, 
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  productImage: { width: 60, height: 60, borderRadius: 10, backgroundColor: "#F0F0F0" },
  productInfo: { flex: 1, marginLeft: 12 },
  productName: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
  productPrice: { fontSize: 14, color: "#007AFF", fontWeight: "bold" },
  productStock: { fontSize: 12, color: "#8E8E93" },
  actions: { flexDirection: "row" },
  actionBtn: { padding: 8, marginLeft: 8, borderRadius: 10 },
  editBtn: { backgroundColor: "rgba(0, 122, 255, 0.1)" },
  deleteBtn: { backgroundColor: "rgba(255, 59, 48, 0.1)" },
  emptyText: { textAlign: "center", marginTop: 50, color: "#8E8E93" }
});
