import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { GalleryItem } from "../types";

const GALLERY_KEY = "gallery_items";

export class StorageService {
  private static instance: StorageService;

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async saveGalleryItem(item: GalleryItem): Promise<void> {
    try {
      const existingItems = await this.getGalleryItems();
      const updatedItems = [...existingItems, item];
      await AsyncStorage.setItem(GALLERY_KEY, JSON.stringify(updatedItems));
    } catch (error) {
      console.error("Save gallery item error:", error);
      throw error;
    }
  }

  async getGalleryItems(): Promise<GalleryItem[]> {
    try {
      const items = await AsyncStorage.getItem(GALLERY_KEY);
      if (items) {
        const parsedItems = JSON.parse(items);
        // Convert date strings back to Date objects
        return parsedItems.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));
      }
      return [];
    } catch (error) {
      console.error("Get gallery items error:", error);
      return [];
    }
  }

  async updateGalleryItem(updatedItem: GalleryItem): Promise<void> {
    try {
      const items = await this.getGalleryItems();
      const updatedItems = items.map((item) =>
        item.id === updatedItem.id
          ? { ...updatedItem, updatedAt: new Date() }
          : item
      );
      await AsyncStorage.setItem(GALLERY_KEY, JSON.stringify(updatedItems));
    } catch (error) {
      console.error("Update gallery item error:", error);
      throw error;
    }
  }

  async deleteGalleryItem(itemId: string): Promise<void> {
    try {
      const items = await this.getGalleryItems();
      const filteredItems = items.filter((item) => item.id !== itemId);
      await AsyncStorage.setItem(GALLERY_KEY, JSON.stringify(filteredItems));
    } catch (error) {
      console.error("Delete gallery item error:", error);
      throw error;
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(GALLERY_KEY);
    } catch (error) {
      console.error("Clear all data error:", error);
      throw error;
    }
  }
}
