/**
 * @file lib/hooks/useLocalStorage.ts
 * @description Custom React hook for synchronized state persistence with browser local storage.
 */

import { useState, useEffect } from "react";

/** Custom hook that synchronizes a React state variable with local storage. */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  /** Loads the stored value from local storage on initial mount or key change. */
  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  /** Updates the state and persists the new value to local storage. */
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      });
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
