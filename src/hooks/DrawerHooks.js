import { createContext, useState } from 'react';

export const ContextApi = createContext();

export function DrawerProvider({ children }) {
  const [titles, setTitles] = useState({
    firstName: '',
    lastName: '',
    createdTime: '',
    treeId: '',
    verifiedToken: '',
    verifiedTree: '',
  });

  return (
    <ContextApi.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        titles,
        setTitles,
      }}
    >
      {children}
    </ContextApi.Provider>
  );
}
