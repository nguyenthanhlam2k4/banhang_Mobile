import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "./MainTabNavigator";
import LoginScreen from "../screens/LoginScreen";
import AdminDashboard from "../screens/admin/AdminDashboard";
import AdminProductsList from "../screens/admin/AdminProductsList";
import AdminProductForm from "../screens/admin/AdminProductForm";
import AdminCategoriesList from "../screens/admin/AdminCategoriesList";
import AdminCategoryForm from "../screens/admin/AdminCategoryForm";
import { useAuthStore } from "../store/useAuthStore";

import ProductDetailScreen from "../screens/ProductDetailScreen";
import CategoryProductsScreen from "../screens/CategoryProductsScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";
import WishlistScreen from "../screens/WishlistScreen";
import AddressScreen from "../screens/AddressScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user } = useAuthStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          
          {/* Shop Screens */}
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
          <Stack.Screen name="Wishlist" component={WishlistScreen} />
          <Stack.Screen name="Address" component={AddressScreen} />

          {/* Admin Screens */}
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="AdminProductsList" component={AdminProductsList} />
          <Stack.Screen name="AdminProductForm" component={AdminProductForm} />
          <Stack.Screen name="AdminCategoriesList" component={AdminCategoriesList} />
          <Stack.Screen name="AdminCategoryForm" component={AdminCategoryForm} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}
