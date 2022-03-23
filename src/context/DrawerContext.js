import { createContext, useState, useContext } from 'react';

export const DrawerContext = createContext();

export const useDrawerContext = () => useContext(DrawerContext);

export function DrawerProvider({ children }) {
  const [titlesData, setTitlesData] = useState({
    name: '',
    firstName: '',
    lastName: '',
    createdTime: '',
    treeId: '',
    verifiedToken: '',
    verifiedTree: '',
  });

  return (
    <DrawerContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        titlesData,
        setTitlesData,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
}
