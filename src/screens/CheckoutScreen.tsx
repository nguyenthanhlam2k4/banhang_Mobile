import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, MapPin, CreditCard, CheckCircle2 } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useCartStore } from "../store/useCartStore";
import apiClient from "../api/client";

export default function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const { items, totalPrice, clearCart } = useCartStore();
  
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const [address, setAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const handlePlaceOrder = async () => {
    if (!address.fullName || !address.address || !address.city || !address.phone) {
      Alert.alert("Error", "Please fill in all shipping details");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        orderItems: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          image: item.images[0],
          price: item.price,
          product: item._id,
        })),
        shippingAddress: address,
        paymentMethod: paymentMethod,
        itemsPrice: totalPrice(),
        shippingPrice: 0,
        totalPrice: totalPrice(),
      };

      const res = await apiClient.post("/orders", orderData);
      
      if (res.data.success) {
        setOrderSuccess(true);
        clearCart();
      }
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert("Error", "Something went wrong while placing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <SafeAreaView style={styles.successContainer}>
        <CheckCircle2 size={100} color="#34C759" />
        <Text style={styles.successTitle}>Order Placed Successfully!</Text>
        <Text style={styles.successSubtitle}>
          Thank you for your purchase. Your order has been received and is being processed.
        </Text>
        <TouchableOpacity 
          style={styles.homeBtn}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.homeBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Shipping Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#007AFF" />
            <Text style={styles.sectionTitle}>Shipping Address</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={address.fullName}
              onChangeText={(text) => setAddress({ ...address, fullName: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={address.phone}
              onChangeText={(text) => setAddress({ ...address, phone: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your street address"
              value={address.address}
              onChangeText={(text) => setAddress({ ...address, address: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your city"
              value={address.city}
              onChangeText={(text) => setAddress({ ...address, city: text })}
            />
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CreditCard size={20} color="#007AFF" />
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>

          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === "COD" && styles.paymentOptionActive]}
            onPress={() => setPaymentMethod("COD")}
          >
            <View style={[styles.radio, paymentMethod === "COD" && styles.radioActive]}>
              {paymentMethod === "COD" && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.paymentText}>Cash on Delivery (COD)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === "Stripe" && styles.paymentOptionActive]}
            onPress={() => setPaymentMethod("Stripe")}
          >
            <View style={[styles.radio, paymentMethod === "Stripe" && styles.radioActive]}>
              {paymentMethod === "Stripe" && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.paymentText}>Credit / Debit Card</Text>
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items ({items.length})</Text>
              <Text style={styles.summaryValue}>${totalPrice().toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={[styles.summaryValue, { color: "#34C759" }]}>Free</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${totalPrice().toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.placeOrderBtn, loading && styles.disabledBtn]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.placeOrderText}>Place Order</Text>
          )}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#1C1C1E",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1C1C1E",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F2F2F7",
    marginBottom: 12,
  },
  paymentOptionActive: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F7FF",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#C7C7CC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioActive: {
    borderColor: "#007AFF",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
  },
  paymentText: {
    fontSize: 16,
    color: "#1C1C1E",
    fontWeight: "500",
  },
  summaryBox: {
    marginTop: 10,
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
  divider: {
    height: 1,
    backgroundColor: "#F2F2F7",
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  footer: {
    backgroundColor: "#FFF",
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
  },
  placeOrderBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledBtn: {
    opacity: 0.7,
  },
  placeOrderText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  successContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginTop: 24,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 40,
    lineHeight: 24,
  },
  homeBtn: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  homeBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
