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
  Dimensions,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, Bell, Filter, ChevronRight, Zap } from "lucide-react-native";
import { Product, Category } from "../types";
import apiClient from "../api/client";
import ProductCard from "../components/ProductCard";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const BANNERS = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop",
    title: "Summer Collection",
    subtitle: "Up to 50% Off",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
    title: "Tech Week",
    subtitle: "New Gadgets Available",
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, featRes, newRes] = await Promise.all([
        apiClient.get("/categories"),
        apiClient.get("/products?featured=true&limit=4"),
        apiClient.get("/products?limit=6&sort=-createdAt"),
      ]);
      
      setCategories(Array.isArray(catRes.data.data) ? catRes.data.data : []);
      setFeaturedProducts(Array.isArray(featRes.data.data) ? featRes.data.data : []);
      setNewArrivals(Array.isArray(newRes.data.data) ? newRes.data.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderBanner = ({ item }: { item: typeof BANNERS[0] }) => (
    <TouchableOpacity style={styles.bannerContainer} activeOpacity={0.9}>
      <Image source={{ uri: item.image }} style={styles.bannerImage} />
      <View style={styles.bannerOverlay}>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <TouchableOpacity style={styles.bannerBtn}>
          <Text style={styles.bannerBtnText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.headerTitle}>Alex Smith</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationBtn}
            onPress={() => navigation.navigate("OrderHistory")}
          >
            <Bell size={22} color="#1C1C1E" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search size={20} color="#8E8E93" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search what you need..."
              placeholderTextColor="#8E8E93"
              onFocus={() => navigation.navigate("Search")}
            />
            <TouchableOpacity style={styles.filterBtn}>
              <Filter size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Banner Slider */}
        <View style={styles.bannerSliderSection}>
          <FlatList
            data={BANNERS}
            renderItem={renderBanner}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              setActiveBanner(Math.round(x / width));
            }}
            keyExtractor={(item) => item.id}
          />
          <View style={styles.bannerPagination}>
            {BANNERS.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.paginationDot, 
                  activeBanner === index && styles.paginationDotActive
                ]} 
              />
            ))}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore Categories</Text>
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
            {categories.map((item) => (
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
            ))}
          </ScrollView>
        </View>

        {/* Featured Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.titleWithIcon}>
              <Zap size={20} color="#FF9500" fill="#FF9500" />
              <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>Featured For You</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onPress={() => navigation.navigate("ProductDetail", { productId: product._id })}
              />
            ))}
          </View>
        </View>

        {/* New Arrivals Section */}
        <View style={[styles.section, { marginBottom: 40 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Arrivals</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
          >
            {newArrivals.map((product) => (
              <View key={product._id} style={{ marginRight: 16, width: 160 }}>
                <ProductCard
                  product={product}
                  onPress={() => navigation.navigate("ProductDetail", { productId: product._id })}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: {
    color: "#8E8E93",
    fontSize: 14,
    fontWeight: "500",
  },
  headerTitle: {
    color: "#1C1C1E",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 2,
  },
  notificationBtn: {
    backgroundColor: "#F2F2F7",
    padding: 10,
    borderRadius: 14,
    position: 'relative'
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    backgroundColor: '#FF3B30',
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#F2F2F7'
  },
  searchSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#1C1C1E",
  },
  filterBtn: {
    backgroundColor: "#1C1C1E",
    padding: 8,
    borderRadius: 10,
  },
  bannerSliderSection: {
    marginBottom: 24,
    position: 'relative',
  },
  bannerContainer: {
    width: width - 48,
    height: 180,
    marginHorizontal: 24,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#E5E5EA',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 24,
    justifyContent: 'center',
  },
  bannerSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginVertical: 8,
  },
  bannerBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  bannerBtnText: {
    color: '#1C1C1E',
    fontSize: 14,
    fontWeight: '700',
  },
  bannerPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C7C7CC',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 20,
    backgroundColor: '#1C1C1E',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    color: "#1C1C1E",
    fontSize: 19,
    fontWeight: "700",
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
    marginRight: 24,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: "#F2F2F7",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  categoryText: {
    color: "#3A3A3C",
    fontSize: 13,
    fontWeight: "600",
  },
  productsGrid: {
    paddingHorizontal: 24,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
