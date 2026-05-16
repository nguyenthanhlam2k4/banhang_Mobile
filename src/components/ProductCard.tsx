import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Star, ShoppingCart } from "lucide-react-native";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) 
    : 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.card}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images[0] || "https://via.placeholder.com/150" }}
          style={styles.image}
          resizeMode="cover"
        />
        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.brandText}>{product.brand}</Text>
        <Text style={styles.nameText} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.ratingContainer}>
          <Star size={12} color="#FFD700" fill="#FFD700" />
          <Text style={styles.ratingText}>
            {product.rating} ({product.numReviews})
          </Text>
        </View>

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.priceText}>${product.price}</Text>
            {product.comparePrice ? (
              <Text style={styles.comparePriceText}>${product.comparePrice}</Text>
            ) : null}
          </View>
          
          <TouchableOpacity style={styles.cartButton}>
            <ShoppingCart size={18} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 16,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 160,
    backgroundColor: "#F2F2F7",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FF2D55",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  infoContainer: {
    padding: 12,
  },
  brandText: {
    color: "#8E8E93",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  nameText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
    height: 40,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    color: "#8E8E93",
    fontSize: 11,
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "between",
  },
  priceText: {
    color: "#007AFF",
    fontWeight: "800",
    fontSize: 16,
  },
  comparePriceText: {
    color: "#C7C7CC",
    fontSize: 11,
    textDecorationLine: "line-through",
  },
  cartButton: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    padding: 8,
    borderRadius: 12,
    marginLeft: 'auto'
  },
});
