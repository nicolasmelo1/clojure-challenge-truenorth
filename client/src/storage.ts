import { StorageApi } from "./features/utils";

export const storage: StorageApi = {
  getItem: (item: string) => localStorage.getItem(item),
  setItem: (item: string, value: string) => localStorage.setItem(item, value),
  removeItem: (item: string) => localStorage.removeItem(item),
};

export const secureStorage: StorageApi = {
  getItem: (item: string) => localStorage.getItemAsync(item),
  setItem: (item: string, value: string) =>
    localStorage.setItemAsync(item, value),
  removeItem: (item: string) => localStorage.deleteItemAsync(item),
};
