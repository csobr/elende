import { writable } from 'svelte/store';
import hus from './hus.json';
import lgh from './lgh.json';
export const result = writable({ hus: hus, lgh: lgh });
export const suppliers = writable([]);
export const supplierData = writable([]);
export const contracts = writable([]);
export const bidArea = writable(['']);
export const price = writable('');
export const hours = writable('');

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
