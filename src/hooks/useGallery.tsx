import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { StorageService } from '../services/storageService';
import { GalleryItem, GalleryState } from '../types';

interface GalleryContextType extends GalleryState {
  addItem: (item: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateItem: (item: GalleryItem) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  refreshItems: () => Promise<void>;
  clearAllData: () => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const useGallery = (): GalleryContextType => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};

interface GalleryProviderProps {
  children: ReactNode;
}

export const GalleryProvider = ({ children }: GalleryProviderProps) => {
  const [galleryState, setGalleryState] = useState<GalleryState>({
    items: [],
    isLoading: false,
    error: null,
  });

  const storageService = StorageService.getInstance();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setGalleryState(prev => ({ ...prev, isLoading: true, error: null }));
      const items = await storageService.getGalleryItems();
      setGalleryState({
        items,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Load items error:', error);
      setGalleryState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load gallery items',
      }));
    }
  };

  const addItem = async (itemData: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setGalleryState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const newItem: GalleryItem = {
        ...itemData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await storageService.saveGalleryItem(newItem);
      
      setGalleryState(prev => ({
        ...prev,
        items: [...prev.items, newItem],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Add item error:', error);
      setGalleryState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to add gallery item',
      }));
      throw error;
    }
  };

  const updateItem = async (item: GalleryItem) => {
    try {
      setGalleryState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await storageService.updateGalleryItem(item);
      
      setGalleryState(prev => ({
        ...prev,
        items: prev.items.map(i => i.id === item.id ? item : i),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Update item error:', error);
      setGalleryState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to update gallery item',
      }));
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      setGalleryState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await storageService.deleteGalleryItem(id);
      
      setGalleryState(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Delete item error:', error);
      setGalleryState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to delete gallery item',
      }));
      throw error;
    }
  };

  const refreshItems = async () => {
    await loadItems();
  };

  const clearAllData = async () => {
    try {
      setGalleryState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await storageService.clearAllData();
      
      setGalleryState({
        items: [],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Clear all data error:', error);
      setGalleryState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to clear all data',
      }));
      throw error;
    }
  };

  const value: GalleryContextType = {
    ...galleryState,
    addItem,
    updateItem,
    deleteItem,
    refreshItems,
    clearAllData,
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};
