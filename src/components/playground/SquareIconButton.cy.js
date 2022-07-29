import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SquareIconButton from './SquareIconButton';
import { mountWithTheme as mount } from '../../models/test-utils';

const handleClick = () => {
  console.log('clicked button');
};

describe('Square Icon Button', () => {
  it('renders without tooltip', () => {
    mount(<SquareIconButton icon={<RestartAltIcon />} onClick={handleClick} />);
  });

  it('renders with tooltip', () => {
    mount(
      <SquareIconButton
        tooltip="tooltip here"
        icon={<RestartAltIcon />}
        onClick={handleClick}
      />,
    );
  });

  it('renders with custom color', () => {
    mount(
      <SquareIconButton
        color="secondary"
        icon={<RestartAltIcon />}
        onClick={handleClick}
      />,
    );
  });
});
