import FeaturedTreesSlider from './index';
import { mountWithTheme as mount } from '../../models/test-utils';

const treeImageLink =
  'https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2021.07.05.14.00.45_-3.2064076340000005_36.640772894_7b988c04-668e-48f5-b2e5-906f7d8374eb_IMG_20210705_132121_643781854.jpg';

describe('Featured Trees Slider', () => {
  it('it shows featured trees', () => {
    // fake data
    const trees = [
      {
        id: '115059',
        image_url: treeImageLink,
        species: 'Palm Tree',
      },
      {
        id: '115059',
        image_url: treeImageLink,
        species: 'Palm Tree',
      },
      {
        id: '115059',
        image_url: treeImageLink,
        species: 'Palm Tree',
      },
      {
        id: '115059',
        image_url: treeImageLink,
        species: 'Palm Tree',
      },
      {
        id: '115059',
        image_url: treeImageLink,
        species: 'Palm Tree',
      },
      {
        id: '115059',
        image_url: treeImageLink,
        species: 'Palm Tree',
      },
      {
        id: '115059',
        image_url: treeImageLink,
        species: 'Palm Tree',
      },
      {
        id: '115059',
        image_url: treeImageLink,
        species: 'Palm Tree',
      },
    ];
    mount(<FeaturedTreesSlider trees={trees} />);
  });
});
