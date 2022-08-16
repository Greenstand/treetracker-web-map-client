import { useContext } from 'react';
import { CustomThemeContext } from 'context/themeContext';

function useCustomThemeContext() {
  return useContext(CustomThemeContext);
}

export default useCustomThemeContext;
