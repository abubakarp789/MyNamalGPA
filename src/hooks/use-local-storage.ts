import { useState, useEffect } from "react";
import { safeJSONParse } from "@/lib/security";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Get stored value on initial render
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Use safe JSON parsing with prototype pollution protection
      return item ? safeJSONParse(item, initialValue) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
 
   // Update localStorage when value changes
   useEffect(() => {
     try {
       window.localStorage.setItem(key, JSON.stringify(storedValue));
     } catch (error) {
       console.warn(`Error setting localStorage key "${key}":`, error);
     }
   }, [key, storedValue]);
 
   return [storedValue, setStoredValue];
 }