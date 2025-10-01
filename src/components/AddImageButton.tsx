import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

const { width } = Dimensions.get('window');

interface AddImageButtonProps {
  onPress?: () => void;
  style?: any;
}

export const AddImageButton: React.FC<AddImageButtonProps> = ({ 
  onPress, 
  style 
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    button: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      width: Math.min(width * 0.15, 60),
      height: Math.min(width * 0.15, 60),
      borderRadius: Math.min(width * 0.075, 30),
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
      zIndex: 1000,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name="add" size={Math.min(width * 0.08, 32)} color="white" />
    </TouchableOpacity>
  );
};
