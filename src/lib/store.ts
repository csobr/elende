import { writable, derived } from 'svelte/store';
import data from './data.json';
export const result = writable(data);
export const contracts = writable([]);
export const bidArea = writable([1, 2, 3, 4]);
export const price = writable('');

export const suppliers = derived(result, ($result) => {
  if ($result) {
    return $result.map((data) => data.supplier);
  }
  return [];
});

export const supplierData = derived(result, ($result) => {
  if ($result) {
    return Object.values($result.filter((data) => data.supplier));
  }
});
export function booleanStore(initial) {
  const isOpen = writable(initial);
  const { set, update } = isOpen;
  return {
    isOpen,
    open: () => set(true),
    close: () => set(false),
    toggle: () => update((n) => !n)
  };
}
