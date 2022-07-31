import { useState } from 'react';
import FontAddInput from './FontAddInput';
import FontsList from './FontsList';
import { usePlaygroundFonts } from '../../context/playgroundContext';

const popularFonts = [
  { name: 'Lora', weights: [] },
  { name: 'Oswald', weights: [] },
  { name: 'PT Sans', weights: [] },
  { name: 'Raleway', weights: [] },
  { name: 'Slabo 27px', weights: [] },
  { name: 'Source Sans Pro', weights: [] },
  { name: 'Open Sans', weights: [] },
];

const getDefaultFonts = (fonts, defaultFonts) => {
  const temp = [];
  defaultFonts.forEach((font) => {
    // if (fonts.indexOf(font) < 0) temp.push(font);
    let found = false;
    for (let i = 0; i < fonts.length; i += 1) {
      if (font.name === fonts[i].name) {
        found = true;
        break;
      }
    }

    if (!found) temp.push(font);
  });
  return temp;
};

function FontCustomization() {
  const [fonts, setFonts] = usePlaygroundFonts();
  const defaultFonts = getDefaultFonts(fonts, popularFonts);

  return (
    <>
      <FontAddInput />
      <FontsList title="Popular Fonts" list={defaultFonts} canAddItems />
      <FontsList title="Available and Loaded Fonts" list={fonts} />
    </>
  );
}

export default FontCustomization;
