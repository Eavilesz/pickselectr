import { Client } from "./types";

const STORAGE_KEY = "pickselectr_products";

let listeners: Array<() => void> = [];
let cache: Client[] | null = null;

function notifyListeners() {
  cache = null;
  listeners.forEach((l) => l());
}

export function subscribeToProducts(callback: () => void): () => void {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

export function getStoredProducts(): Client[] {
  if (typeof window === "undefined") return [];
  if (cache !== null) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    cache = raw ? JSON.parse(raw) : [];
    return cache!;
  } catch {
    cache = [];
    return cache;
  }
}

export function addStoredProduct(product: Client): void {
  const products = getStoredProducts();
  products.push(product);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  notifyListeners();
}

export function updateStoredProduct(
  slug: string,
  updates: Partial<Client>,
): void {
  const products = getStoredProducts().map((p) =>
    p.slug === slug ? { ...p, ...updates } : p,
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  notifyListeners();
}

export function deleteStoredProduct(slug: string): void {
  const products = getStoredProducts().filter((p) => p.slug !== slug);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  notifyListeners();
}
