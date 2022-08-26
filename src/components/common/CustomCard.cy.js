import CustomCard from './CustomCard';
import CarbonIcon from '../../images/icons/carbon.svg';
import DollarIcon from '../../images/icons/dollar.svg';
import TokenIcon from '../../images/icons/token.svg';
import TreeIcon from '../../images/icons/tree.svg';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('mount Card', () => {
  it('CustomCard', () => {
    /* We simulate the props to be close to the real app */
    const propsTrees = {
      iconURI: TreeIcon,
      title: 'Trees',
      text: '12',
      disabled: false,
      sx: {
        height: 34,
        width: 26,
      },
    };

    const propsTokens = {
      iconURI: TokenIcon,
      title: 'Tokens',
      text: '12',
      disabled: false,
      sx: {
        height: 36,
        width: 36,
      },
    };

    const propsCurrentValue = {
      iconURI: DollarIcon,
      title: 'Current Value',
      text: '---',
      disabled: false,
      sx: {
        height: [24, 32],
        width: [24, 32],
        '& path': {
          stroke: 'rgb(107, 110, 112)',
          fill: 'rgb(107, 110, 112)',
        },
      },
    };

    const propsCarbonCapture = {
      iconURI: CarbonIcon,
      title: 'Carbon Capture',
      text: '---',
      disabled: false,
      sx: {
        height: [24, 32],
        width: [24, 32],
        '& path': {
          stroke: 'rgb(107, 110, 112)',
        },
      },
    };

    mount(
      <div>
        <CustomCard {...propsTrees} />
        <CustomCard {...propsTokens} />
        <CustomCard {...propsCurrentValue} />
        <CustomCard {...propsCarbonCapture} />
      </div>,
    );

    cy.viewport(390, 844);
    cy.screenshot();
    cy.viewport(1440, 800);
    cy.screenshot();
  });
});
