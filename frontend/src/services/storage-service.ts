const storage: {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
} =
  typeof window !== 'undefined' ?
    window.localStorage
  : {
      getItem: () => null,
      setItem: () => {},
    };

const get: (key: string) => string = (key) => {
  const storedValue = storage.getItem(`FT${key}`);
  return storedValue ? JSON.parse(storedValue) : null;
};

const set: (key: string, value: number | string | undefined | null) => void = (key, value) => {
  if (value !== undefined && value !== null) {
    storage.setItem(`FT${key}`, JSON.stringify(value));
  } else {
    storage.setItem(`FT${key}`, 'null');
  }
};

const store = {
  get,
  set,
};

export default store;