import InformationCard1 from './InformationCard1';
import { mountWithTheme as mount } from '../models/test-utils';

const info = {
  entityName: 'Greenway International',
  entityType: 'Planting Organisation',
  buttonText: 'Meet the Organization',
  cardImageSrc: '/src/img/greenway-international.png',
  link: 'https://www.google.com',
};

describe('InformationCard1', () => {
  it('InformationCard1', () => {
    mount(<InformationCard1 {...info} />);
  });
});
