import FeaturedTreesSlider from './index';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('Featured Trees Slider', () => {
  it('it shows featured trees', () => {
    // fake data
    const trees = [
      {
        id: '115059',
        image_url: 'https://picsum.photos/id/10/208',
        species: 'Palm Tree',
      },
      {
        id: '115059',
        image_url: 'https://picsum.photos/id/1037/208',
        species: 'Palm Tree',
      },
      {
        id: '115059',
        image_url: 'https://picsum.photos/id/106/208',
        species: 'Palm Tree',
      },
      {
        id: '115059',
        image_url: 'https://picsum.photos/id/107/208',
        species: 'Palm Tree',
      },
      {
        id: '115059',
        image_url: 'https://picsum.photos/id/108/208',
        species: 'Palm Tree',
      },
      {
        id: '115059',
        image_url: 'https://picsum.photos/id/109/208',
        species: 'Palm Tree',
      },
      {
        id: '115059',
        image_url: 'https://picsum.photos/id/111/208',
        species: 'Palm Tree',
      },
      {
        id: '115059',
        image_url: 'https://picsum.photos/id/112/208',
        species: 'Palm Tree',
      },
    ];
    mount(<FeaturedTreesSlider trees={trees} />);
  });
});
