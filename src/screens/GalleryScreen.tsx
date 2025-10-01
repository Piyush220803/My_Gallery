import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useGallery } from '../hooks/useGallery';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GalleryStackParamList } from '../types';
import { GalleryItem } from '../types';
import { GalleryItemCard } from '../components/GalleryItemCard';
import { AddImageButton } from '../components/AddImageButton';

const { width, height } = Dimensions.get('window');
const ITEM_SIZE = (width - 48) / 2; // 2 columns with padding
const isTablet = width > 768;
const numColumns = isTablet ? 3 : 2;
const responsiveItemSize = isTablet ? (width - 72) / 3 : (width - 48) / 2;

type GalleryScreenNavigationProp = StackNavigationProp<GalleryStackParamList, 'GalleryList'>;

export const GalleryScreen: React.FC = () => {
  const { items, isLoading, error, refreshItems } = useGallery();
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation<GalleryScreenNavigationProp>();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshItems();
    setRefreshing(false);
  };


  const renderItem = ({ item }: { item: GalleryItem }) => (
    <GalleryItemCard item={item} />
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.surface,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
    },
    stat: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: Math.min(width * 0.06, 24),
      fontWeight: '800',
      color: theme.colors.primary,
    },
    statLabel: {
      fontSize: Math.min(width * 0.03, 12),
      color: theme.colors.textSecondary,
      fontWeight: '600',
      marginTop: 2,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    emptyIcon: {
      fontSize: Math.min(width * 0.2, 80),
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.lg,
    },
    emptyText: {
      fontSize: Math.min(width * 0.05, 20),
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      fontWeight: '600',
      lineHeight: Math.min(width * 0.07, 28),
    },
    emptySubtext: {
      fontSize: Math.min(width * 0.04, 16),
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
      opacity: 0.8,
    },
    errorText: {
      fontSize: Math.min(width * 0.04, 16),
      color: theme.colors.error,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    grid: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: 100, // Space for floating button
      alignItems: 'center',
    },
  });

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
        </View>
        <View style={styles.content}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={handleRefresh}>
            <Text style={{ color: theme.colors.primary, textAlign: 'center' }}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar barStyle={theme.colors.text === '#F9FAFB' ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{items.length}</Text>
            <Text style={styles.statLabel}>Photos</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{items.filter(item => item.caption).length}</Text>
            <Text style={styles.statLabel}>With Captions</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              {items.length > 0 ? Math.round(items.reduce((acc, item) => acc + item.caption.length, 0) / items.length) : 0}
            </Text>
            <Text style={styles.statLabel}>Avg Caption</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="images-outline" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>
              Your gallery is empty
            </Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to add your first photo
            </Text>
          </View>
        ) : (
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            columnWrapperStyle={numColumns > 1 ? { justifyContent: 'center', alignItems: 'center', gap: theme.spacing.md } : undefined}
            contentContainerStyle={styles.grid}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={theme.colors.primary}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      
      <AddImageButton onPress={() => navigation.navigate('AddImage')} />
    </SafeAreaView>
  );
};
