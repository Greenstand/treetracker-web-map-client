import { useContext } from 'react';
import { PlaygroundContext } from 'context/playgroundContext';

const usePlaygroundUtils = () => {
  const { resetTheme, getPropByPath, setPropByPath } =
    useContext(PlaygroundContext);
  return { resetTheme, getPropByPath, setPropByPath };
};

export default usePlaygroundUtils;
