import React from 'react';
import ImageShower from './ImageShower';
import { mountWithTheme as mount } from '../models/test-utils';

describe('ImageShower', () => {
  it('ImageShower', () => {
    function Test() {
      const [isOpen, setOpen] = React.useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            show
          </button>
          <ImageShower
            open={isOpen}
            src="xxxx"
            title="xxxxx"
            onClose={() => setOpen(false)}
          />
        </>
      );
    }
    mount(<Test />);
    cy.contains('show').click();
  });
});
