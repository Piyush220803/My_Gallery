import * as Sharing from "expo-sharing";
import { Platform, Alert } from "react-native";
import { GalleryItem } from "../types";

export class SharingService {
  private static instance: SharingService;

  static getInstance(): SharingService {
    if (!SharingService.instance) {
      SharingService.instance = new SharingService();
    }
    return SharingService.instance;
  }

  async shareImage(item: GalleryItem, customCaption?: string): Promise<void> {
    try {
      if (Platform.OS === "web") {
        await this.shareOnWeb(item, customCaption);
      } else {
        await this.shareOnMobile(item, customCaption);
      }
    } catch (error) {
      console.error("Share image error:", error);
      throw error;
    }
  }

  private async shareOnWeb(
    item: GalleryItem,
    customCaption?: string
  ): Promise<void> {
    try {
      const link = document.createElement("a");
      link.href = item.uri;
      link.download = `gallery-item-${item.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      const captionToShare = customCaption || item.caption;
      if (captionToShare && navigator.clipboard) {
        await navigator.clipboard.writeText(captionToShare);
        Alert.alert(
          "Success",
          "Image downloaded and caption copied to clipboard"
        );
      }
    } catch (error) {
      console.error("Web share error:", error);
      throw error;
    }
  }

  private async shareOnMobile(
    item: GalleryItem,
    customCaption?: string
  ): Promise<void> {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        throw new Error("Sharing is not available on this device");
      }
      const captionToShare = customCaption || item.caption;

      await Sharing.shareAsync(item.uri, {
        mimeType: "image/jpeg",
        dialogTitle: captionToShare
          ? `Share: ${captionToShare}`
          : "Share Image",
        UTI: "public.jpeg",
      });

      if (captionToShare) {
        Alert.alert("Caption", captionToShare, [
          { text: "OK", style: "default" },
          {
            text: "Copy Caption",
            onPress: () => {
              if (Platform.OS === "web" && navigator.clipboard) {
                navigator.clipboard.writeText(captionToShare);
              }
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Mobile share error:", error);
      throw error;
    }
  }

  async shareMultipleImages(
    items: GalleryItem[],
    customCaption?: string
  ): Promise<void> {
    try {
      if (items.length === 0) {
        throw new Error("No images to share");
      }

      if (items.length === 1) {
        await this.shareImage(items[0], customCaption);
        return;
      }
      for (const item of items) {
        await this.shareImage(item, customCaption);
      }
    } catch (error) {
      console.error("Share multiple images error:", error);
      throw error;
    }
  }

  async shareWithCustomCaption(
    item: GalleryItem,
    caption: string
  ): Promise<void> {
    return this.shareImage(item, caption);
  }
}
