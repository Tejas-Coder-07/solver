'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

export function useDemoState<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const storageKey = `gardenia-demo:${key}`;
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved !== null) setValue(JSON.parse(saved) as T);
    } catch (error) {
      console.error(`Demo state "${key}" could not be restored:`, error);
    }
  }, [key, storageKey]);

  const persistValue = useCallback<Dispatch<SetStateAction<T>>>((nextValue) => {
    setValue((previous) => {
      const next = typeof nextValue === 'function'
        ? (nextValue as (current: T) => T)(previous)
        : nextValue;
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (error) {
        console.error(`Demo state "${key}" could not be saved:`, error);
      }
      return next;
    });
  }, [key, storageKey]);

  return [value, persistValue];
}
