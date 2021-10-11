import React from 'react';

import { mountWithTheme as mount } from '../models/test-utils';
import TreeAge from './TreeAge';

describe('TreeAge', () => {
  it('TreeAge', () => {
    const treeAgeValue = '8 Years';
    function Test() {
      return <TreeAge treeAge={treeAgeValue} />;
    }
    mount(<Test />);
  });
});
