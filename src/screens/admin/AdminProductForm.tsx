import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  Switch,
  FlatList
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { ChevronLeft, Save, Image as ImageIcon, X, Plus, Trash2 } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import apiClient from "../../api/client";
import { Category } from "../../types";

export default function AdminProductForm() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const editingProduct = route.params?.product;

  const [name, setName] = useState(editingProduct?.name || "");
  const [description, setDescription] = useState(editingProduct?.description || "");
  const [price, setPrice] = useState(editingProduct?.price?.toString() || "");
  const [comparePrice, setComparePrice] = useState(editingProduct?.comparePrice?.toString() || "");
  const [stock, setStock] = useState(editingProduct?.stock?.toString() || "");
  const [brand, setBrand] = useState(editingProduct?.brand || "");
  const [images, setImages] = useState<string[]>(editingProduct?.images || []);
  const [selectedCategory, setSelectedCategory] = useState(editingProduct?.categories[0]?._id || "");
  const [featured, setFeatured] = useState(editingProduct?.featured || false);
  const [specifications, setSpecifications] = useState(editingProduct?.specifications || [{ name: "", value: "" }]);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get("/categories");
      setCategories(res.data.data);
      if (!selectedCategory && res.data.data.length > 0) {
        setSelectedCategory(res.data.data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching categories for form:", error);
    }
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.IMAGES,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      uploadImages(result.assets.map(a => a.uri));
    }
  };

  const uploadImages = async (uris: string[]) => {
    setUploading(true);
    try {
      const uploadPromises = uris.map(async (uri) => {
        const formData = new FormData();
        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('file', {
          uri,
          name: filename,
          type,
        } as any);

        const res = await apiClient.post("/admin/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data.url;
      });

      const newUrls = await Promise.all(uploadPromises);
      setImages([...images, ...newUrls]);
    } catch (error) {
      Alert.alert("Upload Failed", "Could not upload some images to server");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addSpec = () => {
    setSpecifications([...specifications, { name: "", value: "" }]);
  };

  const updateSpec = (index: number, field: 'name' | 'value', value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const removeSpec = (index: number) => {
    setSpecifications(specifications.filter((_: any, i: number) => i !== index));
  };

  const handleSave = async () => {
    if (!name || !price || !selectedCategory || images.length === 0) {
      Alert.alert("Error", "Please fill in required fields (including at least one image)");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : undefined,
        stock: parseInt(stock) || 0,
        brand,
        images,
        categories: [selectedCategory],
        featured,
        specifications: specifications.filter((s: any) => s.name && s.value)
      };

      if (editingProduct) {
        await apiClient.put(`/admin/products/${editingProduct._id}`, payload);
      } else {
        await apiClient.post("/admin/products", payload);
      }
      
      Alert.alert("Success", "Product saved successfully");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{editingProduct ? "Edit Product" : "New Product"}</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#007AFF" /> : <Save size={24} color="#007AFF" />}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.form} contentContainerStyle={{ paddingBottom: 40 }}>
          <Text style={styles.label}>Product Name *</Text>
          <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
            placeholder="e.g. iPhone 15 Pro"
          />

          <View style={styles.featuredRow}>
            <Text style={styles.label}>Featured Product</Text>
            <Switch 
              value={featured} 
              onValueChange={setFeatured}
              trackColor={{ false: "#D1D1D6", true: "#34C759" }}
            />
          </View>

          <Text style={styles.label}>Description</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            value={description} 
            onChangeText={setDescription} 
            placeholder="Product details..."
            multiline
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Price *</Text>
              <TextInput 
                style={styles.input} 
                value={price} 
                onChangeText={setPrice} 
                keyboardType="numeric"
                placeholder="0.00"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.label}>Compare Price</Text>
              <TextInput 
                style={styles.input} 
                value={comparePrice} 
                onChangeText={setComparePrice} 
                keyboardType="numeric"
                placeholder="0.00"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Stock</Text>
              <TextInput 
                style={styles.input} 
                value={stock} 
                onChangeText={setStock} 
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.label}>Brand</Text>
              <TextInput 
                style={styles.input} 
                value={brand} 
                onChangeText={setBrand} 
                placeholder="Apple"
              />
            </View>
          </View>

          <Text style={styles.label}>Product Images ({images.length})</Text>
          <View style={styles.imagePickerContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((url, index) => (
                <View key={index} style={styles.previewContainer}>
                  <Image source={{ uri: url }} style={styles.imagePreview} />
                  <TouchableOpacity 
                    style={styles.removeImageBtn} 
                    onPress={() => removeImage(index)}
                  >
                    <X size={14} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity 
                style={[styles.pickerBtn, images.length > 0 && styles.pickerBtnSmall]} 
                onPress={pickImages}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator color="#007AFF" />
                ) : (
                  <>
                    <ImageIcon size={images.length > 0 ? 24 : 32} color="#8E8E93" />
                    {images.length === 0 && <Text style={styles.pickerBtnText}>Add images</Text>}
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>

          <Text style={styles.label}>Category *</Text>
          <View style={styles.pickerContainer}>
            {categories.map(cat => (
              <TouchableOpacity 
                key={cat._id}
                style={[
                  styles.categoryOption, 
                  selectedCategory === cat._id && styles.categoryOptionSelected
                ]}
                onPress={() => setSelectedCategory(cat._id)}
              >
                <Text style={[
                  styles.categoryOptionText,
                  selectedCategory === cat._id && styles.categoryOptionTextSelected
                ]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Specifications</Text>
            <TouchableOpacity onPress={addSpec} style={styles.addSpecBtn}>
              <Plus size={16} color="#007AFF" />
              <Text style={styles.addSpecText}>Add</Text>
            </TouchableOpacity>
          </View>

          {specifications.map((spec, index) => (
            <View key={index} style={styles.specRow}>
              <TextInput 
                style={[styles.input, styles.specInput]} 
                value={spec.name} 
                onChangeText={(text) => updateSpec(index, 'name', text)}
                placeholder="Name"
              />
              <TextInput 
                style={[styles.input, styles.specInput]} 
                value={spec.value} 
                onChangeText={(text) => updateSpec(index, 'value', text)}
                placeholder="Value"
              />
              <TouchableOpacity onPress={() => removeSpec(index)} style={styles.removeSpecBtn}>
                <Trash2 size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity 
            style={styles.submitBtn} 
            onPress={handleSave}
            disabled={loading || uploading}
          >
            <Text style={styles.submitBtnText}>{editingProduct ? "Update Product" : "Create Product"}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE"
  },
  title: { fontSize: 20, fontWeight: "bold" },
  form: { padding: 20 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8, color: "#3A3A3C" },
  input: { 
    backgroundColor: "white", 
    borderRadius: 12, 
    padding: 14, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    fontSize: 16
  },
  textArea: { height: 100, textAlignVertical: "top" },
  row: { flexDirection: "row" },
  featuredRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E5EA"
  },
  pickerContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  categoryOption: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    backgroundColor: "#F2F2F7",
    borderWidth: 1,
    borderColor: "#E5E5EA"
  },
  categoryOptionSelected: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  categoryOptionText: { color: "#3A3A3C", fontSize: 14 },
  categoryOptionTextSelected: { color: "white", fontWeight: "bold" },
  imagePickerContainer: { marginBottom: 20, flexDirection: "row" },
  pickerBtn: {
    width: 100,
    height: 100,
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  pickerBtnSmall: {
    width: 80,
    height: 80,
    marginTop: 0,
  },
  pickerBtnText: { color: "#8E8E93", marginTop: 8, fontSize: 12 },
  previewContainer: {
    position: "relative",
    width: 100,
    height: 100,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 12
  },
  imagePreview: { width: "100%", height: "100%" },
  removeImageBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 4,
    borderRadius: 12,
  },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  addSpecBtn: { flexDirection: "row", alignItems: "center" },
  addSpecText: { color: "#007AFF", marginLeft: 4, fontWeight: "600" },
  specRow: { flexDirection: "row", gap: 8, alignItems: "center", marginBottom: 4 },
  specInput: { flex: 1, marginBottom: 12 },
  removeSpecBtn: { padding: 8, marginBottom: 12 },
  submitBtn: { 
    backgroundColor: "#007AFF", 
    padding: 16, 
    borderRadius: 16, 
    alignItems: "center",
    marginTop: 20
  },
  submitBtnText: { color: "white", fontSize: 18, fontWeight: "bold" }
});
