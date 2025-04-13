import { useEffect, useState } from "react";

export const useDebounced = (value, delay = 500) => {
  const [debouncedValue, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};
