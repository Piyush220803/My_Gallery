import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Modal,
  PanResponder,
  Animated,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useGallery } from "../hooks/useGallery";
import { useTheme } from "../hooks/useTheme";
import { ImageService } from "../services/imageService";

const { width, height } = Dimensions.get("window");
const isTablet = width > 768;

export const AddImageScreen: React.FC = () => {
  const navigation = useNavigation();
  const { addItem } = useGallery();
  const { theme } = useTheme();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [panY] = useState(new Animated.Value(0));

  const imageService = ImageService.getInstance();

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 10;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        panY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100) {
        Animated.timing(panY, {
          toValue: height,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setShowPreview(false);
          panY.setValue(0);
        });
      } else {
        Animated.spring(panY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const handlePickImage = async () => {
    try {
      console.log("AddImageScreen: Starting to pick image from library");
      setIsLoading(true);
      const result = await imageService.pickImageFromLibrary();

      console.log("AddImageScreen: Image picker result:", result);
      if (!result.canceled && result.assets && result.assets[0]) {
        console.log(
          "AddImageScreen: Setting selected image:",
          result.assets[0].uri
        );
        setSelectedImage(result.assets[0].uri);
      } else {
        console.log("AddImageScreen: Image picker was canceled or no assets");
      }
    } catch (error: any) {
      console.error("AddImageScreen: Error picking image:", error);
      Alert.alert(
        "Error",
        `Failed to pick image: ${error?.message || "Please try again."}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      console.log("AddImageScreen: Starting to take photo");
      setIsLoading(true);
      const result = await imageService.takePhoto();

      console.log("AddImageScreen: Camera result:", result);
      if (!result.canceled && result.assets && result.assets[0]) {
        console.log(
          "AddImageScreen: Setting selected image from camera:",
          result.assets[0].uri
        );
        setSelectedImage(result.assets[0].uri);
      } else {
        console.log("AddImageScreen: Camera was canceled or no assets");
      }
    } catch (error: any) {
      console.error("AddImageScreen: Error taking photo:", error);
      Alert.alert(
        "Error",
        `Failed to take photo: ${error?.message || "Please try again."}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedImage) {
      Alert.alert("Error", "Please select an image first.");
      return;
    }

    try {
      console.log("AddImageScreen: Starting to save image:", selectedImage);
      console.log("AddImageScreen: Caption:", caption);
      setIsLoading(true);

      await addItem({
        uri: selectedImage,
        caption: caption.trim(),
      });

      console.log("AddImageScreen: Image saved successfully");
      Alert.alert("Success", "Image added to gallery!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error("AddImageScreen: Error saving image:", error);
      Alert.alert(
        "Error",
        `Failed to save image: ${error?.message || "Please try again."}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.xl * 2, // Extra padding for save button
    },
    imageContainer: {
      alignItems: "center",
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    imageWrapper: {
      position: "relative",
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    image: {
      width: isTablet ? Math.min(width * 0.4, 300) : width * 0.7,
      height: isTablet ? Math.min(width * 0.4, 300) : width * 0.7,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
    },
    placeholder: {
      width: isTablet ? Math.min(width * 0.4, 300) : width * 0.7,
      height: isTablet ? Math.min(width * 0.4, 300) : width * 0.7,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: theme.colors.border,
      borderStyle: "dashed",
    },
    placeholderIcon: {
      fontSize: Math.min(width * 0.12, 48),
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
    },
    placeholderText: {
      color: theme.colors.textSecondary,
      textAlign: "center",
      fontSize: Math.min(width * 0.04, 16),
      fontWeight: "500",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.sm,
    },
    button: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      marginHorizontal: theme.spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    buttonText: {
      color: "white",
      textAlign: "center",
      fontWeight: "700",
      fontSize: Math.min(width * 0.04, 16),
      marginLeft: theme.spacing.sm,
    },
    captionContainer: {
      marginBottom: theme.spacing.lg,
    },
    captionLabel: {
      fontSize: Math.min(width * 0.045, 18),
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    captionInput: {
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      fontSize: Math.min(width * 0.04, 16),
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
      minHeight: isTablet ? 100 : 120,
      textAlignVertical: "top",
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    saveButton: {
      backgroundColor: theme.colors.success,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: theme.colors.success,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    saveButtonText: {
      color: "white",
      textAlign: "center",
      fontSize: Math.min(width * 0.04, 16),
      fontWeight: "700",
      marginLeft: theme.spacing.sm,
    },
    loadingContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.7)",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: theme.borderRadius.lg,
    },
    loadingText: {
      color: "white",
      fontSize: Math.min(width * 0.04, 16),
      fontWeight: "600",
      marginTop: theme.spacing.md,
    },
    previewModal: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.95)",
      justifyContent: "center",
      alignItems: "center",
    },
    previewImage: {
      width: width * 0.95,
      height: height * 0.75,
      resizeMode: "contain",
      borderRadius: theme.borderRadius.lg,
    },
    previewCloseButton: {
      position: "absolute",
      top: 60,
      right: 20,
      backgroundColor: "rgba(0,0,0,0.7)",
      borderRadius: 25,
      width: 50,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    previewHeader: {
      position: "absolute",
      top: 60,
      left: 20,
      right: 80,
      backgroundColor: "rgba(0,0,0,0.7)",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
    },
    previewTitle: {
      color: "white",
      fontSize: Math.min(width * 0.05, 20),
      fontWeight: "700",
      marginBottom: theme.spacing.xs,
    },
    previewSubtitle: {
      color: "rgba(255,255,255,0.8)",
      fontSize: Math.min(width * 0.035, 14),
      fontWeight: "500",
    },
    previewCaption: {
      position: "absolute",
      bottom: 60,
      left: 20,
      right: 20,
      backgroundColor: "rgba(0,0,0,0.8)",
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
    },
    previewCaptionText: {
      color: "white",
      fontSize: Math.min(width * 0.045, 18),
      fontWeight: "500",
      lineHeight: Math.min(width * 0.06, 24),
      textAlign: "center",
    },
    previewCaptionLabel: {
      color: "rgba(255,255,255,0.7)",
      fontSize: Math.min(width * 0.035, 14),
      fontWeight: "600",
      textAlign: "center",
      marginBottom: theme.spacing.sm,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    swipeIndicator: {
      position: "absolute",
      top: 20,
      left: "50%",
      marginLeft: -20,
      width: 40,
      height: 4,
      backgroundColor: "rgba(255,255,255,0.5)",
      borderRadius: 2,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <StatusBar
        barStyle={
          theme.colors.text === "#F9FAFB" ? "light-content" : "dark-content"
        }
      />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            {selectedImage ? (
              <TouchableOpacity
                onPress={() => setShowPreview(true)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: selectedImage }} style={styles.image} />
              </TouchableOpacity>
            ) : (
              <View style={styles.placeholder}>
                <Ionicons name="image-outline" style={styles.placeholderIcon} />
                <Text style={styles.placeholderText}>
                  Select an image to get started
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handlePickImage}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Ionicons
              name="images"
              size={Math.min(width * 0.05, 20)}
              color="white"
            />
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleTakePhoto}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Ionicons
              name="camera"
              size={Math.min(width * 0.05, 20)}
              color="white"
            />
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.captionContainer}>
          <Text style={styles.captionLabel}>Add a Caption</Text>
          <TextInput
            style={styles.captionInput}
            value={caption}
            onChangeText={setCaption}
            placeholder="Describe your image..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
          />
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            (!selectedImage || isLoading) && { opacity: 0.6 },
          ]}
          onPress={handleSave}
          disabled={!selectedImage || isLoading}
          activeOpacity={0.8}
        >
          <Ionicons
            name="checkmark-circle"
            size={Math.min(width * 0.05, 20)}
            color="white"
          />
          <Text style={styles.saveButtonText}>Save to Gallery</Text>
        </TouchableOpacity>
      </ScrollView>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      )}

      <Modal
        visible={showPreview}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPreview(false)}
      >
        <Animated.View
          style={[
            styles.previewModal,
            {
              transform: [{ translateY: panY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.swipeIndicator} />

          <TouchableOpacity
            style={styles.previewCloseButton}
            onPress={() => setShowPreview(false)}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>Image Preview</Text>
            <Text style={styles.previewSubtitle}>Tap outside to close</Text>
          </View>

          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.previewImage}
            />
          )}

          <View style={styles.previewCaption}>
            <Text style={styles.previewCaptionLabel}>Caption</Text>
            <Text style={styles.previewCaptionText}>
              {caption.trim() || "No caption added yet"}
            </Text>
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};
