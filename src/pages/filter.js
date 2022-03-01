import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import SearchFilter from '../components/SearchFilter';

export default function FilterPage() {
  const [filter, setFilter] = React.useState(null);
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('md'));

  React.useEffect(() => {
    const url = new URL(window.location.href);
    const timeline = url.searchParams.get('timeline');
    setFilter({
      startDate: timeline ? timeline.split('_')[0] : '',
      endDate: timeline ? timeline.split('_')[1] : '',
    });
  }, []);

  return (
    <Box>
      {!isMobileScreen && (
        <Box>
          <SearchFilter />
        </Box>
      )}
      <Box>
        <Typography variant="h6">Filter by:</Typography>
        <Typography variant="body1">
          Start Date: {filter && filter.startDate}
        </Typography>
        <Typography variant="body1">
          End Date: {filter && filter.startDate}
        </Typography>
        <Typography variant="body1">Found trees: 1,000,000</Typography>
      </Box>
    </Box>
  );
}

// export async function getServerSideProps({ query }) {
//   // const { keyword } = query;
//   // const res = await axios.get(`${process.env.NEXT_PUBLIC_API}/trees/${keyword}`)
//   // const list = [res.data];
//   return {
//     props: {
//       list,
//       keyword,
//     },
//   };
// }
