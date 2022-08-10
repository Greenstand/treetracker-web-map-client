import { useState } from 'react';
import FontAddInput from './FontAddInput';
import FontsList from './FontsList';
import { usePlaygroundFonts } from '../../hooks/contextHooks';

const popularFonts = [
  'Lora',
  'Oswald',
  'PT Sans',
  'Raleway',
  'Slabo 27px',
  'Source Sans Pro',
  'Open Sans',
];

const getDefaultFonts = (fonts, defaultFonts) => {
  const temp = [];
  defaultFonts.forEach((font) => {
    if (fonts.indexOf(font) < 0) temp.push(font);
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
