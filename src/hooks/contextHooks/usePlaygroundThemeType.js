import { useContext } from 'react';
import { PlaygroundContext } from 'context/playgroundContext';

const usePlaygroundThemeType = () => {
  const { themeType, setThemeType } = useContext(PlaygroundContext);
  return [themeType, setThemeType];
};

export default usePlaygroundThemeType;
