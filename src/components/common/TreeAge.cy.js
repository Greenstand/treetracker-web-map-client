import AccessTime from '@material-ui/icons/AccessTime';
import React from 'react';

import { mountWithTheme as mount } from '../../models/test-utils';
import TreeAge from './TreeAge';

describe('TreeAge', () => {
  it('TreeAge', () => {
    const treeAgeValue = '8 Years';
    function Test() {
      return (
        <TreeAge title={'Age'} treeAge={treeAgeValue} icon={<AccessTime />} />
      );
    }
    mount(<Test />);
  });
});
