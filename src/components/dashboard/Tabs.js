import { ListItem } from '@mui/material';

export function Tab({ children, value, index, onClick }) {
  return (
    <ListItem
      onClick={() => onClick(index)}
      sx={{
        cursor: 'pointer',
        boxSizing: 'border-box',
        borderLeft:
          value === index ? `2px solid #61892F` : `2px solid #f5f5ff3`,
      }}
    >
      {children}
    </ListItem>
  );
}

export function TabPanel({ children, value, index }) {
  return value === index ? children : null;
}
