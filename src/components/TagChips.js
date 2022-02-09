import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';

function TagChips({ tagItems, onSelectTag }) {
  const [activeTagIdx, setActiveTagIdx] = useState(0);
  const theme = useTheme();

  return (
    <Stack
      sx={{
        width: '100%',
        flexWrap: 'wrap',
        gap: theme.spacing(5),
        [theme.breakpoints.down('md')]: {
          flexWrap: 'nowrap',
          gap: theme.spacing(4),
          overflow: 'scroll',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
      }}
      direction="row"
    >
      {tagItems.map((tagItem, i) => (
        <Chip
          sx={{
            height: theme.spacing(11),
            border: `2px solid ${theme.palette.primary.main}`,
            borderRadius: theme.spacing(12.5),
            padding: theme.spacing(3.125, 4.5),
            [theme.breakpoints.down('md')]: {
              height: theme.spacing(9),
              padding: theme.spacing(2.75, 3.5),
            },
            '& .MuiChip-label': {
              padding: theme.spacing(0),
              typography: 'body1',
              color:
                i === activeTagIdx
                  ? theme.palette.common.white
                  : theme.palette.textSecondary.main,
            },
          }}
          label={tagItem}
          color="primary"
          variant={i === activeTagIdx ? 'filled' : 'outlined'}
          onClick={() => {
            setActiveTagIdx(i);
            onSelectTag(tagItem);
          }}
          key={tagItem}
        />
      ))}
    </Stack>
  );
}

export default TagChips;
