import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
} from "react-native";
import { Trash2, Minus, Plus, ChevronRight, ShoppingBag, Ticket, Truck } from "lucide-react-native";
import { useCartStore } from "../store/useCartStore";
import { useNavigation } from "@react-navigation/native";
import ProductCard from "../components/ProductCard";
import apiClient from "../api/client";
import { Product } from "../types";

export default function CartScreen() {
  const { items, removeItem, updateQuantity, totalPrice, itemCount } = useCartStore();
  const navigation = useNavigation<any>();
  const [promoCode, setPromoCode] = useState("");
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  useEffect(() => {
    if (items.length === 0) {
      fetchRecommendations();
    }
  }, [items.length]);

  const fetchRecommendations = async () => {
    try {
      const res = await apiClient.get("/products?limit=4&featured=true");
      setRecommendations(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      console.error("Lỗi khi tải gợi ý:", error);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.images[0] }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <TouchableOpacity onPress={() => removeItem(item._id)}>
            <Trash2 size={18} color="#FF3B30" />
          </TouchableOpacity>
        </View>
        <Text style={styles.itemBrand}>{item.brand}</Text>
        <View style={styles.itemFooter}>
          <Text style={styles.itemPrice}>{item.price.toLocaleString('vi-VN')}đ</Text>
          <View style={styles.quantityControl}>
            <TouchableOpacity 
              style={styles.qtyBtn}
              onPress={() => updateQuantity(item._id, item.quantity - 1)}
            >
              <Minus size={14} color="#1C1C1E" />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <TouchableOpacity 
              style={styles.qtyBtn}
              onPress={() => updateQuantity(item._id, item.quantity + 1)}
            >
              <Plus size={14} color="#1C1C1E" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <ShoppingBag size={60} color="#007AFF" />
            </View>
            <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
            <Text style={styles.emptySubtitle}>Sản phẩm bạn thêm vào giỏ hàng sẽ xuất hiện ở đây.</Text>
            <TouchableOpacity 
              style={styles.shopNowBtn}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.shopNowText}>Tiếp tục mua sắm</Text>
            </TouchableOpacity>
          </View>

          {recommendations.length > 0 && (
            <View style={styles.recommendationSection}>
              <Text style={styles.recommendationTitle}>Có thể bạn sẽ thích</Text>
              <View style={styles.recommendationGrid}>
                {recommendations.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onPress={() => navigation.navigate("ProductDetail", { productId: product._id })}
                  />
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ hàng của tôi</Text>
        <Text style={styles.headerSubtitle}>Có {itemCount()} sản phẩm trong giỏ</Text>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={styles.listFooter}>
            {/* Promo Code */}
            <View style={styles.promoSection}>
              <View style={styles.promoInputContainer}>
                <Ticket size={20} color="#8E8E93" style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.promoInput}
                  placeholder="Nhập mã giảm giá"
                  placeholderTextColor="#8E8E93"
                  value={promoCode}
                  onChangeText={setPromoCode}
                />
              </View>
              <TouchableOpacity style={styles.promoBtn}>
                <Text style={styles.promoBtnText}>Áp dụng</Text>
              </TouchableOpacity>
            </View>

            {/* Delivery Info */}
            <View style={styles.deliveryCard}>
              <View style={styles.deliveryIcon}>
                <Truck size={24} color="#007AFF" />
              </View>
              <View style={styles.deliveryTextContainer}>
                <Text style={styles.deliveryTitle}>Giao hàng miễn phí</Text>
                <Text style={styles.deliverySubtitle}>Dự kiến: 2-3 ngày làm việc</Text>
              </View>
            </View>
          </View>
        }
      />

      <View style={styles.footer}>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính</Text>
            <Text style={styles.summaryValue}>{totalPrice().toLocaleString('vi-VN')}đ</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
            <Text style={[styles.summaryValue, { color: "#34C759" }]}>MIỄN PHÍ</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{totalPrice().toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate("Checkout")}
        >
          <Text style={styles.checkoutText}>Thanh toán ngay</Text>
          <ChevronRight size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
  },
  listContent: {
    padding: 24,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
  },
  itemImage: {
    width: 85,
    height: 85,
    borderRadius: 15,
    backgroundColor: "#E5E5EA",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "space-between",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
    flex: 1,
    marginRight: 8,
  },
  itemBrand: {
    fontSize: 12,
    color: "#8E8E93",
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemPrice: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1C1C1E",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  qtyBtn: {
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    fontSize: 14,
    fontWeight: "700",
    marginHorizontal: 10,
    color: "#1C1C1E",
  },
  listFooter: {
    marginTop: 8,
    marginBottom: 20,
  },
  promoSection: {
    flexDirection: "row",
    marginBottom: 20,
  },
  promoInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  promoInput: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: "#1C1C1E",
  },
  promoBtn: {
    backgroundColor: "#1C1C1E",
    paddingHorizontal: 20,
    borderRadius: 14,
    justifyContent: "center",
  },
  promoBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  deliveryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    padding: 16,
    borderRadius: 18,
  },
  deliveryIcon: {
    width: 44,
    height: 44,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  deliveryTextContainer: {
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  deliverySubtitle: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    color: "#8E8E93",
    fontSize: 14,
  },
  summaryValue: {
    color: "#1C1C1E",
    fontSize: 15,
    fontWeight: "700",
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1C1C1E",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#007AFF",
  },
  checkoutBtn: {
    backgroundColor: "#007AFF",
    height: 60,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    backgroundColor: "#F2F2F7",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  shopNowBtn: {
    backgroundColor: "#1C1C1E",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
  },
  shopNowText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  recommendationSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 16,
  },
  recommendationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
