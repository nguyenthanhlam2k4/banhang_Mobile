import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, X, Filter, ChevronLeft, SlidersHorizontal } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../api/client";
import { Product, Category } from "../types";
import ProductCard from "../components/ProductCard";

const { width } = Dimensions.get("window");

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(["Giày Nike", "Áo thun", "Phụ kiện"]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() || selectedCategory) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get("/categories");
      setCategories(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      let url = `/products?name=${searchQuery}`;
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }
      const res = await apiClient.get(url);
      setProducts(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setProducts([]);
    setSelectedCategory(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Search size={20} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={18} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <SlidersHorizontal size={22} color="#1C1C1E" />
        </TouchableOpacity>
      </View>

      {/* Categories Horizontal */}
      <View style={styles.categoriesSection}>
        <FlatList
          data={[{ _id: null, name: "Tất cả" } as any, ...categories]}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item._id || "all"}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === item._id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(item._id)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === item._id && styles.categoryChipTextActive,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : products.length > 0 ? (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.productsGrid}
          renderItem={({ item }) => (
            <View style={{ width: (width - 48) / 2, marginBottom: 16 }}>
              <ProductCard
                product={item}
                onPress={() => navigation.navigate("ProductDetail", { productId: item._id })}
              />
            </View>
          )}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
      ) : searchQuery === "" ? (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Tìm kiếm gần đây</Text>
          <View style={styles.recentSearches}>
            {recentSearches.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.recentItem}
                onPress={() => setSearchQuery(item)}
              >
                <Text style={styles.recentText}>{item}</Text>
                <X size={14} color="#8E8E93" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.centerContainer}>
          <Image 
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/6134/6134065.png" }} 
            style={styles.noResultImage}
          />
          <Text style={styles.noResultTitle}>Không tìm thấy sản phẩm</Text>
          <Text style={styles.noResultSub}>Thử tìm kiếm với từ khóa khác nhé!</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: "#1C1C1E",
  },
  filterBtn: {
    padding: 8,
    marginLeft: 8,
  },
  categoriesSection: {
    marginVertical: 12,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: "#1C1C1E",
  },
  categoryChipText: {
    fontSize: 14,
    color: "#3A3A3C",
    fontWeight: "500",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 16,
  },
  recentSearches: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  recentText: {
    fontSize: 14,
    color: "#3A3A3C",
    marginRight: 6,
  },
  productsGrid: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  noResultImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
    opacity: 0.5,
  },
  noResultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  noResultSub: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 8,
    textAlign: "center",
  },
});
