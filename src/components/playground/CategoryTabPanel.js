import { Box } from '@mui/material';

function CategoryTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`theme-category-tabpanel-${index}`}
      aria-labelledby={`theme-category-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

// helper function
export const getTabProps = (index) => ({
  id: `theme-category-tab-${index}`,
  'aria-controls': `theme-category-tabpanel-${index}`,
});

export default CategoryTabPanel;
