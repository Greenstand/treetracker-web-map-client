import TreeInfoDialog from './TreeInfoDialog';
import organization from '../../doc/examples/organizations/1.json';
import planter from '../../doc/examples/planters/940.json';
import tree from '../../doc/examples/trees/186734.json';
import { mountWithTheme as mount } from '../models/test-utils';

describe('TreeInfoDialog', () => {
  it('renders without organization', () => {
    mount(<TreeInfoDialog tree={tree} planter={planter} />);
  });

  it('renders withorganization', () => {
    mount(
      <TreeInfoDialog
        tree={tree}
        planter={planter}
        organization={organization}
      />,
    );
  });
});
