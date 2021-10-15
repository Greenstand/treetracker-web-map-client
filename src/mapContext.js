// The context to handle the map

const MapContext = React.createContext({
  map: undefined,
  setMap: () => undefined,
});

export function MapContextProvider({ children }) {
  const [map, setMap] = React.useState(undefined);

  return (
    <MapContext.Provider value={{ map, setMap }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext() {
  return React.useContext(MapContext);
}

// TODO maybe export consumer
