export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export interface GalleryItem {
  id: string;
  uri: string;
  caption: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface GalleryState {
  items: GalleryItem[];
  isLoading: boolean;
  error: string | null;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Gallery: undefined;
  Profile: undefined;
};

export type GalleryStackParamList = {
  GalleryList: undefined;
  AddImage: undefined;
  ImageDetail: { item: GalleryItem };
};
