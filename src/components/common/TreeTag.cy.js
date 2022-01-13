import AccessTime from '@mui/icons-material/AccessTime';
import TreeTag from './TreeTag';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('TreeTag', () => {
  it('TreeTag', () => {
    const TreeTagValue = '8 Years';
    function Test() {
      return (
        <TreeTag
          title="Age"
          TreeTagValue={TreeTagValue}
          icon={<AccessTime />}
        />
      );
    }
    mount(<Test />);
  });
});
