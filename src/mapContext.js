import { createContext, useContext, useMemo, useState } from 'react';

const MapContext = createContext({
  map: undefined,
  setMap: () => undefined,
});

export function MapContextProvider({ children }) {
  const [map, setMap] = useState(undefined);

  const value = useMemo(
    () => ({
      map,
      setMap,
    }),
    [map, setMap],
  );

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMapContext() {
  return useContext(MapContext);
}

// TODO maybe export consumer
