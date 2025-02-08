const localStorageService = {
  setItem: <T>(key: string, value: T): void => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error("Error setting item in localStorage:", error);
      // Handle the error appropriately, e.g., show a user-friendly message
    }
  },

  getItem: <T>(key: string): T | null => {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return null;
      }
      const value: T = JSON.parse(serializedValue);
      return value;
    } catch (error) {
      console.error("Error getting item from localStorage:", error);
      return null; // Or throw the error if you prefer
    }
  },

  addItemToArray: <T extends { id: string }>(key: string, newItem: T): void => {
    try {
      const existingItems = localStorageService.getItem<T[]>(key) || []; // Get existing or create empty
      if (existingItems.filter((item) => item.id === newItem.id).length > 0) {
        const newItems = existingItems.map((item) =>
          item.id === newItem.id ? { ...item, ...newItem } : item
        );
        localStorageService.setItem(key, newItems);
      } else {
        existingItems.push(newItem);
        localStorageService.setItem(key, existingItems);
      }
    } catch (error) {
      console.error("Error adding item to array in localStorage:", error);
    }
  },

  removeItemFromArray: <T extends { id: string }>(
    key: string,
    idToRemove: string
  ): void => {
    try {
      const existingItems = localStorageService.getItem<T[]>(key) || [];

      const newItems = existingItems.filter((item) => item.id !== idToRemove);

      localStorageService.setItem(key, newItems);
    } catch (error) {
      console.error("Error removing item from array in localStorage:", error);
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing item from localStorage:", error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};

export default localStorageService;
