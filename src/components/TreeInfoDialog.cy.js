import { mountWithTheme as mount } from 'models/test-utils';
import TreeInfoDialog from './TreeInfoDialog';
import grower from '../../doc/examples/growers/100.json';
import organization from '../../doc/examples/organizations/1.json';
import tree from '../../doc/examples/trees/186734.json';

describe('TreeInfoDialog', () => {
  it('renders without organization', () => {
    mount(<TreeInfoDialog tree={tree} grower={grower} />);
  });

  it('renders withorganization', () => {
    mount(
      <TreeInfoDialog
        tree={tree}
        grower={grower}
        organization={organization}
      />,
    );
  });
});
