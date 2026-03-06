import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  
  // Initialize state by checking Local Storage first
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      // If data is found under this key, parse it back into JSON. Otherwise, use defined mock data.
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage", error);
      return initialValue;
    }
  });

  // Create a modified setter function that updates state AND Local Storage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Update React State
      setStoredValue(valueToStore);
      
      // Update the Browser's Hard Drive
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error setting localStorage", error);
    }
  };

  return [storedValue, setValue] as const;
}