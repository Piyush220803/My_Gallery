import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';

export class ImageService {
  private static instance: ImageService;

  static getInstance(): ImageService {
    if (!ImageService.instance) {
      ImageService.instance = new ImageService();
    }
    return ImageService.instance;
  }

  async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS !== 'web') {
        console.log('Requesting media library permissions...');
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log('Media library permission status:', status);
        if (status !== 'granted') {
          console.warn('Media library permission denied');
          return false;
        }

        console.log('Requesting camera permissions...');
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        console.log('Camera permission status:', cameraStatus.status);
        if (cameraStatus.status !== 'granted') {
          console.warn('Camera permission denied');
          return false;
        }
      }
      console.log('All permissions granted');
      return true;
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  }

  async pickImageFromLibrary(): Promise<ImagePicker.ImagePickerResult> {
    try {
      console.log('Starting image picker from library...');
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Permission denied - please grant camera and photo library access');
      }

      console.log('Launching image library...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      console.log('Image picker result:', result);
      return result;
    } catch (error) {
      console.error('Pick image from library error:', error);
      throw error;
    }
  }

  async takePhoto(): Promise<ImagePicker.ImagePickerResult> {
    try {
      console.log('Starting camera...');
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Permission denied - please grant camera and photo library access');
      }

      console.log('Launching camera...');
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
      });

      console.log('Camera result:', result);
      return result;
    } catch (error) {
      console.error('Take photo error:', error);
      throw error;
    }
  }

  async saveToGallery(uri: string): Promise<string> {
    try {
      if (Platform.OS !== 'web') {
        const asset = await MediaLibrary.createAssetAsync(uri);
        return asset.uri;
      }
      return uri;
    } catch (error) {
      console.error('Save to gallery error:', error);
      throw error;
    }
  }
}
