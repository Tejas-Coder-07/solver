'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useRole } from '@/context/RoleContext';

export function useDemoState<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const { currentUser, notify } = useRole();
  const storageKey = `gardenia-demo:v1:${currentUser.email || 'anonymous'}:${key}`;
  const initialValueRef = useRef(initialValue);
  initialValueRef.current = initialValue;
  const [stored, setStored] = useState<{ key: string; value: T }>({ key: storageKey, value: initialValue });
  const [hydratedKey, setHydratedKey] = useState('');
  const value = stored.key === storageKey ? stored.value : initialValue;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      setStored({ key: storageKey, value: saved === null ? initialValueRef.current : JSON.parse(saved) as T });
    } catch (error) {
      notify(`Demo data “${key}” could not be restored from this browser.`, 'error');
      setStored({ key: storageKey, value: initialValueRef.current });
    } finally {
      setHydratedKey(storageKey);
    }
  }, [key, storageKey]);

  useEffect(() => {
    if (hydratedKey !== storageKey || stored.key !== storageKey) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      notify(`Demo data “${key}” could not be saved. Check browser storage settings.`, 'error');
    }
  }, [hydratedKey, key, notify, storageKey, stored.key, value]);

  const persistValue = useCallback<Dispatch<SetStateAction<T>>>((nextValue) => {
    setStored((previousState) => {
      const previous = previousState.key === storageKey ? previousState.value : initialValueRef.current;
      const next = typeof nextValue === 'function'
        ? (nextValue as (current: T) => T)(previous)
        : nextValue;
      return { key: storageKey, value: next };
    });
  }, [key, storageKey]);

  return [value, persistValue];
}
