import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from "react-native";
import { Plus, Edit2, Trash2, ChevronLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../../api/client";
import { Category } from "../../types";

export default function AdminCategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching admin categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = fetchData;

  const handleDelete = (id: string) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this category?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          try {
            await apiClient.delete(`/admin/categories/${id}`);
            setCategories(categories.filter(c => c._id !== id));
          } catch (error) {
            Alert.alert("Error", "Failed to delete category");
          }
        }
      }
    ]);
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <View style={styles.categoryItem}>
      <Image source={{ uri: item.image || "https://via.placeholder.com/150" }} style={styles.categoryImage} />
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categorySlug}>/{item.slug}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => navigation.navigate("AdminCategoryForm", { category: item })}
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
        <Text style={styles.title}>Manage Categories</Text>
        <TouchableOpacity 
          style={styles.addBtn}
          onPress={() => navigation.navigate("AdminCategoryForm")}
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No categories found</Text>}
          onRefresh={fetchCategories}
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
  categoryItem: { 
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
  categoryImage: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#F0F0F0" },
  categoryInfo: { flex: 1, marginLeft: 12 },
  categoryName: { fontSize: 16, fontWeight: "600" },
  categorySlug: { fontSize: 12, color: "#8E8E93" },
  actions: { flexDirection: "row" },
  actionBtn: { padding: 8, marginLeft: 8, borderRadius: 10 },
  editBtn: { backgroundColor: "rgba(0, 122, 255, 0.1)" },
  deleteBtn: { backgroundColor: "rgba(255, 59, 48, 0.1)" },
  emptyText: { textAlign: "center", marginTop: 50, color: "#8E8E93" }
});
