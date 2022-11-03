import { createContext, useReducer, useContext, useMemo } from 'react';
import configReducer from '../models/config.reducer';

const ConfigContext = createContext(null);

const initialState = {
  navbar: {
    logoUrl: 'http://localhost:3000/images/greenstand_logo.svg',
    items: [],
  },
  map: {
    initialLocation: {
      lat: '',
      lon: '',
      zoom: '',
    },
  },
};

export function ConfigProvider({ children }) {
  const [state, dispatch] = useReducer(configReducer, initialState);

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state],
  );

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}

export const useConfigContext = () => useContext(ConfigContext);

export default ConfigContext;
