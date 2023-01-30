import {
  createContext,
  useReducer,
  useContext,
  useMemo,
  useEffect,
} from 'react';
import { useLocalStorage } from 'hooks/globalHooks';
import { defaultConfig } from './configContext';
import configReducer from '../models/config.reducer';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [localStorageConfig, setLocalStorageConfig] = useLocalStorage(
    'config',
    null,
  );
  const [state, dispatch] = useReducer(
    configReducer,
    localStorageConfig ?? defaultConfig,
  );

  useEffect(() => {
    setLocalStorageConfig(state);
  }, [setLocalStorageConfig, state]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboardContext = () => useContext(DashboardContext);

export default DashboardContext;
