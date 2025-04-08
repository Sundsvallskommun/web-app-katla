const storage: {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  // removeItem: (key: string) => void;
} =
  typeof window !== 'undefined' ?
    window.localStorage
  : {
      getItem: () => null,
      setItem: () => {},
    };

const get: (key: string) => string | null = (key) => {
  const storedValue = storage.getItem(`${process.env.NEXT_PUBLIC_APPLICATION}${key}`);
  return storedValue ? JSON.parse(storedValue) : null; // Handle null case
};

const set: (key: string, value: number | string | undefined | null) => void = (key, value) => {
  if (value !== undefined && value !== null) {
    storage.setItem(`${process.env.NEXT_PUBLIC_APPLICATION}${key}`, JSON.stringify(value));
  } else {
    storage.setItem(`${process.env.NEXT_PUBLIC_APPLICATION}${key}`, 'null');
  }
};

const store = {
  get,
  set,
};

export default store;
