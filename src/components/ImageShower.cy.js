import React from 'react';
import { mountWithTheme as mount } from 'models/test-utils';
import ImageShower from './ImageShower';

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
            src="/images/greenstand_logo_full.png"
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
