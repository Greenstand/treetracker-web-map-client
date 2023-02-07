import { useContext } from 'react';
import { PlaygroundContext } from 'context/playgroundContext';

const usePlaygroundTheme = () => {
  const { theme, setTheme, getPropByPath } = useContext(PlaygroundContext);
  return { theme, setTheme, getPropByPath };
};

export default usePlaygroundTheme;
