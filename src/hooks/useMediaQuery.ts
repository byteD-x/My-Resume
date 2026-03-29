"use client";

import { useSyncExternalStore } from "react";

interface MediaQueryStore {
  media: MediaQueryList | null;
  listeners: Set<() => void>;
  snapshot: boolean;
  handleChange: () => void;
}

const stores = new Map<string, MediaQueryStore>();

function getOrCreateStore(query: string): MediaQueryStore {
  const existing = stores.get(query);
  if (existing) return existing;

  const store: MediaQueryStore = {
    media: null,
    listeners: new Set(),
    snapshot: false,
    handleChange: () => {
      if (!store.media) return;
      const next = store.media.matches;
      if (next === store.snapshot) return;
      store.snapshot = next;
      store.listeners.forEach((listener) => listener());
    },
  };

  stores.set(query, store);
  return store;
}

function startListening(query: string, store: MediaQueryStore) {
  if (typeof window === "undefined" || store.media) return;

  store.media = window.matchMedia(query);
  store.snapshot = store.media.matches;
  store.media.addEventListener("change", store.handleChange);
}

function stopListening(store: MediaQueryStore) {
  if (!store.media) return;

  store.media.removeEventListener("change", store.handleChange);
  store.media = null;
}

export function useMediaQuery(query: string) {
  const subscribe = (listener: () => void) => {
    const store = getOrCreateStore(query);
    store.listeners.add(listener);
    startListening(query, store);

    return () => {
      store.listeners.delete(listener);
      if (store.listeners.size === 0) {
        stopListening(store);
      }
    };
  };

  const getSnapshot = () => getOrCreateStore(query).snapshot;

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
