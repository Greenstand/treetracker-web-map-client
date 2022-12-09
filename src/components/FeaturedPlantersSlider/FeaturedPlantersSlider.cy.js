import FeaturedPlantersSlider from './index';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('Featured Planters Slider', () => {
  it('it shows featured organization', () => {
    // fake data
    const organizations = [
      {
        id: '115059',
        logo_url: 'https://picsum.photos/id/10/208',
        name: 'Organization A',
      },
      {
        id: '115060',
        logo_url: 'https://picsum.photos/id/10/208',
        name: 'Organization B',
      },
      {
        id: '115061',
        logo_url: 'https://picsum.photos/id/10/208',
        name: 'Organization C',
      },
      {
        id: '115062',
        logo_url: 'https://picsum.photos/id/10/208',
        name: 'Organization D',
      },
      {
        id: '115063',
        logo_url: 'https://picsum.photos/id/10/208',
        name: 'Organization E',
      },
      {
        id: '115064',
        logo_url: 'https://picsum.photos/id/10/208',
        name: 'Organization F',
      },
      {
        id: '115065',
        logo_url: 'https://picsum.photos/id/10/208',
        name: 'Organization G',
      },
      {
        id: '115064',
        logo_url: 'https://picsum.photos/id/10/208',
        name: 'Organization H',
      },
      {
        id: '115065',
        logo_url: 'https://picsum.photos/id/10/208',
        name: 'Organization I',
      },
    ];
    mount(
      <FeaturedPlantersSlider
        planters={organizations}
        link={(id) => `/organizations/${id}`}
        color="secondary"
      />,
    );
  });
});
