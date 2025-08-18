import AsyncStorage from '@react-native-async-storage/async-storage';

// Store Names Management
export const saveStoreName = async (storeName: string) => {
    try {
      const existingStores = await AsyncStorage.getItem('storeNames');
      const stores = existingStores ? JSON.parse(existingStores) : [];
      
      // Only add if store name doesn't already exist (case-insensitive)
      const storeExists = stores.some((store: string) => 
        store.toLowerCase() === storeName.toLowerCase()
      );
      
      if (!storeExists) {
        stores.push(storeName);
        // Sort alphabetically for better organization
        stores.sort((a: string, b: string) => a.localeCompare(b));
        await AsyncStorage.setItem('storeNames', JSON.stringify(stores));
        console.log('Store name saved:', storeName);
      } else {
        console.log('Store name already exists:', storeName);
      }
    } catch (error) {
      console.error('Error saving store name:', error);
    }
  };