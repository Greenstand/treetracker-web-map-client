import React from 'react';

import { mountWithTheme as mount } from '../models/test-utils';
import InformationCard1 from './InformationCard1';

const info = {
  entityName: 'Greenway International',
  entityType: 'Planting Organisation',
  buttonText: 'Meet the Organization',
  cardImageSrc: '/src/images/greenway-international.png',
};

describe('InformationCard1', () => {
  it('InformationCard1', () => {
    mount(<InformationCard1 {...info} />);
  });
});
