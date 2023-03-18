import { createContext, useContext } from 'react';

export const defaultConfig = {
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
};

const ConfigContext = createContext(defaultConfig);

export function ConfigProvider({ children, config }) {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
}

export const useConfigContext = () => useContext(ConfigContext);

export default ConfigContext;
