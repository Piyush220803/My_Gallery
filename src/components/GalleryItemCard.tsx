import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Modal,
  PanResponder,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useGallery } from '../hooks/useGallery';
import { SharingService } from '../services/sharingService';
import { GalleryItem } from '../types';

const { width, height } = Dimensions.get('window');
const isTablet = width > 768;
const numColumns = isTablet ? 3 : 2;
const ITEM_SIZE = isTablet ? (width - 120) / 3 : (width - 100) / 2;

interface GalleryItemCardProps {
  item: GalleryItem;
}

export const GalleryItemCard: React.FC<GalleryItemCardProps> = ({ item }) => {
  const { theme } = useTheme();
  const { deleteItem } = useGallery();
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [panY] = useState(new Animated.Value(0));

  const sharingService = SharingService.getInstance();

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

  const handlePress = () => {
    setShowPreview(true);
  };

  const handleLongPress = () => {
    Alert.alert(
      'Image Options',
      'What would you like to do?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: handleShare },
        { text: 'Delete', style: 'destructive', onPress: handleDelete },
      ]
    );
  };

  const handleShare = async () => {
    try {
      setIsLoading(true);
      await sharingService.shareImage(item);
    } catch (error) {
      Alert.alert('Error', 'Failed to share image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleDelete = () => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: confirmDelete },
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      await deleteItem(item.id);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete image. Please try again.');
    }
  };

  const styles = StyleSheet.create({
    container: {
      width: ITEM_SIZE,
      marginBottom: theme.spacing.lg,
    },
    imageContainer: {
      position: 'relative',
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    image: {
      width: ITEM_SIZE,
      height: ITEM_SIZE,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      borderRadius: theme.borderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0,
    },
    overlayVisible: {
      opacity: 1,
    },
    overlayIcon: {
      fontSize: Math.min(width * 0.06, 24),
      color: 'white',
      marginBottom: theme.spacing.xs,
    },
    overlayText: {
      color: 'white',
      fontSize: Math.min(width * 0.03, 12),
      fontWeight: '600',
    },
    captionContainer: {
      paddingTop: theme.spacing.md,
      paddingHorizontal: theme.spacing.xs,
    },
    captionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.xs,
    },
    caption: {
      fontSize: Math.min(width * 0.035, 14),
      color: theme.colors.text,
      lineHeight: Math.min(width * 0.05, 20),
      fontWeight: '500',
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    shareButton: {
      padding: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.accent,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    date: {
      fontSize: Math.min(width * 0.03, 12),
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
      fontWeight: '500',
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.borderRadius.lg,
    },
    loadingText: {
      color: 'white',
      fontSize: Math.min(width * 0.03, 12),
      fontWeight: '600',
      marginTop: theme.spacing.xs,
    },
    previewModal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.95)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    previewImage: {
      width: width * 0.95,
      height: height * 0.7,
      resizeMode: 'contain',
      borderRadius: theme.borderRadius.lg,
    },
    previewCloseButton: {
      position: 'absolute',
      top: 60,
      right: 20,
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderRadius: 25,
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    previewHeader: {
      position: 'absolute',
      top: 60,
      left: 20,
      right: 80,
      backgroundColor: 'rgba(0,0,0,0.7)',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backdropFilter: 'blur(10px)',
    },
    previewTitle: {
      color: 'white',
      fontSize: Math.min(width * 0.05, 20),
      fontWeight: '700',
      marginBottom: theme.spacing.xs,
    },
    previewDate: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: Math.min(width * 0.035, 14),
      fontWeight: '500',
    },
    previewCaption: {
      position: 'absolute',
      bottom: 60,
      left: 20,
      right: 20,
      backgroundColor: 'rgba(0,0,0,0.8)',
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      backdropFilter: 'blur(10px)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
    },
    previewCaptionLabel: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: Math.min(width * 0.035, 14),
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    previewCaptionText: {
      color: 'white',
      fontSize: Math.min(width * 0.045, 18),
      fontWeight: '500',
      lineHeight: Math.min(width * 0.06, 24),
      textAlign: 'center',
    },
    previewDetails: {
      position: 'absolute',
      bottom: 60,
      left: 20,
      right: 20,
      backgroundColor: 'rgba(0,0,0,0.8)',
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      backdropFilter: 'blur(10px)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
    },
    previewDetailsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    previewDetailsLabel: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: Math.min(width * 0.035, 14),
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    previewDetailsValue: {
      color: 'white',
      fontSize: Math.min(width * 0.04, 16),
      fontWeight: '500',
    },
    swipeIndicator: {
      position: 'absolute',
      top: 20,
      left: '50%',
      marginLeft: -20,
      width: 40,
      height: 4,
      backgroundColor: 'rgba(255,255,255,0.5)',
      borderRadius: 2,
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.uri }} style={styles.image} />
        <View style={[styles.overlay, styles.overlayVisible]}>
          <Ionicons name="eye" style={styles.overlayIcon} />
          <Text style={styles.overlayText}>Tap to view</Text>
        </View>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <Ionicons name="share" size={Math.min(width * 0.05, 20)} color="white" />
            <Text style={styles.loadingText}>Sharing...</Text>
          </View>
        )}
      </View>
      
      <View style={styles.captionContainer}>
        <View style={styles.captionHeader}>
          <Text style={styles.caption} numberOfLines={2}>
            {item.caption || 'No caption'}
          </Text>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Ionicons
              name="share"
              size={Math.min(width * 0.04, 16)}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.date}>
          {item.createdAt.toLocaleDateString()}
        </Text>
      </View>

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

          <TouchableOpacity
            style={[styles.previewCloseButton, { right: 80 }]}
            onPress={() => {
              setShowPreview(false);
              handleShare();
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="share" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>Gallery Item</Text>
            <Text style={styles.previewDate}>
              {item.createdAt.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
          
          <Image source={{ uri: item.uri }} style={styles.previewImage} />
          
          <View style={styles.previewDetails}>
            <View style={styles.previewDetailsRow}>
              <Text style={styles.previewDetailsLabel}>Added</Text>
              <Text style={styles.previewDetailsValue}>
                {item.createdAt.toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.previewDetailsRow}>
              <Text style={styles.previewDetailsLabel}>Time</Text>
              <Text style={styles.previewDetailsValue}>
                {item.createdAt.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </Text>
            </View>
            
            <View style={styles.previewDetailsRow}>
              <Text style={styles.previewDetailsLabel}>Days Ago</Text>
              <Text style={styles.previewDetailsValue}>
                {Math.floor((Date.now() - item.createdAt.getTime()) / (1000 * 60 * 60 * 24))} days
              </Text>
            </View>
            
            {item.caption && (
              <>
                <View style={{ height: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', marginVertical: theme.spacing.sm }} />
                <Text style={styles.previewCaptionLabel}>Caption</Text>
                <Text style={styles.previewCaptionText}>{item.caption}</Text>
              </>
            )}
          </View>
        </Animated.View>
      </Modal>

    </TouchableOpacity>
  );
};
