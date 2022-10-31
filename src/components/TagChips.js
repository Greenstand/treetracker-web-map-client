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
        flexWrap: () => ['nowrap', 'wrap'],
        gap: (t) => [t.spacing(4), t.spacing(5)],
        overflow: 'scroll',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
      direction="row"
    >
      {tagItems.map((tagItem, i) => (
        <Chip
          sx={{
            height: (t) => [t.spacing(9), t.spacing(11)],
            border: `2px solid ${theme.palette.primary.main}`,
            borderRadius: theme.spacing(12.5),
            '& .MuiChip-label': {
              padding: (t) => [t.spacing(2.75, 3.5), t.spacing(3.125, 4.5)],
              typography: 'body1',
              color:
                i === activeTagIdx ? 'primary.contrastText' : 'text.secondary',
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
