import { useContext } from 'react';
import { PlaygroundContext } from 'context/playgroundContext';

const usePlaygroundFonts = () => {
  const { fonts, setFonts } = useContext(PlaygroundContext);
  return [fonts, setFonts];
};

export default usePlaygroundFonts;
