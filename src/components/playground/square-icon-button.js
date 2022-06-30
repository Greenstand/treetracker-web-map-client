import { Button, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomButton = styled(Button)(() => ({
  minHeight: '48px',
  minWidth: '48px',
  '& .MuiButton-startIcon': {
    margin: 0,
  },
}));

function SquareIconButton(props) {
  const { icon, color, tooltip, onClick } = props;

  const button = (
    <CustomButton
      {...props}
      startIcon={icon}
      onClick={onClick}
      color={color}
      size="large"
     />
  );

  return tooltip ? <Tooltip title={tooltip}>{button}</Tooltip> : { button };
}

export default SquareIconButton;
