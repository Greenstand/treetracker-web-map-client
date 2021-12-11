import AccessTime from '@mui/icons-material/AccessTime';
import React from 'react';

import { mountWithTheme as mount } from '../../models/test-utils';
import TreeTag from './TreeTag';

describe('TreeTag', () => {
  it('TreeTag', () => {
    const TreeTagValue = '8 Years';
    function Test() {
      return (
        <TreeTag
          title={'Age'}
          TreeTagValue={TreeTagValue}
          icon={<AccessTime />}
        />
      );
    }
    mount(<Test />);
  });
});
