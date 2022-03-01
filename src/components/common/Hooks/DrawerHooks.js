import { createContext, useState } from 'react';

export const ContextApi = createContext();

export function DrawerProvider({ children }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [createdTime, setCreatedTime] = useState('');
  const [treeId, setTreeId] = useState('');
  const [verifiedToken, setVerifiedToken] = useState('');
  const [verifiedTree, setVerifiedTree] = useState('');

  return (
    <ContextApi.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        firstName,
        setFirstName,
        lastName,
        setLastName,
        createdTime,
        setCreatedTime,
        treeId,
        setTreeId,
        verifiedToken,
        setVerifiedToken,
        verifiedTree,
        setVerifiedTree,
      }}
    >
      {children}
    </ContextApi.Provider>
  );
}
