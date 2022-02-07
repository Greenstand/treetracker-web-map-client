import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';

function TagChips({ tagItems, onSelectTag }) {
  const [activeTagIdx, setActiveTagIdx] = useState(null);
  const theme = useTheme();
  const handleTagChipClick = (i, tagItem) => {
    if (i === activeTagIdx) {
      setActiveTagIdx(null);
      onSelectTag('');
    }
    if (i !== activeTagIdx) {
      setActiveTagIdx(i);
      onSelectTag(tagItem);
    }
  };

  return (
    <Stack
      sx={{
        width: '100%',
        overflow: 'scroll',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
      direction="row"
      spacing={{ xs: 4, sm: 4, md: 4, lg: 5, xl: 5 }}
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
            handleTagChipClick(i, tagItem);
          }}
          key={tagItem}
        />
      ))}
    </Stack>
  );
}

export default TagChips;
