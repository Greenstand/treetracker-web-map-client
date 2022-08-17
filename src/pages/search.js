import { Box } from '@mui/material';
import axios from 'axios';
import Link from '../components/Link';
import SearchFilter from '../components/SearchFilter';
import { useEmbed } from '../hooks/globalHooks';

export default function Search(props) {
  const { list, keyword } = props;
  const isEmbed = useEmbed();

  return (
    <Box>
      <Box>
        <SearchFilter keywordOrigin={keyword} />
      </Box>
      <Box>
        {list.map((item) => (
          <Box key={item.id}>
            <Link
              href={`/trees/${item.id}?keyword=${keyword}${
                isEmbed ? '&embed=true' : ''
              }`}
            >
              {item.id}
            </Link>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export async function getServerSideProps({ query }) {
  const { keyword } = query;
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API}/trees/${keyword}`,
  );
  const list = [res.data];
  return {
    props: {
      list,
      keyword,
    },
  };
}

Search.isCLayout = true;
