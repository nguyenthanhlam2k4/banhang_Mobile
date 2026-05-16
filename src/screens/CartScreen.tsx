import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Trash2, Minus, Plus, ChevronRight, ShoppingBag } from "lucide-react-native";
import { useCartStore } from "../store/useCartStore";
import { useNavigation } from "@react-navigation/native";

export default function CartScreen() {
  const { items, removeItem, updateQuantity, totalPrice, itemCount } = useCartStore();
  const navigation = useNavigation<any>();

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
          <Text style={styles.itemPrice}>${item.price}</Text>
          <View style={styles.quantityControl}>
            <TouchableOpacity 
              style={styles.qtyBtn}
              onPress={() => updateQuantity(item._id, item.quantity - 1)}
            >
              <Minus size={14} color="#000" />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <TouchableOpacity 
              style={styles.qtyBtn}
              onPress={() => updateQuantity(item._id, item.quantity + 1)}
            >
              <Plus size={14} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <ShoppingBag size={80} color="#C7C7CC" />
        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptySubtitle}>Looks like you haven't added anything to your cart yet.</Text>
        <TouchableOpacity 
          style={styles.shopNowBtn}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.shopNowText}>Shop Now</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <Text style={styles.headerSubtitle}>{itemCount()} items</Text>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${totalPrice().toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>Free</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${totalPrice().toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate("Checkout")}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          <ChevronRight size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "#FFF",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },
  listContent: {
    padding: 24,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 15,
    backgroundColor: "#F2F2F7",
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
    fontWeight: "bold",
    color: "#1C1C1E",
    flex: 1,
    marginRight: 8,
  },
  itemBrand: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    padding: 4,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 12,
  },
  footer: {
    backgroundColor: "#FFF",
    padding: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    color: "#8E8E93",
    fontSize: 14,
  },
  summaryValue: {
    color: "#1C1C1E",
    fontSize: 16,
    fontWeight: "600",
  },
  totalRow: {
    marginTop: 8,
    marginBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007AFF",
  },
  checkoutBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 18,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginTop: 24,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 32,
  },
  shopNowBtn: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 20,
  },
  shopNowText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
