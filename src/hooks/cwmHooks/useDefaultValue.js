import { useEffect, useRef } from 'react';

const useDefaultValue = (value) => {
  const defaultValue = useRef(null);

  useEffect(() => {
    if (defaultValue.current !== null) return;
    defaultValue.current = value;
  }, [value]);

  return defaultValue;
};

export default useDefaultValue;
