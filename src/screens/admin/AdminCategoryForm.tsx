import React, { useState } from "react";
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
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { ChevronLeft, Save, Image as ImageIcon, X } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import apiClient from "../../api/client";

export default function AdminCategoryForm() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const editingCategory = route.params?.category;

  const [name, setName] = useState(editingCategory?.name || "");
  const [slug, setSlug] = useState(editingCategory?.slug || "");
  const [imageUrl, setImageUrl] = useState(editingCategory?.image || "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.IMAGES,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    setUploading(true);
    try {
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

      if (res.data.success) {
        setImageUrl(res.data.url);
      }
    } catch (error) {
      Alert.alert("Upload Failed", "Could not upload image to server");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name || !slug) {
      Alert.alert("Error", "Please fill in Name and Slug");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        slug: slug.toLowerCase().replace(/ /g, "-"),
        image: imageUrl,
      };

      if (editingCategory) {
        await apiClient.put(`/admin/categories/${editingCategory._id}`, payload);
      } else {
        await apiClient.post("/admin/categories", payload);
      }
      
      Alert.alert("Success", "Category saved successfully");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to save category");
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
        <Text style={styles.title}>{editingCategory ? "Edit Category" : "New Category"}</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#007AFF" /> : <Save size={24} color="#007AFF" />}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.form}>
          <Text style={styles.label}>Category Name *</Text>
          <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={(text) => {
              setName(text);
              if (!editingCategory) setSlug(text.toLowerCase().replace(/ /g, "-"));
            }} 
            placeholder="e.g. Smartphones"
          />

          <Text style={styles.label}>Slug *</Text>
          <TextInput 
            style={styles.input} 
            value={slug} 
            onChangeText={setSlug} 
            placeholder="e.g. smartphones"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Category Image</Text>
          <View style={styles.imagePickerContainer}>
            {imageUrl ? (
              <View style={styles.previewContainer}>
                <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
                <TouchableOpacity 
                  style={styles.removeImageBtn} 
                  onPress={() => setImageUrl("")}
                >
                  <X size={16} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.pickerBtn} 
                onPress={pickImage}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator color="#007AFF" />
                ) : (
                  <>
                    <ImageIcon size={32} color="#8E8E93" />
                    <Text style={styles.pickerBtnText}>Pick an image</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity 
            style={styles.submitBtn} 
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.submitBtnText}>{editingCategory ? "Update Category" : "Create Category"}</Text>
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
  submitBtn: { 
    backgroundColor: "#007AFF", 
    padding: 16, 
    borderRadius: 16, 
    alignItems: "center",
    marginTop: 10
  },
  submitBtnText: { color: "white", fontSize: 18, fontWeight: "bold" },
  imagePickerContainer: { marginBottom: 20 },
  pickerBtn: {
    height: 120,
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  pickerBtnText: { color: "#8E8E93", marginTop: 8, fontSize: 14 },
  previewContainer: {
    position: "relative",
    width: "100%",
    height: 150,
    borderRadius: 16,
    overflow: "hidden",
  },
  imagePreview: { width: "100%", height: "100%" },
  removeImageBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
});
