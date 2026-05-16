import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, Bell, Filter, ChevronRight } from "lucide-react-native";
import { Product, Category } from "../types";
import apiClient from "../api/client";
import ProductCard from "../components/ProductCard";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        apiClient.get("/categories"),
        apiClient.get("/products?featured=true"),
      ]);
      
      const catData = Array.isArray(catRes.data.data) ? catRes.data.data : [];
      const prodData = Array.isArray(prodRes.data.data) ? prodRes.data.data : [];
      
      setCategories(catData);
      setFeaturedProducts(prodData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setCategories([]);
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Welcome!</Text>
            <Text style={styles.headerTitle}>Premium Store</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationBtn}
            onPress={() => navigation.navigate("OrderHistory")}
          >
            <Bell size={24} color="#000" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search size={20} color="#8E8E93" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor="#8E8E93"
              onFocus={() => navigation.navigate("Search")}
            />
            <TouchableOpacity style={styles.filterBtn}>
              <Filter size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={16} color="#007AFF" />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {categories && categories.length > 0 ? (
              categories.map((item) => (
                <TouchableOpacity 
                  key={item._id} 
                  style={styles.categoryItem}
                  onPress={() => navigation.navigate("CategoryProducts", { 
                    categoryId: item._id, 
                    categoryName: item.name 
                  })}
                >
                  <View style={styles.categoryIconContainer}>
                    <Image 
                      source={{ uri: item.image || "https://via.placeholder.com/50" }}
                      style={styles.categoryIcon}
                    />
                  </View>
                  <Text style={styles.categoryText}>{item.name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>No categories found</Text>
            )}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {featuredProducts && featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onPress={() => navigation.navigate("ProductDetail", { productId: product._id })}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>No products found</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: {
    color: "#8E8E93",
    fontSize: 14,
  },
  headerTitle: {
    color: "#1C1C1E",
    fontSize: 24,
    fontWeight: "bold",
  },
  notificationBtn: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    position: 'relative'
  },
  notificationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    backgroundColor: '#FF2D55',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  searchSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#1C1C1E",
  },
  filterBtn: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#1C1C1E",
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
  categoriesList: {
    paddingLeft: 24,
    paddingRight: 12,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 8,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  categoryText: {
    color: "#3A3A3C",
    fontSize: 12,
    fontWeight: "500",
  },
  productsGrid: {
    paddingHorizontal: 24,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emptyText: {
    color: "#8E8E93",
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
    width: "100%",
  },
});
