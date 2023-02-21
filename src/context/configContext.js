import {
  createContext,
  useReducer,
  useContext,
  useMemo,
  useEffect,
} from 'react';
import { useLocalStorage } from 'hooks/globalHooks';
import configReducer from 'models/config.reducer';

const ConfigContext = createContext(null);

export const initialState = {
  navbar: {
    logoUrl: 'http://localhost:3000/images/greenstand_logo.svg',
    items: [
      {
        id: 1,
        url: 'https://greenstand.org/',
        title: 'About Greenstand',
      },
      {
        id: 2,
        url: 'https://greenstand.org/treetracker/start-tracking',
        title: 'About Treetracker',
      },
      {
        id: 3,
        url: 'https://greenstand.org/contribute/donate',
        title: 'Contribute',
      },
      {
        id: 4,
        url: 'https://greenstand.org/blog',
        title: 'Blog',
      },
      {
        id: 5,
        url: 'https://greenstand.org/contact',
        title: 'Contact Us',
      },
    ],
  },
  map: {
    initialLocation: {
      lat: '',
      lon: '',
      zoom: '',
    },
  },
  globalMessage: {
    visible: false,
    severity: 'info',
    message:
      ' Scheduled maintenance from 3:00am PST to 6:00am PST. (This is an example)',
  },
};

export function ConfigProvider({ children }) {
  const [localStorageConfig, setLocalStorageConfig] = useLocalStorage(
    'config',
    null,
  );
  const [state, dispatch] = useReducer(
    configReducer,
    localStorageConfig ?? initialState,
  );

  useEffect(() => {
    setLocalStorageConfig(state);
  }, [state]);

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
