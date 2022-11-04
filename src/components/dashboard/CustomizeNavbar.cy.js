import { useState } from 'react';
import { mountWithTheme as mount } from 'models/test-utils';
import CustomizeNavbar from './CustomizeNavbar';

const dummyData = [
  {
    title: 'Greenstand',
    url: '/',
  },
  {
    title: 'Partnerships',
    url: '/partnerships',
  },
  {
    title: 'TreeTracker',
    url: '/treetracker',
  },
];

describe('CustomizeNavbar', () => {
  it('renders', () => {
    function Test() {
      const [formFields, setFormFields] = useState(dummyData);
      return (
        <CustomizeNavbar
          formFields={formFields}
          setFormFields={setFormFields}
        />
      );
    }
    mount(<Test />);
  });
});
