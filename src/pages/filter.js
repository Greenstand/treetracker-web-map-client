import { Box } from '@mui/material';
import log from 'loglevel';
import SearchFilter from '../components/SearchFilter';
import Filter from '../components/common/Filter';
import { useMapContext } from '../mapContext';

export default function Search() {
  const { map } = useMapContext();

  function handleFilter(filter) {
    log.warn('handleFilter', filter);
    if (!map) return;
    map.setFilters({
      timeline: `${filter.startDate}_${filter.endDate}`,
    });
    map.rerender();
    const url = new URL(window.location.href);
    url.searchParams.set('timeline', `${filter.startDate}_${filter.endDate}`);
    window.history.pushState('treetrakcer', '', url.href);
  }

  return (
    <Box>
      <Box>
        <SearchFilter />
      </Box>
      <Box>
        <Filter isFilterOpenInitial onFilter={handleFilter} />
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
