import { useContext } from 'react';
import { PlaygroundUtilsContext } from 'context/playgroundContext';

const usePlaygroundUtils = () => {
  const { resetTheme, setPropByPath } = useContext(PlaygroundUtilsContext);
  return { resetTheme, setPropByPath };
};

export default usePlaygroundUtils;
