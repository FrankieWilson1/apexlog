/**
 * @file useLocalStorage.ts
 * @description A generic, typed React hook that synchronises state with localStorage.
 *
 * Provides the same API as `useState` but automatically:
 * - Reads the initial value from `localStorage` on first render.
 * - Persists every update back to `localStorage` as serialised JSON.
 *
 * Used throughout ApexLog as the primary persistence layer for workout
 * history, active workout state, user settings, and the timer start time.
 *
 * @module hooks/useLocalStorage
 */

import { useState } from "react";

/**
 * useLocalStorage
 *
 * A drop-in replacement for `useState` that keeps its value in sync with
 * `localStorage`. The value is serialised to JSON on write and deserialised
 * on read, making it suitable for any JSON-compatible type.
 *
 * @template T - The type of the stored value.
 *
 * @param {string} key          - The `localStorage` key to bind to.
 * @param {T}      initialValue - Fallback value used when the key doesn't exist
 *                                or contains invalid JSON.
 *
 * @returns {readonly [T, (value: T | ((val: T) => T)) => void]}
 *   A `[value, setter]` tuple identical to the `useState` API.
 *
 * @example
 * // Persist a number counter
 * const [count, setCount] = useLocalStorage<number>("visit_count", 0);
 * setCount(prev => prev + 1);
 *
 * @example
 * // Persist an array of workout summaries
 * const [history, setHistory] = useLocalStorage<WorkoutSummary[]>(historyKey, []);
 * setHistory(prev => [newWorkout, ...prev]);
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  /**
   * Lazily initialise state from `localStorage`.
   * If the key exists and contains valid JSON, that value is used.
   * Otherwise falls back to `initialValue` — this covers both first-time
   * users (key missing) and corrupted storage (invalid JSON).
   */
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`[useLocalStorage] Failed to read key "${key}":`, error);
      return initialValue;
    }
  });

  /**
   * setValue
   *
   * Updates both React state and `localStorage` atomically.
   * Supports functional updates identical to React's `useState` setter,
   * allowing patterns like `setValue(prev => [...prev, newItem])`.
   *
   * @param {T | ((val: T) => T)} value - New value, or an updater function
   *                                      that receives the current value.
   */
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Resolve functional updates before persisting
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Update React state to trigger a re-render
      setStoredValue(valueToStore);

      // Persist to localStorage so the value survives page refreshes
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`[useLocalStorage] Failed to write key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
