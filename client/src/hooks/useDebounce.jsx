import { useEffect, useState } from "react";

export const useDebounce = (value, delay) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const delayHandler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(delayHandler);
    };
  }, [value, delay]);

  return debounceValue;
};
