import { useState, useCallback } from "react";

export function useLocalStorage(
  key: string,
  initialValue: string
): [string, (v: string) => void, () => void] {
  const [value, setValue] = useState<string>(() => {
    try {
      return localStorage.getItem(key) ?? initialValue;
    } catch {
      return initialValue;
    }
  });

  const set = useCallback(
    (v: string) => {
      try {
        localStorage.setItem(key, v);
        setValue(v);
      } catch {
        // localStorage full or unavailable
      }
    },
    [key]
  );

  const remove = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setValue(initialValue);
    } catch {
      // ignore
    }
  }, [key, initialValue]);

  return [value, set, remove];
}
