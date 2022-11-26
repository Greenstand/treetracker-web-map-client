import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import { Box, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import VerifiedBadge from 'components/VerifiedBadge';

function SearchResultItem({ title, content }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4px 8px',
        gap: '14px',
        fontFamily: 'Lato',
        color: '#6B6E70',
      }}
    >
      <WatchLaterOutlinedIcon />
      {title && <VerifiedBadge color="primary" badgeName={title} />}
      <Box>{content}</Box>
    </Box>
  );
}

export default function SearchHistoryDialog({ results }) {
  return (
    <Card
      sx={{
        position: 'absolute',
        width: '448px',
        maxHeight: '460px',
        boxSizing: 'border-box',
        height: 'fit-content',
        padding: '4px 6px',
        borderRadius: '14px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
        left: '16px',
        top: '76px',
      }}
    >
      <Typography
        sx={{
          paddingTop: '10px',
          paddingLeft: '25px',
          color: 'black',
          fontFamily: 'Lato',
        }}
      >
        Recent searches:
      </Typography>
      <List sx={{ pt: '4px' }}>
        {results.map((result, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <ListItem key={index}>
            <SearchResultItem title={result.type} content={result.content} />
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
