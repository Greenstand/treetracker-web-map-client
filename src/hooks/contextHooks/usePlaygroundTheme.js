import { useContext } from 'react';
import { PlaygroundContext } from 'context/playgroundContext';

const usePlaygroundTheme = () => {
  const { theme, setTheme } = useContext(PlaygroundContext);
  return [theme, setTheme];
};

export default usePlaygroundTheme;
