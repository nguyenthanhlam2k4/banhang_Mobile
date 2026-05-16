import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Star, ShoppingCart, Minus, Plus, Heart } from "lucide-react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Product } from "../types";
import apiClient from "../api/client";
import { useCartStore } from "../store/useCartStore";

const { width } = Dimensions.get("window");

type RootStackParamList = {
  ProductDetail: { productId: string };
};

export default function ProductDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, "ProductDetail">>();
  const { productId } = route.params;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/products/${productId}`);
      setProduct(res.data.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      // Optional: Add some visual feedback or navigate to cart
      alert("Added to cart!");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text>Product not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: "#007AFF", marginTop: 10 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerBtn} 
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerBtn}>
          <Heart size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel Mockup */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              setActiveImage(Math.round(x / width));
            }}
            scrollEventThrottle={16}
          >
            {product.images.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {product.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  activeImage === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.brandRow}>
            <Text style={styles.brandText}>{product.brand}</Text>
            <View style={styles.ratingBox}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={styles.ratingText}>{product.rating}</Text>
              <Text style={styles.reviewText}>({product.numReviews} reviews)</Text>
            </View>
          </View>

          <Text style={styles.nameText}>{product.name}</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>${product.price}</Text>
            {product.comparePrice && (
              <Text style={styles.comparePriceText}>${product.comparePrice}</Text>
            )}
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>
                {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>

          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity 
                style={styles.qtyBtn}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={20} color="#000" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity 
                style={styles.qtyBtn}
                onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
              >
                <Plus size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalValue}>${(product.price * quantity).toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.addToCartBtn}
          onPress={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart size={20} color="#FFF" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  imageContainer: {
    height: width,
    width: width,
    position: 'relative',
  },
  productImage: {
    width: width,
    height: width,
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.2)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#007AFF",
    width: 20,
  },
  detailsContainer: {
    padding: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    backgroundColor: "#FFF",
  },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  brandText: {
    color: "#8E8E93",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontWeight: "bold",
    marginLeft: 4,
    fontSize: 14,
  },
  reviewText: {
    color: "#8E8E93",
    marginLeft: 4,
    fontSize: 12,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  priceText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#007AFF",
  },
  comparePriceText: {
    fontSize: 18,
    color: "#C7C7CC",
    textDecorationLine: "line-through",
    marginLeft: 12,
  },
  stockBadge: {
    marginLeft: "auto",
    backgroundColor: "#E5F1FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stockText: {
    color: "#007AFF",
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#F2F2F7",
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#3A3A3C",
    marginBottom: 24,
  },
  quantitySection: {
    marginBottom: 100,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    alignSelf: "flex-start",
    borderRadius: 15,
    padding: 4,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 20,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
  },
  totalPriceContainer: {
    flex: 1,
  },
  totalLabel: {
    color: "#8E8E93",
    fontSize: 12,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  addToCartBtn: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1.5,
    marginLeft: 20,
  },
  addToCartText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
});
