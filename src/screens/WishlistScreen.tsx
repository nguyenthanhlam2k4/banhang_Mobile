import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Heart, ShoppingBag } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useWishlistStore } from "../store/useWishlistStore";
import ProductCard from "../components/ProductCard";

const { width } = Dimensions.get("window");

export default function WishlistScreen() {
  const navigation = useNavigation<any>();
  const { items, removeItem } = useWishlistStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh sách yêu thích</Text>
        <View style={{ width: 32 }} />
      </View>

      {items.length > 0 ? (
        <FlatList
          data={items}
          numColumns={2}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={{ width: (width - 48) / 2, marginBottom: 16 }}>
              <ProductCard
                product={item}
                onPress={() => navigation.navigate("ProductDetail", { productId: item._id })}
              />
              <TouchableOpacity 
                style={styles.removeBtn}
                onPress={() => removeItem(item._id)}
              >
                <Heart size={18} color="#FF3B30" fill="#FF3B30" />
              </TouchableOpacity>
            </View>
          )}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Heart size={60} color="#FF3B30" />
          </View>
          <Text style={styles.emptyTitle}>Chưa có sản phẩm yêu thích</Text>
          <Text style={styles.emptySubtitle}>Hãy thêm những sản phẩm bạn thích vào đây nhé!</Text>
          <TouchableOpacity 
            style={styles.shopNowBtn}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.shopNowText}>Khám phá ngay</Text>
          </TouchableOpacity>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  listContent: {
    padding: 24,
  },
  removeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    backgroundColor: "#FFF5F5",
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
});
