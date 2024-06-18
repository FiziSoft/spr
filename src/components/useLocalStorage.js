import { ref, watchEffect } from 'vue';

export function useLocalStorage(key, defaultValue = '') {
  const storedValue = localStorage.getItem(key);
  const data = ref(storedValue !== null ? storedValue : defaultValue);

  watchEffect(() => {
    if (data.value === null || data.value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, data.value);
    }
  });

  return data;
}
