import React from 'react';
import { mount } from '@cypress/react';
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
